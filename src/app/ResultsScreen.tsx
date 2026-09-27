import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { Result } from './QuizScreen';




export default function ResultsScreen() {
  const results = useSelector((state:any)=> state.app.results);
  const correctCount = results.filter((r:any) => r.isCorrect).length;
  const total = results.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const renderItem = ({ item }: { item: Result }) => (
    <View style={[styles.row, item.isCorrect ? styles.correctRow : styles.wrongRow]}>
      <Text style={styles.rowText}>
        {item.question.num1} × {item.question.num1} = {item.question.answer}
      </Text>
      <Text style={styles.rowAnswer}>
        {item.timedOut
          ? 'Timed out'
          : item.userAnswer === null
          ? 'No answer'
          : `Your answer: ${item.userAnswer}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.score}>
        {correctCount} / {total} correct ({percent}%)
      </Text>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.question.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Practice Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  score: { fontSize: 18, textAlign: 'center', marginVertical: 12, color: '#333' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  correctRow: { backgroundColor: '#dcfce7' },
  wrongRow: { backgroundColor: '#fee2e2' },
  rowText: { fontSize: 16, fontWeight: '600' },
  rowAnswer: { fontSize: 14, color: '#444' },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
