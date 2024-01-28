import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore/lite';
import { useNavigation } from '@react-navigation/native';
import { app, db, auth } from '../services/firebaseConfig';
import Storage from '../services/Storage';

const PetOwnerNotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
        console.log('Fetching notifications');
      try {
        let user = await Storage.getData();
        user = JSON.parse(user);
        
        if (user) {
            console.log('user');
          const notificationsQuery = query(collection(db, "notifications"),where("receiver_id", "==", user.id));

          const notificationsSnapshot = await getDocs(notificationsQuery);
          const notificationsData = await Promise.all(
            notificationsSnapshot.docs.map(async (doc) => {
              const notification = doc.data();
              console.log(notification)
              // Fetch sender's profile details from the "user" collection
              const senderDoc = query(collection(db, 'profile'), where("uid", "==", notification.sender_id));
              let senderDocSnapshot = await getDocs(senderDoc);
              let senderProfile = null;
              senderDocSnapshot.forEach(doc => {
                let sender = doc.data();
                senderProfile = {
                    id: doc.id,
                    ...sender
                }
              });
            //   console.log(senderProfile);
              return { ...notification, senderProfile };
            })
          );
          console.log(notificationsData)
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const navigateToUserProfile = (userId, petId) => {
    // Navigate to the user profile screen with the provided userId
    navigation.navigate('UserProfile', { userId, petId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToUserProfile(item.senderProfile.uid, item.pet_id)}>
      <View style={styles.card}>
        <Image source={{ uri: item.senderProfile.image }} style={styles.profileImage} />
        <Text>{`${item.senderProfile.displayName} has liked your pet `}</Text>
        <Text style={{fontWeight: "bold"}}>{`See profile`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id} // Assuming you have an 'id' field in your notification documents
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
});

export default PetOwnerNotificationsScreen;
