import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import logo from '../assets/Logo.png';
import RedMonitor from '../assets/RedMonitor.png';
import History from '../assets/History.png';
import LineGraph from '../components/LineGraph';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../config/firebaseConfig';

const database = getDatabase(app);
const bloodglucoInDB = ref(database, "BloodGlucose");

const Monitor = ({ navigation }) => {
  const [bloodGlucose, setBloodGlucose] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(bloodglucoInDB, (snapshot) => {
      const bloodglucoArray = Object.values(snapshot.val());
      // Assuming you want to display the latest value
      const latestValue = bloodglucoArray[bloodglucoArray.length - 1];
      setBloodGlucose(latestValue);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  const textColor = bloodGlucose !== null && (bloodGlucose < 100 || bloodGlucose > 250) ? '#FD4755' : '#1BD45A';

  return (
    <View style={styles.container}>
      <View style={styles.greyRectangle}>
        <Image style={styles.logo} source={logo} />
      </View>
      <Text style={styles.textStyle}>Blood Glucose</Text>
      <View style={styles.blueCircle}>
        <Text style={[styles.valueStyle, { color: textColor }]}>
          {bloodGlucose !== null ? bloodGlucose : 'Loading...'} 
          </Text>
          <Text style={styles.unitStyle}>mg/dL</Text>
      </View>
      <View style={styles.smallgreyRectangle}>
        <Text style={styles.textStyle}>Real-Time Line Chart</Text>
      </View>
      <LineGraph/>
      <View style={styles.greyRectangle2}>
        <View style={styles.pageContainer}>
          <Image style={styles.RedMonitor} source={RedMonitor} />
          <TouchableOpacity onPress={handleHistoryPress}>
            <Image style={styles.History} source={History} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "white",
  },
  greyRectangle: {
    width: "100%",
    height: 96,
    paddingLeft: 13,
    paddingRight: 346,
    paddingTop: 13,
    paddingBottom: 12,
    boxSizing: "border-box",
    backgroundColor: "#D9D9D9",
    position: 'absolute',
    top: 0,
  },
  logo: {
    width: 71,
    height: "100%",
  },
  blueCircle: {
    justifyContent: 'center',
    alignItems: 'center', 
    width: 235,
    height: 212,
    borderRadius: 117.5,
    backgroundColor: "#EAF6FF",
  },
  textStyle: {
    color: "#FD4755",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center", 
  },
  valueStyle: {
    color: "#FD4755",
    fontSize: 96,
    fontWeight: "700",
    textAlign: "center", 
  },
  unitStyle: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center", 
  },
  smallgreyRectangle: {
    width: "100%",
    height: 35,
    boxSizing: "border-box",
    backgroundColor: "#D9D9D9",
    top: 0,
  },
  greyRectangle2: {
    width: "100%",
    height: 96,
    paddingLeft: 100,
    paddingRight: 98,
    paddingTop: 6,
    paddingBottom: 2,
    boxSizing: "border-box",
    backgroundColor: "#D9D9D9",
    position: 'absolute',
    bottom: 0,
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  RedMonitor: {
    width: 61,
    height: "100%",
    marginRight: 40,
  },
  History: {
    width: 61,
    height: "100%",
    marginLeft: 40,
  },
 
  
});
export  default  Monitor;




