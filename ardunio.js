/*import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeviceModal from "./connection";

import useBLE from "./useBLE";

const ArdunioTest = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    onHeartRateUpdate,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Arduino Data:</Text>
           
            <Text style={styles.heartRateText}>Heart Rate: {heartRate} bpm</Text>
            
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});

export default ArdunioTest;*/



import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const ArduinoTest = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [data, setData] = useState('');
  const [connected, setConnected] = useState(false);
  const [bleManager, setBleManager] = useState(null);

  const initializeBluetooth = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      if (
        granted['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
        granted['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
        granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      ) {
        // Ensure BleManager is initialized only once
        if (!bleManager) {
          const manager = new BleManager();
          setBleManager(manager);
        }

        const devices = await bleManager.devices(['180C'], { timeout: 5000 });

        if (devices.length > 0) {
          const connectedDevice = devices[0];
          await connectedDevice.connect();
          setDevice(connectedDevice);
          setConnected(true);

          const services = await connectedDevice.discoverAllServicesAndCharacteristics();
          const charUUID = '2A51'; // Replace with the actual characteristic UUID you want to read
          const characteristic = services.characteristics[charUUID];
          setCharacteristic(characteristic);
        }
      } else {
        console.error('Location permissions not granted');
      }
    } catch (error) {
      console.error('Error connecting to BLE device:', error.message);
    }
  };

  useEffect(() => {
    // Request location permissions on Android
    if (Platform.OS === 'android') {
      (async () => {
        await initializeBluetooth();
      })();
    } else {
      // For non-Android platforms, proceed with Bluetooth initialization
      (async () => {
        await initializeBluetooth();
      })();
    }

    // Cleanup on component unmount
    return () => {
      if (device) {
        device.cancelConnection();
        setConnected(false);
      }

      if (bleManager) {
        bleManager.destroy();
      }
    };
  }, [bleManager]);

  const handleConnectPress = async () => {
    // Manually disconnect if already connected
    if (device && connected) {
      device.cancelConnection();
      setConnected(false);
    } else {
      // Otherwise, initiate connection
      await initializeBluetooth();
    }
  };

  const handleReadDataPress = async () => {
    // Read data manually
    if (device && characteristic) {
      const result = await characteristic.read();
      setData(result.value.toString());
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{connected ? 'Connected to Arduino Nano 33 BLE' : 'Not connected'}</Text>
      <Text>Data from Arduino Nano 33 BLE:</Text>
      {data ? <Text>{data}</Text> : <Text>No data received</Text>}
      <Button title={connected ? 'Disconnect' : 'Connect'} onPress={handleConnectPress} />
      <Button title="Read Data" onPress={handleReadDataPress} />
    </View>
  );
};

export default ArduinoTest;

