import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const LocationViewerScreen = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.25:5000/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  const generateMapHTML = () => {
    if (locations.length === 0) return '';

    const markers = locations.map(loc => `
      L.marker([${loc.latitude}, ${loc.longitude}])
        .addTo(map)
        .bindPopup("Time: ${new Date(loc.timestamp).toLocaleString()}");
    `).join('');

    const center = locations[0];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${center.latitude}, ${center.longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
          }).addTo(map);
          ${markers}
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: generateMapHTML() }}
          style={styles.map}
        />
      </View>
      <FlatList
        data={locations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Lat: {item.latitude}, Lng: {item.longitude}</Text>
            <Text>Time: {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { height: height * 0.4 },
  map: { flex: 1 },
  list: { padding: 10 },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  }
});

export default LocationViewerScreen;
