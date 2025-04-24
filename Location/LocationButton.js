import React, { useState } from 'react';
import { View, Button, Text, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './permissions'; 

const LocationButton = () => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert('Location Error', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Unexpected Error', 'Something went wrong while getting location.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <Text style={{ marginTop: 20 }}>
          Latitude: {location.latitude}{'\n'}Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default LocationButton;
