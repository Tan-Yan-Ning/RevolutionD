import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../config/firebaseConfig';

const database = getDatabase(app);
const bloodglucoInDB = ref(database, "BloodGlucose");

const LineGraph = () => {
  const [bloodglucoData, setBloodglucoData] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(bloodglucoInDB, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to an array of values
        const dataArray = Object.values(data);
        console.log('Received data from Firebase:', dataArray);
        setBloodglucoData(dataArray);
      }
    });

    return () => {
      // Unsubscribe when the component is unmounted
      unsubscribe();
    };
  }, []);

  console.log('Rendering LineGraph with data:', bloodglucoData);

  return (
    <View>
      {bloodglucoData.length > 0 ? (
        <LineChart
          data={{
            labels: Array.from({ length: bloodglucoData.length }, (_, i) => (i)),
            datasets: [{ data: bloodglucoData }],
          }}
          width={Dimensions.get('window').width}
          height={240}
          chartConfig={{
            backgroundGradientFrom: '#EAF6FF',
            backgroundGradientTo: '#EAF6FF',
            color: (opacity = 1) => `rgba(253, 71, 85, ${opacity})`,
            decimalPlaces: 0,
          }}
          bezier
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

export default LineGraph;