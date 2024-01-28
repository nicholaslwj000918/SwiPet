import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, Modal, TextInput } from 'react-native'
import {useEffect, useState} from 'react';
import tw from 'twrnc'
import { AntDesign, Entypo } from "@expo/vector-icons"
import { useNavigation, useRoute } from '@react-navigation/native'
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import Storage from '../services/Storage';

const UserProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const userId = route.params?.userId;
    const petId = route.params?.petId;
    const [userProfile, setUserProfile] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [checkMatch, setCheckMatch] = useState(false);
    const [message, setMessage] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const isMatch = async () => {
        let matchExist = query(collection(db, "matches"), where("petowner", "==", loggedInUser.id), where("petadopter", "==", userId))
        let matchExistSnapshot = getDocs(matchExist);
        let checkMatchh = false;
        (await matchExistSnapshot).forEach(doc => {
            if(doc.id){
                checkMatchh = true;
            }
        })

        if(checkMatchh){
            setCheckMatch(true);
        }

        await addDoc(collection(db, "notifications"), {
            pet_id: petId,
            sender_id: Storage.getUserId(),
            receiver_id: userId,
            action: "matched",
            timestamp: new Date(),
        });
    }

    const initiateConversation = async () => {
        try {
          // Get the current user ID
          const senderUserId = loggedInUser.id;
      
          // Check if a chat already exists between the two users
          const chatDocRef = await addDoc(collection(db, 'chat'), {
            sender_id: senderUserId,
            receiver_id: userId,
            pet_id: petId,
          }); // Create a new chat
          const chatId = chatDocRef.id;

          if(chatId){
      
      
          // Create the initial message
          const initialMessage = {
            sender_id: senderUserId,
            text: message,
            receiver_id: userId,
            chat_id: chatId,
            timestamp: new Date(),
          };
                    // Add the initial message to the "messages" subcollection in the chat
                    await addDoc(collection(db, `messages`), initialMessage);
      
                    console.log('Conversation initiated successfully!');
                    navigation.navigate('Chat', {chatId});
        }
      

        } catch (error) {
          console.error('Error initiating conversation:', error);
        }
      };

    const match = async () => {


        if(!checkMatch){
            if(message != '' || message != null){
            let createMatch = await addDoc(collection(db, "matches"), {
                petowner: loggedInUser.id,
                petadopter: userId,
                pet_id: petId
            })
            if(createMatch.id){
                setCheckMatch(true);
                await initiateConversation()
                alert('Matched.');

            }
        }else {
            alert('Write a message to the Adopter');
        }
        }
    }
  
    useEffect(() => {
        console.log('user profile', userId);
        const fetchUserProfile = async () => {
            let user = await Storage.getData();
            user = JSON.parse(user);
            setLoggedInUser(user);
          try {
            console.log('fetching user profile')
            const profileQuery = query(
              collection(db, 'profile'),
              where('uid', '==', userId),
            );
            const profileSnapshot = await getDocs(profileQuery);
    
            let additionalProfileData = null;
            profileSnapshot.forEach((doc) => {
              additionalProfileData = doc.data();
              console.log(doc.data());
            });
    
            // setUserProfile(userData);
            // console.l
            setProfileData(additionalProfileData);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        if (userId) {
          fetchUserProfile();
          isMatch();
        }
      }, [userId]);
    return (
            <View style={tw`flex-1 pt-2 bg-[#FFFFFF]`}>



                <View style={tw`h-60 items-center bg-[#F9F3FE]`}>
                    <View>

                        {/*Profile Picture*/}
                        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                            <View>
                                <Image style={{width:400, height: 250}} source={{uri: profileData?.image}} />
                            </View>
                        </TouchableOpacity>


                    </View>
                </View>

                <View style={tw`pl-1 pt-2 justify-center items-center`}>
                            <Text style={[{ fontFamily: 'SF-Pro-Medium' }, { fontSize: 18 }, {marginTop: 6}, { fontWeight: "bold" }]}>{profileData?.displayName}</Text>
                        </View>
                {/*About Me*/}

                <View style={tw`h-26 p-6`}>
                    <Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 15 }, { fontWeight: 700 }]}>About me</Text>
                    <Text style={[{ fontFamily: "SF-Pro" }, tw`pt-1`, { fontSize: 14 }]}>{profileData?.biography}</Text>
                </View>

                {/*Basic Info*/}

                
                <View style={tw`h-86 p-3`}>
                    <View style={tw`m-2`}><Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 15 }, { fontWeight: 700 }]}>Basic Info</Text></View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="clipboard" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{profileData?.age} years old</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="suitcase" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{profileData?.job}</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="location" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{profileData?.location}</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="mail" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{profileData?.email}</Text>
                    </View>

                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="message" size={17} color="#B684EF" style={tw`pr-3`} />
                        <TextInput 
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                        style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }, 
                        {borderWidth:1, width: '90%', height: 50, borderRadius:12}]} multiline={true} />
                 
                    </View>
               
                    <View style={tw`flex flex-row justify-evenly mt-4`}>
        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16 bg-[#FCA2CF] border-solid border-b-4 border-r-2`}
          onPress={() => {}}>
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16 bg-[#B684EF] border-solid border-b-4 border-r-2`}
          onPress={() => {}}>
          <Entypo name="message" size={24} color="white" />
        </TouchableOpacity>
        {!checkMatch &&
        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16" bg-[#FCA2CF] border-solid border-b-4 border-r-2`}
          onPress={() => match()}>
          <AntDesign name="heart" size={24} color="white" />
        </TouchableOpacity>
}
      </View>
                </View>


            </View>
    )
}

export default UserProfileScreen

const styles = StyleSheet.create({
    buttonView: {
        justifyContent: 'center',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "black",
        elevation: 5,
    },

    loginButton: {
        height: 30,
        width: 120,
        backgroundColor: '#FF69B4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    }

})