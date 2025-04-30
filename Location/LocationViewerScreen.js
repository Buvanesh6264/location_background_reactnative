import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const LocationViewerScreen = () => {
  const [locations, setLocations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); 

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://192.168.1.17:5000/getlocations');
      setLocations(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLocations().finally(() => setRefreshing(false));
  }, []);

  const generateMapHTML = () => {
    if (locations.length === 0) {
      return `
        <!DOCTYPE html>
        <html><body><p>No locations found.</p></body></html>
      `;
    }
  
    const sortedLocations = [...locations].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
    const markers = sortedLocations.map((loc, index) => {
      const time = new Date(loc.timestamp).toLocaleString();
      return `
        L.marker([${loc.latitude}, ${loc.longitude}], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: \`
              <div class="marker-pin"></div>
              <div class="marker-number">${index + 1}</div>
            \`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
          })
        })
        .addTo(map)
        .bindPopup("Name: ${loc.user || 'Unknown'}<br>Time: ${time}");
      `;
    }).join('');
  
    const center = sortedLocations[0];
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 100%; width: 100%; margin:0; padding:0; }
          body, html { margin:0; padding:0; height:100%; }
  
          .custom-div-icon {
            position: relative;
          }
          .marker-pin {
            width: 15px;
            height: 15px;
            background-color: #2A81CB;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            position: absolute;
            top: 0;
            left: 0;
            border: 2px solid white;
          }
          .marker-number {
            position: absolute;
            top: 3px;
            left: 2px;
            width: 16px;
            height: 16px;
            text-align: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            z-index: 10;
          }
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading locations...</Text>
        </View>
      ) : (
        <>
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
                <Text>Name: {item.user || 'Unknown'}</Text>
                <Text>Lat: {item.latitude}, Lng: {item.longitude}</Text>
                <Text>Time: {new Date(item.timestamp).toLocaleString()}</Text>
              </View>
            )}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
