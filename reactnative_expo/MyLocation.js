import React, {Component} from 'react';
import Canvas from 'react-native-canvas';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Text, View } from 'react-native';

class MyLocation extends Component {
  state = {
    lastLoc: undefined,
    currentLoc: undefined,
    error: '',
  };
  watchID = null;
  _CONTEXT = null;
  circleRadius = 100;
  cx = 150;
  cy = 150;
  locationSubscription;

  componentDidMount = () => {
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ currentLoc: location });
    };

    Location.watchPositionAsync({
        accuracy : Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
    }, position => {
        this.setState({ currentLoc: position });
        this.drawCompass(position.coords.heading);
      });
  }

  componentWillUnmount = () => {
  };
/*
  render(){
    let text = 'Waiting..';
    let json = "{ 'heading' : 'waiting ...' }";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
      json = "{ 'heading' : 'err' }";
    } else if (this.state.currentLoc) {
      text = this.state.currentLoc.coords.heading; //JSON.stringify(this.state.currentLoc);
      //json = JSON.parse(text);
    }

    return (
      <View>
        <Text>{text}</Text>
      </View>
    );
  }
*/
  render() {
    return (
      <View>
        <Canvas ref={this.handleCanvas} />
      </View>
    );
  }

  handleCanvas = canvas => {
    if (canvas) {
      this._CONTEXT = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      //this.drawCompass(0);
    }
  };

  clearCanvas() {
    this._CONTEXT.fillStyle = 'rgba(0, 0, 0, 0)';
    this._CONTEXT.clearRect(0, 0, 300, 600);
    this._CONTEXT.stroke();
    this._CONTEXT.fillStyle = '#FFFFFF';
    this._CONTEXT.fillRect(0, 0, 300, 600);
  }

  drawCompass(heading) {
    let labels = [
      'N',
      '3',
      '6',
      'E',
      '12',
      '15',
      'S',
      '21',
      '24',
      'W',
      '30',
      '33',
    ];
    this.clearCanvas();
    // trangle

    this._CONTEXT.fillStyle = 'red';
    this._CONTEXT.strokeStyle = 'red';
    //this._CONTEXT.fillText(this.state.currentLoc, 20, 20); //
    this._CONTEXT.beginPath();
    this._CONTEXT.moveTo(this.cx, this.cy - this.circleRadius - 2);
    this._CONTEXT.lineTo(this.cx - 10, this.cy - this.circleRadius - 12);
    this._CONTEXT.lineTo(this.cx + 10, this.cy - this.circleRadius - 12);
    this._CONTEXT.lineTo(this.cx, this.cy - this.circleRadius - 2);
    this._CONTEXT.fill();
    this._CONTEXT.fillStyle = 'blue';
    if (heading === 0) {
      this._CONTEXT.strokeStyle = 'red';
    } else {
      this._CONTEXT.strokeStyle = 'black';
    }
    this._CONTEXT.lineWidth = 2;
    this._CONTEXT.beginPath();
    this._CONTEXT.arc(this.cx, this.cy, this.circleRadius, 0, 2 * Math.PI);
    this._CONTEXT.stroke();
    this._CONTEXT.beginPath();
    for (let i = 0; i < 12; i++) {
      this.putText(i * 30, heading, this.circleRadius - 20, labels[i]);
    } // 30: step of degree
    this._CONTEXT.closePath();
    this._CONTEXT.stroke();
  }

  toRadians = angle => {
    return angle * (Math.PI / 180);
  };

  putText(degree, heading, radius, label) {
    let angle = degree - heading;
    let sinus = Math.sin(this.toRadians(angle));
    let cosinus = Math.cos(this.toRadians(angle));
    let x = this.cx + radius * sinus - 6;
    let y = this.cy - radius * cosinus + 5;
    this._CONTEXT.font = '15px Arial';
    this._CONTEXT.fillText(label, x, y);
    let x1 = this.cx + (this.circleRadius - 8) * sinus;
    let y1 = this.cy - (this.circleRadius - 8) * cosinus;
    let x2 = this.cx + this.circleRadius * sinus;
    let y2 = this.cy - this.circleRadius * cosinus;
    this._CONTEXT.moveTo(x1, y1);
    this._CONTEXT.lineTo(x2, y2);
  }
  
}

export default MyLocation;
