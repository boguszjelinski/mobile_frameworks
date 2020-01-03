import 'package:flutter/material.dart';
import 'dart:math';

class CompassBody extends StatefulWidget {
  final double heading;
  
  CompassBody(this.heading);

  @override
  _StatefulWidgetExampleState createState() => _StatefulWidgetExampleState();
}

class _StatefulWidgetExampleState extends State<CompassBody> {
  
  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          new CustomPaint(
            painter: new CompassPainter(widget.heading)
          ),
        ],
    );
  }
}

class CompassPainter extends CustomPainter{
  double heading;

  CompassPainter(double loc){
      this.heading = loc;
  }

  @override
  void paint(Canvas canvas, Size size) {
    drawCompass(canvas, heading);
  }

  void drawCompass (Canvas canvas, double hd) {
    final double width = 1.0;
    final double sze = 0;
    final double radius = 100;
    
    List<String> labels = ['N','3','6','E','12','15','S','21','24','W','30','33'];

    //canvas.save();
    // canvas.translate(radius, radius);
    
    Paint line = new Paint()
      ..color = hd == 0.0 ? Colors.red : Colors.black
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke
      ..strokeWidth = width;

    Offset center  = new Offset(sze, sze);
    canvas.drawCircle(center, radius, line);
    drawTriangle(sze, sze, radius, canvas);

    double i =0;
    for (String lab in labels) {
        this.putText(canvas, sze, sze, i*30, hd, radius, lab, line);
        i++;
    }
    //canvas.restore();
  }

  void drawTriangle (double cx, double cy, double radius, Canvas canvas) {
    Paint red = new Paint()
      ..color = Colors.red
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    Path path = new Path();
    path.moveTo(cx, cy-radius-2);
    path.lineTo(cx-5, cy-radius-5-2);
    path.lineTo(cx+5, cy-radius-5-2);
    path.lineTo(cx, cy-radius-2);
    canvas.drawPath(path, red);
  }

  putText (canvas, double cx, double cy, double degree, double hdng, double radius, label, color) {
    TextSpan span = new TextSpan(text: label, style: new TextStyle(color: Colors.blue[800]));
    TextPainter tp = new TextPainter(text: span, textAlign: TextAlign.left, textDirection: TextDirection.ltr);
    tp.layout();

    Path path = new Path();
    double angle = degree - hdng;
    double sinus = sin(toRadians(angle));
    double cosinus = cos(toRadians(angle));
    double x = cx + (radius-18)*sinus-6;
    double y = cy - (radius-18)*cosinus-10;
    //canvas.fillText(label,x,y);
    double x1 = cx + (radius-8)*sinus;
    double y1 = cy - (radius-8)*cosinus;
    double x2 = cx + (radius)*sinus;
    double y2 = cy - (radius)*cosinus;
    path.moveTo(x1,y1);
    path.lineTo(x2, y2);
    tp.paint(canvas, new Offset(x, y));
    canvas.drawPath(path, color);
  }

  toRadians (angle)  {
    return angle * (pi / 180);
  }
 
  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}
