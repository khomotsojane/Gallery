import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import * as Location from 'expo-location';
import db from '../Database';

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: true, // Enable EXIF data including location
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);

    const location = await Location.getCurrentPositionAsync({});
    
    // Insert the photo and location data into the SQLite database
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO photos (uri, latitude, longitude) VALUES (?, ?, ?)',
        [newPhoto.uri, location.coords.latitude, location.coords.longitude]
      );
    });

    setPhoto(newPhoto);
  };

  const savePhoto = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setPhoto(undefined);
      navigation.navigate('GalleryScreen');
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} />
        <Button title="Share" onPress={() => shareAsync(photo.uri)} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : null}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});
