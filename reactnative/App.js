import React from 'react';
import {View, Text} from 'react-native';
import MyLocation from './MyLocation';

const App = () => {
  //const App: () => React$Node = () => {
  return (
    <View>
      <View>
        <Text>ReactNative</Text>
      </View>
      <View>
        <MyLocation />
      </View>
    </View>
  );
};

export default App;
