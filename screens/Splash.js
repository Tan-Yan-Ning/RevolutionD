import React from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import logo from '../assets/Logo.png';

const Splash = ({ navigation }) => {
  const handleLogoPress = () => {
    navigation.navigate('FirstStep');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogoPress}>
        <Image style={styles.logo} source={logo}/>
      </TouchableOpacity>
      <Text style={styles.activeGluco}>ActiveGluco</Text>
      <View style={styles.textContainer}>
      <Text style={styles.infoText}> Energizing Every Stride, Inspiring Diabetics to Thrive!</Text>
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
  logo: {
    width: 257,
    height: 257,
    marginBottom: 20,
  },
  activeGluco: {
    color: "#fd4755", 
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center", 
  },
  textContainer: {
    width: 350,
    alignItems: 'center',
  },
  infoText: {
    color: "black", 
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center", 
  },
});

export default Splash;
