import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const FinGuru = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([
        {
            role: 'bot',
            content: "Hello! I'm FinGuru, your financial assistant. Before we get started, could you please tell me your age and gender? This will help me provide more personalized financial advice."
        }
    ]);

    const sendMessage = async () => {
        if (message.trim() === '') return; // Prevent sending empty messages

        try {
            const response = await axios.post('http://10.0.2.2:5000/chat', { message });
            const chatbotResponse = response.data.response;

            setConversation([...conversation, { role: 'user', content: message }, { role: 'bot', content: chatbotResponse }]);
            setMessage('');
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.conversationContainer}>
                {conversation.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            msg.role === 'user' ? styles.userMessage : styles.botMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message"
                    placeholderTextColor="#B0B0B0"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <FontAwesome name="send" size={20} color="#B68D40" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#0E0B1F',
    },
    conversationContainer: {
        flex: 1,
        marginBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: '#B68D40',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    botMessage: {
        backgroundColor: '#333',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: '#FFF',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F1B2E',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        color: '#FFF',
        height: 40,
    },
    sendButton: {
        paddingLeft: 10,
        paddingVertical: 5,
    },
});

export default FinGuru;
