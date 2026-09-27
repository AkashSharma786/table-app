
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import 'expo-router/entry';
import { useDispatch } from 'react-redux';
import { setQestions } from '../redux/AppSlice';





export type Question = {
  id:number,
  num1:number,
  num2:number,
  answer:number
}


function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestions(
  tableMin: number,
  tableMax: number,
  multMin: number,
  multMax: number,
 count:number

) {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const a = randomInt(tableMin, tableMax);
    const b = randomInt(multMin, multMax);
    questions.push({ id: i, num1:a, num2:b, answer: a * b });
  }
  return questions;
}

export default function ConfigScreen() {
  const [tableMin, setTableMin] = useState('2');
  const [tableMax, setTableMax] = useState('15');
  const [multMin, setMultMin] = useState('1');
  const [multMax, setMultMax] = useState('10');
  const [numQuestions, setNumQuestions] = useState('10');
  const [duration, setDuration] = useState('5');
  const dispatch = useDispatch();

  const handleStart = () => {
    const tMin = parseInt(tableMin, 10);
    const tMax = parseInt(tableMax, 10);
    const mMin = parseInt(multMin, 10);
    const mMax = parseInt(multMax, 10);
    const n = parseInt(numQuestions, 10);
    const dur = parseInt(duration, 10);

    if ([tMin, tMax, mMin, mMax, n, dur].some((v) => Number.isNaN(v))) {
      console.log(tMax,tMin,mMax, mMin, n, dur)
      Alert.alert('Invalid input', 'Please fill in all fields with valid numbers.');
      return;
    }
    if (tMin > tMax) {
      Alert.alert('Invalid range', 'Table range: min must be ≤ max.');
      return;
    }
    if (mMin > mMax) {
      Alert.alert('Invalid range', 'Multiplier range: min must be ≤ max.');
      return;
    }
    if (n < 1) {
      Alert.alert('Invalid input', 'Number of questions must be at least 1.');
      return;
    }
    if (dur < 1) {
      Alert.alert('Invalid input', 'Duration per question must be at least 1 second.');
      return;
    }

    const questions = generateQuestions(tMin, tMax, mMin, mMax, n);
    dispatch(setQestions({questions:questions}))
    console.log("dur", dur);
    router.push({pathname:'/QuizScreen', params:{durationPerQuestion:dur} })
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Times Tables Practice</Text>

      <Text style={styles.label}>Table range</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          keyboardType="number-pad"
          value={tableMin}
          onChangeText={setTableMin}
          placeholder="Min"
        />
        <TextInput
          style={styles.inputHalf}
          keyboardType="number-pad"
          value={tableMax}
          onChangeText={setTableMax}
          placeholder="Max"
        />
      </View>

      <Text style={styles.label}>Multiplier range</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          keyboardType="number-pad"
          value={multMin}
          onChangeText={setMultMin}
          placeholder="Min"
        />
        <TextInput
          style={styles.inputHalf}
          keyboardType="number-pad"
          value={multMax}
          onChangeText={setMultMax}
          placeholder="Max"
        />
      </View>

      <Text style={styles.label}>Total number of questions</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={numQuestions}
        onChangeText={setNumQuestions}
        placeholder="e.g. 10"
      />

      <Text style={styles.label}>Duration per question (seconds)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 10"
      />

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, flexGrow: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 6, color: '#333' },
  row: { flexDirection: 'row', gap: 12 },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
