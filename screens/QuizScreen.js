import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizId } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = {
    quiz1: [
      {
        question: 'What is budgeting?',
        options: ['Saving', 'Spending', 'Planning'],
        correctAnswer: 'Planning',
      },
      {
        question: 'Which of the following is a benefit of budgeting?',
        options: ['Financial security', 'Increased debt', 'Uncontrolled spending'],
        correctAnswer: 'Financial security',
      },
      {
        question: 'Why is it important to budget your income?',
        options: ['To overspend', 'To plan expenses', 'To ignore finances'],
        correctAnswer: 'To plan expenses',
      },
    ],
    quiz2: [
      {
        question: 'What is the best way to budget as a student?',
        options: ['Plan ahead', 'Spend freely', 'Ignore finances'],
        correctAnswer: 'Plan ahead',
      },
      {
        question: 'What should be prioritized in a student budget?',
        options: ['Tuition and books', 'Parties', 'Entertainment'],
        correctAnswer: 'Tuition and books',
      },
      {
        question: 'How can a student save more money?',
        options: ['Avoid eating out', 'Buy new gadgets', 'Take a loan'],
        correctAnswer: 'Avoid eating out',
      },
    ],
    quiz3: [
      {
        question: 'What is the biggest challenge in managing finances in college?',
        options: ['Lack of income', 'Overspending', 'Budgeting'],
        correctAnswer: 'Overspending',
      },
      {
        question: 'Which of the following can help with financial management in college?',
        options: ['Creating a budget', 'Ignoring expenses', 'Using credit cards for everything'],
        correctAnswer: 'Creating a budget',
      },
      {
        question: 'What is a good financial habit for college students?',
        options: ['Saving money', 'Ignoring bills', 'Borrowing often'],
        correctAnswer: 'Saving money',
      },
    ],
    quiz4: [
      {
        question: 'What is an emergency fund?',
        options: ['Money set aside for unforeseen expenses', 'Savings for a vacation', 'Investment in stocks'],
        correctAnswer: 'Money set aside for unforeseen expenses',
      },
      {
        question: 'How much should be in your emergency fund?',
        options: ['1 month of expenses', '3-6 months of expenses', '1 year of expenses'],
        correctAnswer: '3-6 months of expenses',
      },
      {
        question: 'Why is it important to have an emergency fund?',
        options: ['To cover unexpected expenses', 'To invest in stocks', 'To pay for entertainment'],
        correctAnswer: 'To cover unexpected expenses',
      },
    ],
    quiz5: [
      {
        question: 'What is the purpose of investing?',
        options: ['To grow your money', 'To lose money', 'To spend on luxuries'],
        correctAnswer: 'To grow your money',
      },
      {
        question: 'Which of the following is a type of investment?',
        options: ['Stocks', 'Loans', 'Credit cards'],
        correctAnswer: 'Stocks',
      },
      {
        question: 'What is a safe investment for beginners?',
        options: ['High-risk stocks', 'Savings account', 'Gambling'],
        correctAnswer: 'Savings account',
      },
    ],
  };

  const currentQuiz = quizQuestions[quizId] || [];
  const currentQuestion = currentQuiz[currentQuestionIndex];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentQuestionIndex(0);
      setCompleted(false);
      setSelectedOption(null);
      setShowAnswerFeedback(false);
      setScore(0);
    });

    return unsubscribe;
  }, [navigation]);

  const handleAnswer = (selected) => {
    setSelectedOption(selected);
    setShowAnswerFeedback(true);

    setTimeout(() => {
      if (selected === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }

      if (currentQuestionIndex + 1 < currentQuiz.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCompleted(true);
        navigation.goBack();
      }

      setSelectedOption(null); // Reset selection for the next question
      setShowAnswerFeedback(false);
    }, 1000); // 1-second delay for feedback
  };

  return (
    <View style={styles.container}>
      {completed ? (
        <Text style={styles.completedText}>Quiz Completed!</Text>
      ) : (
        <View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && {
                  backgroundColor:
                    option === currentQuestion.correctAnswer ? '#4CAF50' : '#FF5252',
                },
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          {showAnswerFeedback && (
            <Text
              style={[
                styles.answerFeedbackText,
                {
                  color:
                    selectedOption === currentQuestion.correctAnswer ? '#4CAF50' : '#FF5252',
                },
              ]}
            >
              {selectedOption === currentQuestion.correctAnswer
                ? 'Correct!'
                : 'Incorrect, try again!'}
            </Text>
          )}
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
  scoreContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  answerFeedbackText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});
