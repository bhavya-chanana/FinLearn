import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';

const FinGuru = () => {
    const [message, setMessage] = useState('');gi
    const [conversation, setConversation] = useState([]);

    const sendMessage = async () => {
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
        <View style={{ padding: 20, flex: 1 }}>
            <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                {conversation.map((msg, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal' }}>
                            {msg.role === 'user' ? 'You:' : 'FinGuru:'} {msg.content}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message"
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingLeft: 8,
                }}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

export default FinGuru;
