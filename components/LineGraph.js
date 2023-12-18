import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import firebase from 'firebase/app';

const LineGraph = () => {
  const [data, setData] = useState([0]);

  useEffect(() => {
    const databaseRef = firebase.database().ref('/BloodGlucose');

    const onDataUpdate = (snapshot) => {
      const newData = snapshot.val();
      setData([...data, newData]);
    };

    databaseRef.on('value', onDataUpdate);

    return () => {
      // Unsubscribe when the component is unmounted
      databaseRef.off('value', onDataUpdate);
    };
  }, [data]);

  return (
    <View>
      <Text>Real-Time Line Chart</Text>
      <LineChart
        data={{
          labels: Array.from({ length: data.length }, (_, i) => i + 1),
          datasets: [{ data }],
        }}
        width={Dimensions.get('window').width}
        height={200}
        yAxisLabel={'$'}
        chartConfig={{
          backgroundGradientFrom: 'darkblue',
          backgroundGradientTo: 'blue',
          color: (opacity = 3) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
    </View>
  );
};

export default LineGraph;
