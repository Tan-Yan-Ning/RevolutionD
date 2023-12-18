import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import logo from '../assets/Logo.png';
import Monitor from '../assets/Monitor.png';
import RedHistory from '../assets/RedHistory.png';
const History = ({ navigation }) => {
    const handleMonitorPress = () => {
        navigation.navigate('Monitor');
      };
  return (
    <View style={styles.container}>
        <View style={styles.greyRectangle}>
        <Image style={styles.logo} source={logo}/>
        </View>
        <Text style={styles.textStyle}>History</Text>
        <View style={styles.greyRectangle2}>
        <View style={styles.pageContainer}>
        <TouchableOpacity onPress={handleMonitorPress}>
        <Image style={styles.Monitor} source={Monitor}/>
        </TouchableOpacity>
        <Image style={styles.RedHistory} source={RedHistory}/>
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
  Monitor: {
    width: 61,
    height: "100%",
    marginRight: 40,
  },
  RedHistory: {
    width: 61,
    height: "100%",
    marginLeft: 40,
  },
 
  
});
export  default  History;




