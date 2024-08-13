import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Circle } from 'react-native-progress';  
import { useNavigation } from '@react-navigation/native';

export default function FinDucationScreen() {
  const navigation = useNavigation();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const totalQuizzes = 5;

  const chapters = [
    {
      id: 'chapter1',
      title: 'Chapter 1: Introduction to Budgeting',
      description: 'Learn the basics of budgeting, why it is important, and how to start your budgeting journey.',
      quizzes: [
        { id: 'quiz1', title: 'Quiz 1: Budget Basics' },
      ],
    },
    {
      id: 'chapter2',
      title: 'Chapter 2: Budgeting for Students',
      description: 'Explore budgeting techniques tailored for students and young adults.',
      quizzes: [
        { id: 'quiz2', title: 'Quiz 1: Student Budget Techniques' },
        { id: 'quiz3', title: 'Quiz 2: Managing Finances in College' },
      ],
    },
    {
      id: 'chapter3',
      title: 'Chapter 3: Emergency Funds',
      description: 'Understand the importance of emergency funds and how to build them.',
      quizzes: [
        { id: 'quiz4', title: 'Quiz 1: Building an Emergency Fund' },
      ],
    },
    {
      id: 'chapter4',
      title: 'Chapter 4: Introduction to Investing',
      description: 'Learn the basics of investing and different types of investments.',
      quizzes: [
        { id: 'quiz5', title: 'Quiz 1: Investment Basics' },
      ],
    },
  ];

  const handleQuizCompletion = () => {
    setCompletedQuizzes(prevCount => Math.min(prevCount + 1, totalQuizzes));
  };

  const selectedChapterData = chapters.find(chap => chap.id === selectedChapter);

  const progressPercentage = (completedQuizzes / totalQuizzes) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi,</Text>
          <Text style={styles.username}>Shreya!</Text>
        </View>
        <Circle
          size={100}
          progress={progressPercentage / 100}
          showsText={true}
          textStyle={styles.progressText}
          color="#B68D40"
          borderWidth={2}
          thickness={8}
          formatText={() => `${Math.round(progressPercentage)}%`}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => setSelectedChapter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select chapter" value={null} />
          {chapters.map(chapter => (
            <Picker.Item key={chapter.id} label={chapter.title} value={chapter.id} />
          ))}
        </Picker>
      </View>
      {selectedChapterData && (
        <View style={styles.chapterContent}>
          <Text style={styles.chapterTitle}>{selectedChapterData.title}</Text>
          <Text style={styles.description}>{selectedChapterData.description}</Text>
          <Text style={styles.subtitle}>Quizzes</Text>
          <FlatList
            data={selectedChapterData.quizzes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quizButton}
                onPress={() => navigation.navigate('QuizScreen', { quizId: item.id })}
              >
                <Text style={styles.quizButtonText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B1F',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#FFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressText: {
    fontSize: 18,
    color: '#B68D40',
  },
  pickerContainer: {
    backgroundColor: '#1F1B2E',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#FFF',
  },
  chapterContent: {
    marginTop: 20,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  quizButton: {
    backgroundColor: '#B68D40',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  quizButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
