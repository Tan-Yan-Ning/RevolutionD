
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import FirstStep from './screens/FirstStep';
import SecondStep from './screens/SecondStep';
import ThirdStep from './screens/ThirdStep';
import Monitor from './screens/Monitor';
import History from './screens/History';
import PostmanTest from './test';
import ArdunioTest from './ardunio';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
      <Stack.Screen name="ardunio" component={ArdunioTest} />
      <Stack.Screen name="test" component={PostmanTest} />
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




