import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Circle } from 'react-native-progress';  
import { useNavigation } from '@react-navigation/native';

export default function FinDucationScreen() {
  const navigation = useNavigation();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const totalQuizzes = 15; // Total number of quizzes across all chapters

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
    // Add more chapters as needed
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
          progress={progressPercentage / 100} // Progress as a fraction
          showsText={true}
          textStyle={styles.progressText}
          color="#6A5ACD"
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
                onPress={() => navigation.navigate('QuizScreen', { quizId: item.id, onComplete: handleQuizCompletion })}
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
    backgroundColor: '#F8F8F8',
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
    color: '#000',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  progressText: {
    fontSize: 18,
    color: '#6A5ACD',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  chapterContent: {
    marginTop: 20,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  quizButton: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
