import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Watch from '../assets/Watch.png';
import Phone from '../assets/Phone.png';
import ForwardButton from '../assets/ForwardButton.png';
const FirstStep = ({ navigation }) => {
  const handleNextButtonPress = () => {
    navigation.navigate('SecondStep');
  };
  return (
    <View style={styles.container}>
      <Image style={styles.watchImage} source={Watch} />
      <Image style={styles.phoneImage} source={Phone} />
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>Step 1:</Text>
        <Text style={styles.connectText}>Connect to device</Text>
        <Text style={styles.infoText}>Hold the phone near the watch to scan the sensor</Text>
      </View>
        <View style={styles.circleContainer}>
        <View style={styles.redCircle} />
        <View style={styles.blueCircle} />
        <View style={styles.blueCircle} />
        <TouchableOpacity onPress={handleNextButtonPress}>
        <Image
          style={styles.ForwardButton}
          source={ForwardButton}
        />
        </TouchableOpacity>
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
  watchImage: {
    position: 'absolute',
    width: 205.34,
    height: 127.84,
    left: -9,
    top: 100,
  },
  phoneImage: {
    position: 'absolute',
    width: 184,
    height: 210,
    left: 195,
    top: 150,
  },
  textContainer: {
    marginTop: 380, 
    width: 300,
    alignItems: 'center',
  },
  stepText: {
    color: '#60B7FF',
    fontSize: 32,
    fontWeight: '600',
    textAlign: "center", 
  },
  
  connectText: {
    color: '#FD4755',
    fontSize: 32,
    fontWeight: '600',
    marginTop: 5,
    textAlign: "center", 
  },
  infoText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
  },
  circleContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 28, 
    marginLeft: 60,
  },
  blueCircle: {
    width: 10,
    height: 8,
    backgroundColor: '#60B7FF',
    borderRadius: 9999,
    marginLeft: 40,
  },
  redCircle: {
    width: 14,
    height: 13,
    backgroundColor: '#FD4755',
    borderRadius: 9999,
    marginLeft: 40,
  },
  ForwardButton: {
    width: 45,
    height: 46,
    marginLeft: 60,
  },
  
});
export  default  FirstStep;




