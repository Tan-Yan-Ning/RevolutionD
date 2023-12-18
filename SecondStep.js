import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Move from '../assets/Move.png';
import ForwardButton from '../assets/ForwardButton.png';
import BackwardButton from '../assets/BackwardButton.png';
const SecondStep = ({ navigation }) => {
    const handleNextButtonPress = () => {
        navigation.navigate('ThirdStep');
      };
    const handleBackButtonPress = () => {
        navigation.navigate('FirstStep');
      };
  return (
    <View style={styles.container}>
      <Image style={styles.moveImage} source={Move} />
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>Step 2:</Text>
        <Text style={styles.moveText}>Start Moving</Text>
        <Text style={styles.infoText}>Stride into action – walk, jog, run, just keep moving!</Text>
      </View>
        <View style={styles.circleContainer}>
        <TouchableOpacity onPress={handleBackButtonPress}>
        <Image
          style={styles.BackwardButton}
          source={BackwardButton}
        />
        </TouchableOpacity>
        <View style={styles.blueCircle} />
        <View style={styles.redCircle} />
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
  moveImage: {
    position: 'absolute',
    width: 312,
    height: 285,
    left: 50,
    top: 90,
  },
  textContainer: {
    marginTop: 380, 
    width: 200,
    alignItems: 'center',
  },
  stepText: {
    color: '#60B7FF',
    fontSize: 32,
    fontWeight: '600',
    textAlign: "center", 
  },
  
  moveText: {
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
  ForwardButton: {
    width: 45,
    height: 46,
    marginLeft: 60,
  },
  
});
export  default  SecondStep;




