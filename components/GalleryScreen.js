import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableHighlight } from 'react-native';
import db from '../Database';;

export default function GalleryScreen({ navigation }) {
  const [savedPhotos, setSavedPhotos] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM photos', [], (_, { rows }) => {
        const photoData = rows.raw();
        setSavedPhotos(photoData);
      });
    }, []);

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, margin: 10 }}>Gallery</Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {savedPhotos.map((data) => (
            <TouchableHighlight
              key={data.id}
              onPress={() => navigation.navigate('ViewPhotoScreen', { uri: data.uri })}
            >
              <Image
                source={{ uri: data.uri }}
                style={{ width: 150, height: 150, margin: 5 }}
              />
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  })
}
