import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Picker, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const ExpenseAccount = () => {
const [inputValue, setInputValue] = useState("");
  const [Expense, setExpense] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState({ id: "", name: "", value: 0 });
  const [newValue, setNewValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userId);
  const url = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/expanse-user(${userId}).json`;

  const fetchExpense = () => {
    setLoading(true);
    axios.get(`${url}?auth=${token}`)
      .then(response => {
        const ExpenseData = response.data ? Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })) : [];
        setExpense(ExpenseData);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Error", "Failed to fetch Expense data. Please try again later.");
      });
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleSubmit = () => {
    const data = {
      name: inputValue,
      value: 0
    };
    if (inputValue !== "") {

      setLoading(true);
      axios.post(`${url}?auth=${token}`, data)
        .then(response => {
          setLoading(false);
          setInputValue("");
          fetchExpense();
          Alert.alert("Success", "Expense added successfully!");
        })
        .catch(err => {
          setLoading(false);
          Alert.alert("Error", "Failed to add Expense. Please try again later.");
        });
    }
  };

  const handleDelete = (id) => {
    const deleteUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/expanse-user(${userId})/${id}.json?auth=${token}`;
    setLoading(true);
    axios.delete(deleteUrl)
      .then(() => {
        setLoading(false);
        fetchExpense();
        Alert.alert("Success", "Expense deleted successfully!");
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Error", "Failed to delete Expense. Please try again later.");
      });
  };

  const handleSubmitExpense = () => {
    const updatedValue = Number(selectedExpense.value) + Number(newValue);
    console.log("update value"+updatedValue);
    if (selectedExpense.name !== "") {
      const updateUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/expanse-user(${userId})/${selectedExpense.id}.json?auth=${token}`;
      setLoading(true);
      axios.patch(updateUrl, { value: updatedValue })
        .then(() => {
          setLoading(false);
          fetchExpense();
          Alert.alert("Success", "Expense updated successfully!");
          setNewValue(0)
          setSelectedExpense({ id: "", name: "", value: 0 })
        })
        .catch(err => {
          setLoading(false);
          Alert.alert("Error", "Failed to update Expense. Please try again later.");
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.seeExpense}>
        <Text>See All Expense Sources</Text>
        {loading ? <ActivityIndicator /> :
          <FlatList
            data={Expense}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.ExpenseItem}>
                <Text>{item.name} - {item.value}$</Text>
                <Button title="Delete" onPress={() => handleDelete(item.id)} />
              </View>
            )}
          />
        }
      </View>
      <View style={styles.createExpense}>
        <Text>Create Expense</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Name of the Expense"
            value={inputValue}
            onChangeText={text => setInputValue(text)}
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
      <View style={styles.addExpense}>
        <Text>Add Expense</Text>
        <View>
          <Picker
            selectedValue={selectedExpense.name}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              const selected = Expense.find(item => item.name === itemValue);
              setSelectedExpense(selected ? selected : { id: "", name: "", value: 0 });
            }}
          >
            <Picker.Item label="Select an Expense" value="" />
            {Expense.map(obj => (
              <Picker.Item key={obj.id} label={obj.name} value={obj.name} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Add value"
            value={newValue}
            onChangeText={text => setNewValue(text)}
          />
          <Button title="Submit" onPress={handleSubmitExpense} />
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
     createExpense: {
          width: "100%",
          padding: 10,
          backgroundColor: "#eee",
          marginTop: 5,
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
     },
     seeExpense: {
          width: "100%",
          padding: 10,
          backgroundColor: "#eee",
          marginTop: 5,
          alignItems: "center",
          justifyContent: "center",
          elevation: 3,
     },
     addExpense: {
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
     ExpenseItem: {
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


export default ExpenseAccount;
