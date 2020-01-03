import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:async';
import 'compass_body.dart';
//import 'package:permission_handler/permission_handler.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  Geolocator geolocator = Geolocator();
  double heading, prevHeading;
  StreamSubscription<Position> positionStream ;

  @override
  Future initState()  {
    super.initState();
    //  PermissionHandler().requestPermissions([PermissionGroup.location]);
    geolocator.forceAndroidLocationManager = true;
    geolocator.checkGeolocationPermissionStatus();
        
  /*  checkPermission();
    _getLocation().then((position) {
      if (position==null || position.heading == null)
        setState(() {
          heading =0.0;
          prevHeading = 0.0;
        });
      else 
        setState(() {
          heading = position.heading;
          prevHeading = 0.0;
        });
    });
*/
    positionStream = geolocator.getPositionStream(LocationOptions(
        accuracy: LocationAccuracy.best, timeInterval: 1000))
        .listen((position) {
          if (position == null || position.heading==null) return;
          double head = position.heading;
          animate(head);
          setState(() {
            prevHeading = head;
            heading = head;
          });
    });
  }

  void animate(double head) async {
    double diff = 1.0;
    if (abs(head - prevHeading)>1.0) {
      if (head - prevHeading < 0) diff = -1.0;
      if (abs(head - prevHeading)>180) diff *= -1.0; // eg. 20 -> 340
      for (double h = prevHeading + diff; abs(h - head) > 1.1; h+= diff) {
        if (h>360) h = 0;
        else if (h<0) h = 360;
        setState(() {
          prevHeading = heading;
          heading = h;
        });
        await Future.delayed(new Duration(milliseconds: 15));
      }
    }
  }

  abs(double d) {
    return d<0.0 ? -1*d : d;
  }

  void checkPermission() {
    geolocator.checkGeolocationPermissionStatus().then((status) { print('status: $status'); });
    geolocator.checkGeolocationPermissionStatus(locationPermission: GeolocationPermission.locationAlways).then((status) { print('always status: $status'); });
    geolocator.checkGeolocationPermissionStatus(locationPermission: GeolocationPermission.locationWhenInUse)..then((status) { print('whenInUse status: $status'); });
  }
/*
  Future<Position> _getLocation() async {
    var currentLocation;
    try {
      currentLocation = await geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.best);
    } catch (e) {
      currentLocation = null;
    }
    return currentLocation;
  }
*/
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            //Text(heading == 0.0 ? "?" : heading.toString().substring(0,0)
            //),
            new CompassBody(heading == null ? 0.0 : heading)
                   ],
        ),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }

}
