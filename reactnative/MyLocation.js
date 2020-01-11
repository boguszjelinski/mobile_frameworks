import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Canvas from 'react-native-canvas';
import {View} from 'react-native';

class MyLocation extends Component {
  ctx = null;
  radius = 100;
  delay = 100;
  cx = 150;
  cy = 150;
  labels = ['N', '3', '6', 'E', '12', '15', 'S', '21', '24', 'W', '30', '33'];

  state = {
    prevHead: undefined,
    currHead: undefined,
    error: '',
  };

  componentDidMount = () => {
    Geolocation.setRNConfiguration({
      enableHighAccuracy: true,
    });

    this.watchID = Geolocation.watchPosition(
      position => {
        if (position && position.coords) {
          this.drawCompass(position.coords.heading);
        }
      },
      error => {},
      {timeout: 1000, enableHighAccuracy: true, distanceFilter: 1},
    );
  };

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  };

  render() {
    return (
      <View>
        <Canvas ref={this.handleCanvas} />
      </View>
    );
  }
 
  handleCanvas = canvas => {
    if (canvas) {
      this.ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      this.drawCompass(0);
    }
  };

  clearCanvas() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, 300, 600);
  }

  drawCompass(heading) {
    if (!this.ctx) {
      return;
    }
    this.clearCanvas();
    this.triangle();
    this.ctx.fillStyle = 'blue';
    if (heading === 0) {
      this.ctx.strokeStyle = 'red';
    } else {
      this.ctx.strokeStyle = 'black';
    }
    this.ctx.lineWidth = 2;
    // circle
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    // labels with short lines depicting directions
    for (let i = 0; i < 12; i++) {
      this.putText(i * 30, heading, this.radius, this.labels[i]);
    } // 30: step of degree
    this.ctx.stroke();
  }

  toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  triangle() {
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    this.ctx.moveTo(this.cx, this.cy - this.radius - 2);
    this.ctx.lineTo(this.cx - 10, this.cy - this.radius - 12);
    this.ctx.lineTo(this.cx + 10, this.cy - this.radius - 12);
    this.ctx.lineTo(this.cx, this.cy - this.radius - 2);
    this.ctx.fill();
  }

  putText(degree, heading, r, label) {
    let angle = degree - heading;
    let sinus = Math.sin(this.toRadians(angle));
    let cosinus = Math.cos(this.toRadians(angle));
    let x = this.cx + (r - 20) * sinus - 6;
    let y = this.cy - (r - 20) * cosinus + 5;
    this.ctx.font = '15px Arial';
    this.ctx.fillText(label, x, y);
    let x1 = this.cx + (r - 8) * sinus;
    let y1 = this.cy - (r - 8) * cosinus;
    let x2 = this.cx + r * sinus;
    let y2 = this.cy - r * cosinus;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
  }
}

export default MyLocation;
