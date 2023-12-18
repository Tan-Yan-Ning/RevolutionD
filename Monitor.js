import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import logo from '../assets/Logo.png';
import RedMonitor from '../assets/RedMonitor.png';
import History from '../assets/History.png';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

/*const appSettings = {
  databaseURL: "https://revolutiond-8c77d-default-rtdb.asia-southeast1.firebasedatabase.app/"
}*/
const firebaseConfig = {
  apiKey: "AIzaSyCyeTIFJHdD6XP5Ti1ZVyQpiV5nqGWk9bE",
  authDomain: "revolutiond-8c77d.firebaseapp.com",
  databaseURL: "https://revolutiond-8c77d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "revolutiond-8c77d",
  storageBucket: "revolutiond-8c77d.appspot.com",
  messagingSenderId: "459055321437",
  appId: "1:459055321437:web:96acfee625c892280798b4"
};

const app = initializeApp(firebaseConfig);
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

  return (
    <View style={styles.container}>
      <View style={styles.greyRectangle}>
        <Image style={styles.logo} source={logo} />
      </View>
      <Text style={styles.textStyle}>Blood Glucose: {bloodGlucose !== null ? bloodGlucose : 'Loading...'}</Text>
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
    justifyContent: "center",
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
  textStyle: {
    color: "#FD4755",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center", 
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




