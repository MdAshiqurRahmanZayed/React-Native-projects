import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const FinanceMain = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userId);

  const incomeUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/income-user(${userId}).json`;
  const expenseUrl = `https://helloreactnative-f1259-default-rtdb.firebaseio.com/financeapp/expanse-user(${userId}).json`;

  const fetchIncome = () => {
    setLoading(true);
    axios.get(`${incomeUrl}?auth=${token}`)
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

  const fetchExpense = () => {
    setLoading(true);
    axios.get(`${expenseUrl}?auth=${token}`)
      .then(response => {
        const expenseData = response.data ? Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })) : [];
        setExpense(expenseData);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        Alert.alert("Error", "Failed to fetch expense data. Please try again later.");
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchIncome();
      fetchExpense();
    }, [])
  );

  const calculateTotalIncome = (items) => {
    let total = 0;
    items.forEach(item => {
      total += item.value || 0;
    });
    return total;
  };

  const calculateTotalExpense = (items) => {
    let total = 0;
    items.forEach(item => {
      total += item.value || 0;
    });
    return total;
  };

  const totalIncome = calculateTotalIncome(income);
  const totalExpense = calculateTotalExpense(expense);
  const total = Number(totalIncome) - Number(totalExpense);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Finance Main</Text>

      <Text style={styles.sectionTitle}>All Income</Text>
      <Text style={styles.total}>Total income: {totalIncome}$</Text>
      <FlatList
        data={income}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.value}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>All Expense</Text>
      <Text style={styles.total}>Total expense: {totalExpense}$</Text>
      <FlatList
        data={expense}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.value}</Text>
          </View>
        )}
      />

      <View>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text>Total income: 
          <Text style={styles.total}>
            {totalIncome}$
          </Text>
        </Text>
        <Text>Total expense: 
          <Text style={styles.total}>
            {totalExpense}$
          </Text>
        </Text>
        <Text style={styles.totalCalculate}>Total: 
          <Text style={styles.total}>
            {total}$
          </Text>
        </Text>
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
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  total: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  totalCalculate: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FinanceMain;
