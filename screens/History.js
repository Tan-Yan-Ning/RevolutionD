import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper'; 
import logo from '../assets/Logo.png';
import Monitor from '../assets/Monitor.png';
import RedHistory from '../assets/RedHistory.png';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../config/firebaseConfig';

const database = getDatabase(app);
const bloodglucoInDB = ref(database, "BloodGlucose");

const History = ({ navigation }) => {
  const [averageBloodGlucose, setAverageBloodGlucose] = useState(null);
  const [dataCount, setDataCount] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(bloodglucoInDB, (snapshot) => {
      const bloodglucoArray = Object.values(snapshot.val());
      // Calculate average blood glucose
      const averageValue = bloodglucoArray.reduce((sum, value) => sum + value, 0) / bloodglucoArray.length;
      setAverageBloodGlucose(averageValue);

      // Set data count
      setDataCount(bloodglucoArray.length);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleMonitorPress = () => {
    navigation.navigate('Monitor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.greyRectangle}>
        <Image style={styles.logo} source={logo} />
      </View>
      <View style={styles.tableContainer}>
      <Text style={styles.textStyle}>History</Text>
      {dataCount !== null && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Date (dd/mm/yyy)</DataTable.Title>
            <DataTable.Title>Duration (mins)</DataTable.Title>
            <DataTable.Title>Avg (mg/dL)</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>{new Date().toLocaleDateString('en-SG')}</DataTable.Cell>
            <DataTable.Cell>{dataCount-1}</DataTable.Cell>
            <DataTable.Cell>{averageBloodGlucose !== null ? averageBloodGlucose.toFixed(0) : '-'}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      )}
      </View>
      <View style={styles.greyRectangle2}>
        <View style={styles.pageContainer}>
          <TouchableOpacity onPress={handleMonitorPress}>
            <Image style={styles.Monitor} source={Monitor} />
          </TouchableOpacity>
          <Image style={styles.RedHistory} source={RedHistory} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  greyRectangle: {
    width: '100%',
    height: 96,
    paddingLeft: 13,
    paddingRight: 346,
    paddingTop: 13,
    paddingBottom: 12,
    boxSizing: 'border-box',
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    top: 0,
  },
  logo: {
    width: 71,
    height: '100%',
  },
  tableContainer: {
    flex: 1,
    marginTop: 90, 
    width: '100%', 
  },
  textStyle: {
    color: '#FD4755',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  greyRectangle2: {
    width: '100%',
    height: 96,
    paddingLeft: 100,
    paddingRight: 98,
    paddingTop: 6,
    paddingBottom: 2,
    boxSizing: 'border-box',
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    bottom: 0,
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Monitor: {
    width: 61,
    height: '100%',
    marginRight: 40,
  },
  RedHistory: {
    width: 61,
    height: '100%',
    marginLeft: 40,
  },
});

export default History;






