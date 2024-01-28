import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { app, db, auth } from '../services/firebaseConfig';
import { collection, doc, onSnapshot, query, orderBy, addDoc,where, serverTimestamp, getDocs } from 'firebase/firestore/lite';
import Storage from '../services/Storage'
const ConversationScreen = () => {
  const route = useRoute();
  const { chatId, receiver_id } = route.params;
  console.log('params:', route.params);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userr, setUserr] = useState(null);

  useEffect(async () => {


    const fetchMessages = async () => {
        let u = await Storage.getData();
        setUserr(JSON.parse(u).id);
        
    const chatQuery = query(
      collection(db, "messages"),
      where("chat_id", "==", chatId),
    );

    let snapshot = await getDocs(chatQuery)
    let messages = [];
    snapshot.forEach(doc => {
        console.log('doc data',doc.data())
        let message = doc.data();
        if(message.text !== ""){
        messages.push({
            id: doc.id,
            ...doc.data(),
        })
      }
    })
      setMessages(messages);
    }

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    try {
      let user = await Storage.getData()
      user = JSON.parse(user);

      // Add the new message to the "messages" subcollection in the chat
      let messageObj = {
        sender_id: user.id,
        chat_id: chatId,
        receiver_id: receiver_id,
        text: messageText,
        timestamp: serverTimestamp(),
      }
      await addDoc(collection(db, `messages`), messageObj);
      let oldMessages = messages
      oldMessages.push(messageObj)
      setMessages(oldMessages);
      // Clear the message input after sending
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender_id === userr ? styles.sentMessage : styles.receivedMessage}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#B684EF',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
    padding: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    height: 40,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default ConversationScreen;
