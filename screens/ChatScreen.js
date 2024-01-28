import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../services/firebaseConfig';
import { collection, doc, getDocs, query, where, getDoc, or, limit } from 'firebase/firestore/lite';
import Storage from '../services/Storage';

const ChatsScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        let user = await Storage.getData();
        user = JSON.parse(user);
        if (user) {
          const chatsQuery = query(collection(db, 'chat'), or(where("sender_id", '==', user.id), where("receiver_id","==",user.id)));
          const chatsSnapshot = await getDocs(chatsQuery);
          const chatsData = await Promise.all(
            chatsSnapshot.docs.map(async (chatdoc) => {
              const chat = chatdoc.data();
              console.log(chat)
              let otherUserId = chat.sender_id;
              console.log('otherUserId before', otherUserId)
              if(otherUserId == user.id){
                otherUserId = chat.receiver_id;
              }
              // Fetch sender's profile details from the "user" collection
              const senderDoc = query(collection(db, 'profile'), where("uid", "==", otherUserId));
              let senderDocSnapshot = await getDocs(senderDoc);
              let senderProfile = null;
              senderDocSnapshot.forEach(doc => {
                let sender = doc.data();
                senderProfile = {
                    chatId: chatdoc.id,
                    ...sender
                }
              });
             
              return { ...chat, senderProfile };
            })
          );

          console.log('chats', chatsData);
          setChats(chatsData);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('ConversationScreen', {chatId: item.senderProfile.chatId, receiver_id: item.senderProfile.uid});
    }}>
      <View style={styles.card}>
        <Image source={{ uri: item.senderProfile.image }} style={styles.profileImage} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.senderProfile.displayName}</Text>
          <Text style={styles.timestamp}>{''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ChatsScreen;
