
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import FirstStep from './screens/FirstStep';
import SecondStep from './screens/SecondStep';
import ThirdStep from './screens/ThirdStep';
import Monitor from './screens/Monitor';
import History from './screens/History';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="FirstStep" component={FirstStep}/>
        <Stack.Screen name="SecondStep" component={SecondStep}/>
        <Stack.Screen name="ThirdStep" component={ThirdStep}/>
        <Stack.Screen name="Monitor" component={Monitor}/>
        <Stack.Screen name="History" component={History}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}




import { initializeApp } from 'firebase/app';

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
