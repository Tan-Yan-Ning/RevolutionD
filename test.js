/*import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import axios from 'axios';

const Test = () => {
  const [inputData, setInputData] = useState({
    CRIM: '',
    ZN: '',
    INDUS: '',
    CHAS: '',
    NOX: '',
    RM: '',
    AGE: '',
    DIS: '',
    RAD: '',
    TAX: '',
    PTRATIO: '',
    B: '',
    LSTAT: '',
  });

  const [fetchedData, setFetchedData] = useState(null);

  const fetchDataFromPostman = async () => {
    try {
      const response = await axios.get('https://jawfish-touched-supposedly.ngrok-free.app/receive');
      // Replace 'fetchData' with the actual endpoint on your server that handles GET requests

      setFetchedData(response.data);
    } catch (error) {
      console.error('Error fetching data from Postman:', error.message);
    }
  };

  const sendDataToServer = async () => {
    try {
      // Replace 'sendData' with the actual endpoint on your server that handles POST requests
      const response = await axios.post('https://jawfish-touched-supposedly.ngrok-free.app/send', inputData);
      console.log('Data sent to server:', response.data);
    } catch (error) {
      console.error('Error sending data to server:', error.message);
    }
  };

  const fillWithRandomNumbers = () => {
    const getRandomFloat = () => (Math.random() * 10).toFixed(2).toString();
    setInputData({
      CRIM: getRandomFloat(),
      ZN: getRandomFloat(),
      INDUS: getRandomFloat(),
      CHAS: getRandomFloat(),
      NOX: getRandomFloat(),
      RM: getRandomFloat(),
      AGE: getRandomFloat(),
      DIS: getRandomFloat(),
      RAD: getRandomFloat(),
      TAX: getRandomFloat(),
      PTRATIO: getRandomFloat(),
      B: getRandomFloat(),
      LSTAT: getRandomFloat(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter CRIM"
          value={inputData.CRIM}
          onChangeText={(text) => setInputData({ ...inputData, CRIM: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter ZN"
          value={inputData.ZN}
          onChangeText={(text) => setInputData({ ...inputData, ZN: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter INDUS"
          value={inputData.INDUS}
          onChangeText={(text) => setInputData({ ...inputData, INDUS: text })}
        />
        <TextInput
        style={styles.input}
        placeholder="Enter CHAS"
        value={inputData.CHAS}
        onChangeText={(text) => setInputData({ ...inputData, CHAS: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter NOX"
        value={inputData.NOX}
        onChangeText={(text) => setInputData({ ...inputData, NOX: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter RM"
        value={inputData.RM}
        onChangeText={(text) => setInputData({ ...inputData, RM: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter AGE"
        value={inputData.AGE}
        onChangeText={(text) => setInputData({ ...inputData, AGE: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter DIS"
        value={inputData.DIS}
        onChangeText={(text) => setInputData({ ...inputData, DIS: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter RAD"
        value={inputData.RAD}
        onChangeText={(text) => setInputData({ ...inputData, RAD: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter TAX"
        value={inputData.TAX}
        onChangeText={(text) => setInputData({ ...inputData, TAX: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter PTRATIO"
        value={inputData.PTRATIO}
        onChangeText={(text) => setInputData({ ...inputData, PTRATIO: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter B"
        value={inputData.B}
        onChangeText={(text) => setInputData({ ...inputData, B: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter LSTAT"
        value={inputData.LSTAT}
        onChangeText={(text) => setInputData({ ...inputData,  LSTAT: text })}
      />
        
      </View>
      <View style={styles.PbuttonContainer}>
      <Button title="Send Data to Server" onPress={sendDataToServer} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Fill with Random Numbers" onPress={fillWithRandomNumbers} />
        <Button title="Fetch Data from Postman" onPress={fetchDataFromPostman} />
      </View>
      {fetchedData && (
        <View style={styles.dataContainer}>
          <Text>Data received from Postman:</Text>
          <Text>{JSON.stringify(fetchedData, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '48%', // Adjust as needed
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  PbuttonContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Test;







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

export default Test;*/


import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import axios from 'axios';

const PostmanTest = () => {
  const [inputData, setInputData] = useState({
    CRIM: '',
    ZN: '',
    INDUS: '',
    CHAS: '',
    NOX: '',
    RM: '',
    AGE: '',
    DIS: '',
    RAD: '',
    TAX: '',
    PTRATIO: '',
    B: '',
    LSTAT: '',
  });

  const [fetchedData, setFetchedData] = useState(null);

  const fetchDataFromPostman = async () => {
    try {
      // Build the URL based on user input
      const apiUrl = `https://jawfish-touched-supposedly.ngrok-free.app/predict?${createQueryParams()}`;

      const response = await axios.get(apiUrl);

      setFetchedData(response.data);
    } catch (error) {
      console.error('Error fetching data from Postman:', error.message);
    }
  };

  const sendDataToServer = async () => {
    try {
      // Check if all values in inputData are valid numbers
      if (Object.values(inputData).some(value => isNaN(parseFloat(value)))) {
        console.error('One or more input values are not valid numbers');
        return;
      }
  
      // Replace 'sendData' with the actual endpoint on your server that handles POST requests
      const response = await axios.post('https://jawfish-touched-supposedly.ngrok-free.app/send', inputData);
      console.log('Data sent to server:', response.data);
    } catch (error) {
      console.error('Error sending data to server:', error.message);
    }
  };

  const createQueryParams = () => {
    // Convert inputData object to URL query parameters
    const queryParams = Object.entries(inputData)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return queryParams;
  };

  const fillWithRandomNumbers = () => {
    const getRandomFloat = () => (Math.random() * 10).toFixed(2).toString();
    setInputData({
      CRIM: getRandomFloat(),
      ZN: getRandomFloat(),
      INDUS: getRandomFloat(),
      CHAS: getRandomFloat(),
      NOX: getRandomFloat(),
      RM: getRandomFloat(),
      AGE: getRandomFloat(),
      DIS: getRandomFloat(),
      RAD: getRandomFloat(),
      TAX: getRandomFloat(),
      PTRATIO: getRandomFloat(),
      B: getRandomFloat(),
      LSTAT: getRandomFloat(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter CRIM"
          value={inputData.CRIM}
          onChangeText={(text) => setInputData({ ...inputData, CRIM: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter ZN"
          value={inputData.ZN}
          onChangeText={(text) => setInputData({ ...inputData, ZN: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter INDUS"
          value={inputData.INDUS}
          onChangeText={(text) => setInputData({ ...inputData, INDUS: text })}
        />
        <TextInput
        style={styles.input}
        placeholder="Enter CHAS"
        value={inputData.CHAS}
        onChangeText={(text) => setInputData({ ...inputData, CHAS: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter NOX"
        value={inputData.NOX}
        onChangeText={(text) => setInputData({ ...inputData, NOX: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter RM"
        value={inputData.RM}
        onChangeText={(text) => setInputData({ ...inputData, RM: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter AGE"
        value={inputData.AGE}
        onChangeText={(text) => setInputData({ ...inputData, AGE: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter DIS"
        value={inputData.DIS}
        onChangeText={(text) => setInputData({ ...inputData, DIS: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter RAD"
        value={inputData.RAD}
        onChangeText={(text) => setInputData({ ...inputData, RAD: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter TAX"
        value={inputData.TAX}
        onChangeText={(text) => setInputData({ ...inputData, TAX: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter PTRATIO"
        value={inputData.PTRATIO}
        onChangeText={(text) => setInputData({ ...inputData, PTRATIO: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter B"
        value={inputData.B}
        onChangeText={(text) => setInputData({ ...inputData, B: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter LSTAT"
        value={inputData.LSTAT}
        onChangeText={(text) => setInputData({ ...inputData,  LSTAT: text })}
      />
        
      </View>
      <View style={styles.PbuttonContainer}>
        <Button title="Send Data to Server" onPress={sendDataToServer} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Fill with Random Numbers" onPress={fillWithRandomNumbers} />
        <Button title="Fetch Data from Postman" onPress={fetchDataFromPostman} />
      </View>
      {fetchedData && (
        <View style={styles.dataContainer}>
          <Text>Data received from Postman:</Text>
          <Text>{JSON.stringify(fetchedData, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '48%', // Adjust as needed
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  PbuttonContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default PostmanTest;
