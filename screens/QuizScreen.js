import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizId, onComplete } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const quizQuestions = {
    quiz1: [
      { question: 'What is budgeting?', options: ['Saving', 'Spending', 'Planning'] },
      // Add more questions for quiz 1
    ],
    quiz2: [
      { question: 'What is the best way to budget as a student?', options: ['Plan ahead', 'Spend freely', 'Ignore finances'] },
      // Add more questions for quiz 2
    ],
    quiz3: [
      { question: 'What is the biggest challenge in managing finances in college?', options: ['Lack of income', 'Overspending', 'Budgeting'] },
      // Add more questions for quiz 3
    ],
    // Add more quizzes if needed
  };

  const currentQuiz = quizQuestions[quizId] || [];
  const currentQuestion = currentQuiz[currentQuestionIndex];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentQuestionIndex(0);
      setCompleted(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleAnswer = () => {
    if (currentQuestionIndex + 1 < currentQuiz.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
      if (onComplete) onComplete();
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {completed ? (
        <Text style={styles.completedText}>Quiz Completed!</Text>
      ) : (
        <View>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton} onPress={handleAnswer}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 24,
    color: '#6A5ACD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
