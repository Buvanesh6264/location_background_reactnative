import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        resolve({ latitude, longitude });
      },
      (error) => {
        console.log('Geolocation error:', error.code, error.message);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};
