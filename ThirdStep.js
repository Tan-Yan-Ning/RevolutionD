import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import StartButton from '../assets/StartButton.png';
import BackwardButton from '../assets/BackwardButton.png';
const ThirdStep = ({ navigation }) => {
    const handleBackButtonPress = () => {
        navigation.navigate('SecondStep');
      };
    const handleStartButtonPress = () => {
        navigation.navigate('Monitor');
      };
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleStartButtonPress}>
        <Image style={styles.startImage} source={StartButton} />
        </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>Step 3:</Text>
        <Text style={styles.monitorText}>Monitor</Text>
        <Text style={styles.infoText}>See real-time blood glucose levels </Text>
      </View>
        <View style={styles.circleContainer}>
        <TouchableOpacity onPress={handleBackButtonPress}>
        <Image
          style={styles.BackwardButton}
          source={BackwardButton}
        />
        </TouchableOpacity>
        <View style={styles.blueCircle} />
        <View style={styles.blueCircle} />
        <View style={styles.redCircle} />
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
  startImage: {
    position: 'absolute',
    width: 278,
    height: 98,
    left: -140,
    top: 150,
  },
  textContainer: {
    marginTop: 380, 
    width: 250,
    alignItems: 'center',
  },
  stepText: {
    color: '#60B7FF',
    fontSize: 32,
    fontWeight: '600',
    textAlign: "center", 
  },
  monitorText: {
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
    marginRight: 100,
  },
  BackwardButton: {
    width: 45,
    height: 46,
    marginRight: 20,
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
 
  
});
export  default  ThirdStep;




