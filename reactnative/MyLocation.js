import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Canvas from 'react-native-canvas';
import {View} from 'react-native';

class MyLocation extends Component {
  _CONTEXT = null;
  radius = 100;
  delay = 100;
  cx = 150;
  cy = 150;

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
  /*
  animate(head) {
    if (head && this.lastLoc && this.lastLoc.coords) {
      let diff = 1.0;
      let prevHeading = this.lastLoc.coords.heading;
      if (prevHeading && Math.abs(head - prevHeading) > 1.0) {
        if (head - prevHeading < 0) {
          diff = -1.0;
        }
        if (Math.abs(head - prevHeading) > 180) {
          diff *= -1.0; // eg. 20 -> 340
        }
        let h = prevHeading + diff;
        let i = 1;
        while (Math.abs(h - head) > 1.1) {
          if (h > 360) {
            h = 0;
          } else if (h < 0) {
            h = 360;
          }
          var timer = () => {
            setTimeout(() => {
              this.drawCompass(h);
            }, i * this.delay);
          };
          timer();
          timer(h, i);
          h += diff;
          i++;
        }
        return i;
      }
    }
    return 0;
  }
  */
  handleCanvas = canvas => {
    if (canvas) {
      this._CONTEXT = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      this.drawCompass(0);
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

    if (!this._CONTEXT) {
      return;
    }
    this.clearCanvas();
    // trangle
    this._CONTEXT.fillStyle = 'red';
    this._CONTEXT.strokeStyle = 'red';
    this._CONTEXT.beginPath();
    this._CONTEXT.moveTo(this.cx, this.cy - this.radius - 2);
    this._CONTEXT.lineTo(this.cx - 10, this.cy - this.radius - 12);
    this._CONTEXT.lineTo(this.cx + 10, this.cy - this.radius - 12);
    this._CONTEXT.lineTo(this.cx, this.cy - this.radius - 2);
    this._CONTEXT.fill();
    this._CONTEXT.fillStyle = 'blue';
    if (heading === 0) {
      this._CONTEXT.strokeStyle = 'red';
    } else {
      this._CONTEXT.strokeStyle = 'black';
    }
    this._CONTEXT.lineWidth = 2;
    this._CONTEXT.beginPath();
    this._CONTEXT.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
    this._CONTEXT.stroke();
    this._CONTEXT.beginPath();
    for (let i = 0; i < 12; i++) {
      this.putText(i * 30, heading, this.radius, labels[i]);
    } // 30: step of degree
    this._CONTEXT.closePath();
    this._CONTEXT.stroke();
  }

  toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  putText(degree, heading, r, label) {
    let angle = degree - heading;
    let sinus = Math.sin(this.toRadians(angle));
    let cosinus = Math.cos(this.toRadians(angle));
    let x = this.cx + (r - 20) * sinus - 6;
    let y = this.cy - (r - 20) * cosinus + 5;
    this._CONTEXT.font = '15px Arial';
    this._CONTEXT.fillText(label, x, y);
    let x1 = this.cx + (r - 8) * sinus;
    let y1 = this.cy - (r - 8) * cosinus;
    let x2 = this.cx + r * sinus;
    let y2 = this.cy - r * cosinus;
    this._CONTEXT.moveTo(x1, y1);
    this._CONTEXT.lineTo(x2, y2);
  }
}

export default MyLocation;
