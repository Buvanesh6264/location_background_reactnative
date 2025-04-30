import React, { useState } from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { startLocationUpdates, stopLocationUpdates } from './LocationService';
import LocationViewerScreen from './LocationViewerScreen';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleStart = async () => {
    await startLocationUpdates();
    setIsTracking(true);
  };

  const handleStop = async () => {
    await stopLocationUpdates();
    setIsTracking(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Start Location Updates"
        onPress={handleStart}
        disabled={isTracking}
      />
      <Button
        title="Stop Location Updates"
        onPress={handleStop}
        disabled={!isTracking}
      />
      <Button
        title="Show Map"
        onPress={() => navigation.navigate('Map')}
      />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={LocationViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
});

export default App;
