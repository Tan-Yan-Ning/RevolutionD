/*import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const Test = () => {
  const [fetchedData, setFetchedData] = useState(null);

  const fetchDataFromPostman = async () => {
    try {
      const response = await axios.get('http://172.24.47.194:5000/send');
      // Replace 'fetchData' with the actual endpoint on your server that handles GET requests

      setFetchedData(response.data);
    } catch (error) {
      console.error('Error fetching data from Postman:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Data from Postman" onPress={fetchDataFromPostman} />
      {fetchedData && (
        <View style={styles.dataContainer}>
          <Text>Data received from Postman:</Text>
          <Text>{JSON.stringify(fetchedData, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Test;*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const Test = () => {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetchDataFromPostman();
  }, []); // Fetch data on component mount

  const fetchDataFromPostman = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/data');
      setFetchedData(response.data.value);
    } catch (error) {
      console.error('Error fetching data from Postman:', error.message);
    }
  };

  // Extract the most recent value from the fetchedData array
  const mostRecentValue =
    fetchedData.length > 0 ? parseFloat(fetchedData[fetchedData.length - 1].BGL) : null;

  // Define color based on the range
  const textColor =
    mostRecentValue !== null && (mostRecentValue < 100 || mostRecentValue > 250)
      ? '#FD4755'
      : '#1BD45A';

  return (
    <View style={styles.container}>
      {mostRecentValue !== null && (
        <Text style={[styles.mostRecentValue, { color: textColor }]}>
          Most Recent Value: {mostRecentValue}
        </Text>
      )}
      <Button title="Fetch Data from Postman" onPress={fetchDataFromPostman} />
      {fetchedData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text>Blood Glucose Level:</Text>
          <LineChart
            data={{
              labels: fetchedData.map((_, index) => index.toString()),
              datasets: [
                {
                  data: fetchedData.map((item) => parseFloat(item.BGL)),
                },
              ],
            }}
            width={300}
            height={200}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#eaf6ff', 
              backgroundGradientFrom: '#e2edf8', 
              backgroundGradientTo: '#e2edf8', 
              decimalPlaces: 0, // Adjust decimal places as needed
              color: (opacity = 1) => `rgba(253, 71, 85, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(253, 71, 85, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '1',
                stroke: '#fd4755ff',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mostRecentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  chartContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Test;