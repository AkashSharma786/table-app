import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { setResults } from '@/redux/AppSlice';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Question } from '.';




export type Result = {
  userAnswer:number |null,
  question:Question,
  isCorrect:boolean,
  timedOut:boolean
}
type QuizScreen ={
  durationPerQuestion:number
}
export default function QuizScreen() {

  const questions = useSelector((state:any)=> state.app.questions);
  const dispatch = useDispatch();
  
  const { durationPerQuestion } = useLocalSearchParams<{ durationPerQuestion?: string }>();
  const duration = Number(durationPerQuestion?? 5);

 const [curentResult, setCurrentResult] = useState<Result[]>([])
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  
  const [timeLeft, setTimeLeft] = useState<number>(duration?? 5);
 
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerRef = useRef('');
  console.log(timeLeft)

  const current = questions[index];

  useEffect(() => {
    setTimeLeft(duration);
    setAnswer('');
    answerRef.current = '';

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const submit = (timedOut: boolean) => {
    
    const raw = answerRef.current.trim();
    const parsed = raw === '' ? null : parseInt(raw, 10);
    const isCorrect = !timedOut && parsed === current.answer;
    const result = {  userAnswer: parsed, question:current,  isCorrect, timedOut };

    setCurrentResult((prev:Result[]) => {

      const updated = [...prev, result];
      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        dispatch(setResults({results:curentResult}))
        router.replace("/ResultsScreen");
      }
      return updated;
    });

  
  };

  const onChangeAnswer = (text: string) => {
    answerRef.current = text;
    setAnswer(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.progress}>
        Question {index + 1} / {questions.length}
      </Text>
      <Text style={styles.timer}>{timeLeft}</Text>

      <Text style={styles.question}>
        {current.num1} × {current.num2} = ?
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={answer}
        onChangeText={onChangeAnswer}
        autoFocus
        placeholder="Your answer"
        onSubmitEditing={() => submit(false)}
      />

      <TouchableOpacity style={styles.button} onPress={() => submit(false)}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#fff' },
  progress: { fontSize: 14, color: '#666', textAlign: 'center' },
  timer: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
    color: '#dc2626',
  },
  question: { fontSize: 40, fontWeight: '800', textAlign: 'center', marginVertical: 32 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
