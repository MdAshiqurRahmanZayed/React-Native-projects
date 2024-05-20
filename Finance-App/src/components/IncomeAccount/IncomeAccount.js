import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Picker, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const IncomeAccount = () => {
  const [inputValue, setInputValue] = useState("");
  const [income, setIncome] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState({ id: "", name: "", value: 0 });
  const [newValue, setNewValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userId);
  const url = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/income-user(${userId}).json`;

  const fetchIncome = () => {
    setLoading(true);
    axios.get(`${url}?auth=${token}`)
      .then(response => {
        const incomeData = response.data ? Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })) : [];
        setIncome(incomeData);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Error", "Failed to fetch income data. Please try again later.");
      });
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleSubmit = () => {
    const data = {
      name: inputValue,
      value: 0
    };
    if (inputValue!=="") {
      
      setLoading(true);
      axios.post(`${url}?auth=${token}`, data)
        .then(response => {
          setLoading(false);
          setInputValue("");
          fetchIncome();
          Alert.alert("Success", "Income added successfully!");
        })
        .catch(err => {
          setLoading(false);
          Alert.alert("Error", "Failed to add income. Please try again later.");
        });
    }
  };

  const handleDelete = (id) => {
    const deleteUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/income-user(${userId})/${id}.json?auth=${token}`;
    setLoading(true);
    axios.delete(deleteUrl)
      .then(() => {
        setLoading(false);
        fetchIncome();
        Alert.alert("Success", "Income deleted successfully!");
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Error", "Failed to delete income. Please try again later.");
      });
  };

  const handleSubmitIncome = () => {
    const updatedValue = Number(selectedIncome.value) + Number(newValue);
    if (selectedIncome.name!=="") {
      
      console.log("update value"+updatedValue);
      const updateUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/income-user(${userId})/${selectedIncome.id}.json?auth=${token}`;
      setLoading(true);
      axios.patch(updateUrl, { value: updatedValue })
        .then(() => {
          setLoading(false);
          fetchIncome();
          Alert.alert("Success", "Income updated successfully!");
          setNewValue(0)
          setSelectedIncome({ id: "", name: "", value: 0 })
        })
        .catch(err => {
          setLoading(false);
          Alert.alert("Error", "Failed to update income. Please try again later.");
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.seeIncome}>
        <Text>See All Income Sources</Text>
        {loading ? <ActivityIndicator /> :
          <FlatList
            data={income}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.incomeItem}>
                <Text>{item.name} - {item.value}$</Text>
                <Button title="Delete" onPress={() => handleDelete(item.id)} />
              </View>
            )}
          />
        }
      </View>
      <View style={styles.createIncome}>
        <Text>Create Income</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Name of the Income"
            value={inputValue}
            onChangeText={text => setInputValue(text)}
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
      <View style={styles.addIncome}>
        <Text>Add Income</Text>
        <View>
          <Picker
            selectedValue={selectedIncome.name}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              const selected = income.find(item => item.name === itemValue);
              setSelectedIncome(selected ? selected : { id: "", name: "", value: 0 });
            }}
          >
            <Picker.Item label="Select an Income" value="" />
            {income.map(obj => (
              <Picker.Item key={obj.id} label={obj.name} value={obj.name} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Add value"
            value={newValue}
            onChangeText={text => setNewValue(text)}
          />
          <Button title="Submit" onPress={handleSubmitIncome} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  createIncome: {
    width: "100%",
    padding: 10,
    backgroundColor: "#eee",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  seeIncome: {
    width: "100%",
    padding: 10,
    backgroundColor: "#eee",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  addIncome: {
    width: "100%",
    padding: 10,
    backgroundColor: "#eee",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "green",
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  incomeItem: {
    padding: 10,
    borderBottomWidth: 1,
    width: "100%",
    borderColor: "#ddd",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10
  },
});

export default IncomeAccount;
