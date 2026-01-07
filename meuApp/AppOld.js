import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {FaCheckCircle, FaTrash, FaPen} from 'react-icons/fa';// npm i react-icons
import axios from 'axios';// npm i axios
import 'bootstrap/dist/css/bootstrap.min.css';// npm i bootstrap

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Meu app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
