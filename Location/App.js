import React, { useState } from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';
import { startLocationUpdates, stopLocationUpdates } from './LocationService';

const App = () => {
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
    </SafeAreaView>
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
