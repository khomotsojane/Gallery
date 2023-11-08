import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import db from '../Database';

export default function ViewPhotoScreen({ route }) {
  const { uri } = route.params;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM photos WHERE uri = ?', [uri], async (_, { rows }) => {
        const photoData = rows.raw()[0];
        const { latitude, longitude } = photoData;
        const locationInfo = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (!locationInfo) {
          locationInfo = [];
        }
        if (locationInfo.length > 0) {
          const { city, region, country } = locationInfo[0];
          setLocation(`${city}, ${region}, ${country}`);
        }
      });
    }, []);

    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={{ uri }} style={{ width: 300, height: 300 }} />
        {location && <Text style={{ marginTop: 10 }}>{`Location: ${location}`}</Text>}
      </SafeAreaView>
    );
  })
}
