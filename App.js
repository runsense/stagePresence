// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './src/navigation/Main'


function App() {
  return (
      //Navigation en stack
      <NavigationContainer>
          //main dans ./src/navigation
          <Main/>
      </NavigationContainer>
  );
}

export default App;
