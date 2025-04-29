// import Geolocation from 'react-native-geolocation-service';
// import axios from 'axios';
// import { PermissionsAndroid, Platform, Alert } from 'react-native';

// let locationInterval = null;

// export const startLocationUpdates = async () => {
//   console.log("started")
//   const hasPermission = await requestLocationPermission();
//   if (!hasPermission) {
//     Alert.alert('Permission denied', 'Location permission is required.');
//     return;
//   }

//   locationInterval = setInterval(() => {
//     Geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('Sending location:', latitude, longitude);

//         try {
//           await axios.post('http://192.168.1.25:5000/location', {
//             latitude,
//             longitude,
//           });
//         } catch (error) {
//           console.error('Failed to send location:', error);
//         }
//       },
//       (error) => {
//         console.log('Location error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 10000,
//         forceRequestLocation: true,
//       }
//     );
//   }, 50000);
// };

// export const stopLocationUpdates = () => {
//   console.log("stoped")
//   if (locationInterval) {
//     clearInterval(locationInterval);
//     locationInterval = null;
//     console.log('Location updates stopped.');
//   }
// };

// const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'App needs access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   }
//   return true;
// };

import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

let locationInterval = null;

export const startLocationUpdates = async () => {
  console.log("started");
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    Alert.alert('Permission denied', 'Location permission is required.');
    return;
  }

  locationInterval = BackgroundTimer.setInterval(() => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Sending location:', latitude, longitude);

        try {
          await axios.post('http://192.168.1.25:5000/location', {
            latitude,
            longitude,
          });
        } catch (error) {
          console.error('Failed to send location:', error);
        }
      },
      (error) => {
        console.log('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
        forceRequestLocation: true,
      }
    );
  }, 50000);
};

export const stopLocationUpdates = () => {
  console.log("stopped");
  if (locationInterval) {
    BackgroundTimer.clearInterval(locationInterval);
    locationInterval = null;
    console.log('Location updates stopped.');
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',      
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false; 
      
    }
  }
  return true;
};
