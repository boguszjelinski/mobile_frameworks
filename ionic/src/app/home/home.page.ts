import { Component, ViewChild, ElementRef  } from '@angular/core';
import { Geolocation ,GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  @ViewChild('myCanvas') canvas : ElementRef;
  canvasElement: any;

  private _CANVAS  : any;
  private ctx : any;
  
  circleRadius:number = 100;
  cx:number = 150;
  cy:number = 150;
  delay:number = 20;

  heading: number = undefined;
  prevHeading : number = undefined;
  watch: any;
  error: any;

  constructor(public platform: Platform, private geolocation: Geolocation) {
  }

  ngAfterViewInit(){
    let options : GeolocationOptions = {
      enableHighAccuracy: true
    };
    this.platform.ready().then(() => {
      this.watch = this.geolocation.watchPosition(options); 
      this.watch.subscribe((resp) => {
        if (resp.coords && resp.coords.heading != 0) {
          this.prevHeading = this.heading;
          this.heading = resp.coords.heading;
          let wasAnimated : boolean;
          wasAnimated = this.animate();
        } // else in RED
      }, error => this.error = error );
    });
    this._CANVAS 	    = this.canvas.nativeElement;
    this._CANVAS.width  	= 300;
    this._CANVAS.height 	= 300;
    this.initialiseCanvas();
    this.drawCompass(0);
  }

  animate() : boolean {
    if (this.heading && this.prevHeading) {
      let diff = 2.0;
      if (this.prevHeading && Math.abs(this.heading - this.prevHeading) > 1.1) {
        if (this.heading - this.prevHeading < 0) {
          diff = -2.0;
        }
        if (Math.abs(this.heading - this.prevHeading) > 180) {
          diff *= -1.0; // eg. 20 -> 340
        }
        let h = this.prevHeading + diff;
        let i = 1;
        while (Math.abs(h - this.heading) > 2.1) {
          if (h > 360) {
            h = 0;
          } else if (h < 0) {
            h = 360;
          }
          var timer = () => {
            var hh = h;
            var ii = i;
            setTimeout(() => {
              this.drawCompass(hh);
            }, ii * this.delay);
          };
          timer();
          h += diff;
          i++;
        }
        return true;
      }
    }
    return false;
  }

  initialiseCanvas() {
    if(this._CANVAS.getContext) {
      this.ctx = this._CANVAS.getContext('2d');
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this._CANVAS.width, this._CANVAS.height);
  }
  
  private drawCompass (heading: number) : void {
    let labels = ['N','3','6','E','12','15','S','21','24','W','30','33'];    
    this.clearCanvas();
    this.triangle();
    this.ctx.font = '15px Arial';
    this.ctx.fillStyle = 'blue'
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, this.circleRadius, 0, 2*Math.PI);
    this.ctx.stroke();
    for (let i=0; i<12; i++)
        this.putText(i*30, heading, this.circleRadius-20, labels[i]); // 30: step of degree 
    this.ctx.stroke();
  }

  toRadians = (angle) => { return angle * (Math.PI / 180); }

  private triangle () {
    this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    this.ctx.moveTo(this.cx, this.cy-this.circleRadius-2);
    this.ctx.lineTo(this.cx-10, this.cy-this.circleRadius-12);
    this.ctx.lineTo(this.cx+10, this.cy-this.circleRadius-12);
    this.ctx.lineTo(this.cx, this.cy-this.circleRadius-2);
    this.ctx.fill();
  }
  private putText (degree:number, heading: number, radius: number, label: string):void {    
    let angle:number = degree - heading;
    let sinus:number = Math.sin(this.toRadians(angle));
    let cosinus: number = Math.cos(this.toRadians(angle));
    let x = this.cx + radius*sinus-6;
    let y = this.cy - radius*cosinus+5;
    this.ctx.fillText(label,x,y);
    let x1 = this.cx + (this.circleRadius-8)*sinus;
    let y1 = this.cy - (this.circleRadius-8)*cosinus;
    let x2 = this.cx + this.circleRadius*sinus;
    let y2 = this.cy - this.circleRadius*cosinus;
    this.ctx.moveTo(x1,y1);
    this.ctx.lineTo(x2, y2);
  }  
}
