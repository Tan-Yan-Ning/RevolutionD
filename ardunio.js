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

export default ArdunioTest;



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

import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, TouchableOpacity, NativeModules, NativeEventEmitter } from 'react-native';
import { BleManager, BleManagerModule, BleManagerEmitter } from 'react-native-ble-plx';

const ArduinoTest = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [data, setData] = useState('');
  const [connected, setConnected] = useState(false);
  const [bleManager, setBleManager] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // start bluetooth manager
    const manager = new BleManager();
    setBleManager(manager);

    // Cleanup on component unmount
    return () => {
      if (device) {
        device.cancelConnection();
        setConnected(false);
      }

      if (manager) {
        manager.destroy();
      }
    };
  }, []);

  useEffect(() => {
    let stopListener;
    let discoverListener;

    if (bleManager) {
      stopListener = BleManagerEmitter.addListener(
        'BleManagerStopScan',
        () => {
          setIsScanning(false);
          console.log('Scan is stopped');
        },
      );

      discoverListener = BleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral
      );
    }

    return () => {
      if (stopListener) {
        stopListener.remove();
      }
      if (discoverListener) {
        discoverListener.remove();
      }
    };
  }, [bleManager]);

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

  const startScan = () => {
    if (!isScanning) {
      bleManager.startDeviceScan(null, null, (error, peripheral) => {
        if (error) {
          console.error('Error scanning for devices:', error);
          return;
        }
        handleDiscoverPeripheral(peripheral);
      });

      console.log('Scanning...');
      setIsScanning(true);
    }
  };

  const handleDiscoverPeripheral = peripheral => {
    console.log('Discovered peripheral:', peripheral);
    // You can update the state or perform other actions when a peripheral is discovered
  };

  const stopScan = () => {
    if (isScanning) {
      bleManager.stopDeviceScan();
      setIsScanning(false);
      console.log('Scan is stopped');
    }
  };

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
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ marginTop: 20, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}
        onPress={isScanning ? stopScan : startScan}
      >
        <Text style={{ color: 'white' }}>
          {isScanning ? 'Stop Scan' : 'Scan Bluetooth Devices'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArduinoTest;

import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles';
import { DeviceList } from './DeviceList';
import { BleManager, BleManagerEmitter } from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Permissions } from 'expo';

const ArduinoTest = () => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const handleLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    }
  };

  
  const handleBluetoothPermissions = async () => {
    try {
      const isEnabled = await BleManager.enableBluetooth();
  
      if (isEnabled) {
        console.log('Bluetooth permissions granted');
      } else {
        console.error('Bluetooth permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting Bluetooth permissions:', error);
    }
  };
  

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  useEffect(() => {
    handleLocationPermission();
    handleBluetoothPermissions();

    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);

  const scan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const connect = peripheral => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        setConnectedDevices(Array.from(devices));
        setDiscoveredDevices(Array.from(devices));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        throw Error('failed to bond');
      });
  };

  const disconnect = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        setConnectedDevices(Array.from(devices));
        setDiscoveredDevices(Array.from(devices));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        throw Error('fail to remove the bond');
      });
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={[
            styles.title,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}>
          React Native BLE Manager Tutorial
        </Text>
        <TouchableOpacity
          onPress={scan}
          activeOpacity={0.5}
          style={styles.scanButton}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}>
          Discovered Devices:
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
        )}

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}>
          Connected Devices:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ArduinoTest;



import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import {styles} from './styles';
import {DeviceList} from './DeviceList';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ArduinoTest = () => {

  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(locationPermissionResult => {
        if (locationPermissionResult) {
          console.log('Location Permission is OK');
    
          // Check and request BLUETOOTH_CONNECT permission
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ).then(connectPermissionResult => {
            if (!connectPermissionResult) {
              // Request BLUETOOTH_CONNECT permission
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              ).then(connectRequestResult => {
                if (connectRequestResult) {
                  console.log('User accepted Bluetooth Connect Permission');
                } else {
                  console.log('User refused Bluetooth Connect Permission');
                }
              });
            } else {
              console.log('Bluetooth Connect Permission is already granted');
            }
          });
    
          // Check and request BLUETOOTH_SCAN permission
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ).then(scanPermissionResult => {
            if (!scanPermissionResult) {
              // Request BLUETOOTH_SCAN permission
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              ).then(scanRequestResult => {
                if (scanRequestResult) {
                  console.log('User accepted Bluetooth Scan Permission');
                } else {
                  console.log('User refused Bluetooth Scan Permission');
                }
              });
            } else {
              console.log('Bluetooth Scan Permission is already granted');
            }
          });
        } else {
          console.log('User refused Location Permission');
        }
      });
    }
    
    
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  // pair with device first before connecting to it
  const connectToPeripheral = peripheral => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };
  // disconnect from device
  const disconnectFromPeripheral = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={[
            styles.title,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          React Native BLE Manager Tutorial
        </Text>
        <TouchableOpacity
          onPress={startScan}
          activeOpacity={0.5}
          style={styles.scanButton}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          Discovered Devices:
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
        )}

        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          Connected Devices:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ArduinoTest;


import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import { styles } from './styles';
import { DeviceList } from './DeviceList';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ArduinoTest = () => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then((results) => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  useEffect(() => {


    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral) => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        setDeviceInfo(peripheral); // Set deviceInfo for displaying discovered device information
      }
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      (peripheral) => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      }
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      }
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((locationPermissionResult) => {
        if (locationPermissionResult) {
          console.log('Location Permission is OK');

          // Check and request BLUETOOTH_CONNECT permission
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          ).then((connectPermissionResult) => {
            if (!connectPermissionResult) {
              // Request BLUETOOTH_CONNECT permission
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
              ).then((connectRequestResult) => {
                if (connectRequestResult) {
                  console.log('User accepted Bluetooth Connect Permission');
                } else {
                  console.log('User refused Bluetooth Connect Permission');
                }
              });
            } else {
              console.log('Bluetooth Connect Permission is already granted');
            }
          });

          // Check and request BLUETOOTH_SCAN permission
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
          ).then((scanPermissionResult) => {
            if (!scanPermissionResult) {
              // Request BLUETOOTH_SCAN permission
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
              ).then((scanRequestResult) => {
                if (scanRequestResult) {
                  console.log('User accepted Bluetooth Scan Permission');
                } else {
                  console.log('User refused Bluetooth Scan Permission');
                }
              });
            } else {
              console.log('Bluetooth Scan Permission is already granted');
            }
          });
        } else {
          console.log('User refused Location Permission');
        }
      });
    }

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  

  // pair with device first before connecting to it
  const connectToPeripheral = (peripheral) => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };

  // disconnect from device
  const disconnectFromPeripheral = (peripheral) => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        setDeviceInfo(null); // Clear deviceInfo when disconnecting
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={[
            styles.title,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          React Native BLE Manager Tutorial
        </Text>
        <TouchableOpacity
          onPress={startScan}
          activeOpacity={0.5}
          style={styles.scanButton}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>

        {deviceInfo && (
          <View>
            <Text
              style={[
                styles.subtitle,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              Discovered Device Information:
            </Text>
            <Text
              style={[
                styles.deviceInfo,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              ID: {deviceInfo.id}{'\n'}
              Name: {deviceInfo.name}{'\n'}
              RSSI: {deviceInfo.rssi}{'\n'}
              
              </Text>
              </View>
            )}
    
            <Text
              style={[
                styles.subtitle,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              Discovered Devices:
            </Text>
            {discoveredDevices.length > 0 ? (
              <FlatList
                data={discoveredDevices}
                renderItem={({ item }) => (
                  <DeviceList
                    peripheral={item}
                    connect={connect}
                    disconnect={disconnect}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
            )}
    
            <Text
              style={[
                styles.subtitle,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              Connected Devices:
            </Text>
            {connectedDevices.length > 0 ? (
              <FlatList
                data={connectedDevices}
                renderItem={({ item }) => (
                  <DeviceList
                    peripheral={item}
                    connect={connectToPeripheral}
                    disconnect={disconnectFromPeripheral}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <Text style={styles.noDevicesText}>No connected devices</Text>
            )}
          </View>
        </SafeAreaView>
      );
    };
    
    export default ArduinoTest;*/

import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import { styles } from './styles';
import { DeviceList } from './DeviceList';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ArduinoTest = () => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then((results) => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  useEffect(() => {

    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral) => {
        console.log('Discovered Peripheral:', peripheral);
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        setDeviceInfo(peripheral);
      }
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      (peripheral) => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      }
    );

    

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((locationPermissionResult) => {
        if (locationPermissionResult) {
          console.log('Location Permission is OK');

          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          ).then((connectPermissionResult) => {
            if (!connectPermissionResult) {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
              ).then((connectRequestResult) => {
                if (connectRequestResult) {
                  console.log('User accepted Bluetooth Connect Permission');
                } else {
                  console.log('User refused Bluetooth Connect Permission');
                }
              });
            } else {
              console.log('Bluetooth Connect Permission is already granted');
            }
          });

          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
          ).then((scanPermissionResult) => {
            if (!scanPermissionResult) {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
              ).then((scanRequestResult) => {
                if (scanRequestResult) {
                  console.log('User accepted Bluetooth Scan Permission');
                } else {
                  console.log('User refused Bluetooth Scan Permission');
                }
              });
            } else {
              console.log('Bluetooth Scan Permission is already granted');
            }
          });
        } else {
          console.log('User refused Location Permission');
        }
      });
    }

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 15, true)
        .then(() => {
          console.log('Scanning started...');
          setIsScanning(true);
        })
        .catch((error) => {
          console.error('Error starting scan:', error);
        });
    }
  };
  let stopScanListener = BleManagerEmitter.addListener(
    'BleManagerStopScan',
    (error) => {
      if (error) {
        console.error('Error stopping scan:', error);
      }
      setIsScanning(false);
      console.log('Scan stopped');
    }
  );
  
  
  

  const connectToPeripheral = (peripheral) => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('Failed to bond');
      });
  };

  const disconnectFromPeripheral = (peripheral) => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        setDeviceInfo(null);
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('Failed to remove the bond');
      });
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={[
            styles.title,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          React Native BLE Manager Tutorial
        </Text>
        <TouchableOpacity
          onPress={startScan}
          activeOpacity={0.5}
          style={styles.scanButton}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>

        {deviceInfo && (
          <View>
            <Text
              style={[
                styles.subtitle,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              Discovered Device Information:
            </Text>
            <Text
              style={[
                styles.deviceInfo,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              ID: {deviceInfo.id}{'\n'}
              Name: {deviceInfo.name}{'\n'}
              RSSI: {deviceInfo.rssi}{'\n'}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          Discovered Devices:
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
        )}

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          Connected Devices:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ArduinoTest;

     