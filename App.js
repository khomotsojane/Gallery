
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './components/CameraScreen';
import GalleryScreen from './components/GalleryScreen';
import db from './Database'; // Import the database configuration



const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Create tables for photos and location data
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, latitude REAL, longitude REAL)'
      );
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraScreen">
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
        <Stack.Screen name="ViewPhotoScreen" component={ViewPhotoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
