import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import tw from 'twrnc';
import Swiper from 'react-native-deck-swiper';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons"
import Storage from '../services/Storage';
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const HomeScreen = () => {
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const [pets, setPets] = useState([])
  const [loggedInUser, setLoggedInUser] = useState({role: "petadopter"});
  const storage = getStorage();

  const fetch_all_pets = async () => {
    let pets = await getDocs(collection(db, "pets"))
    let pets_array =[]
    await pets.forEach(async (p) =>{
      let pet = p.data();
      console.log("pet uid", p.id)
      pets_array.push({
        id: p.id,
        name: pet.name,
        age: pet.age,
        location: pet.location,
        breed: pet.bread,
        Kilometer: 3,
        user_id: pet.user_id,
        photoURL: `https://firebasestorage.googleapis.com/v0/b/swipet-89d36.appspot.com/o/images%2F${pet.image}?alt=media&token=5335ac97-4c08-46ed-acd3-a8840b059928`,

      })
    });
    console.log(pets_array);
    setPets(pets_array)
  }

  const likePet = async (pet) => {
    console.log('pet', pet)
    try {
      // Check if the user is logged in
      let user = await Storage.getData();
      user = JSON.parse(user);
      console.log('user', user.id);
      if (!user) {
        alert("Please log in to like the pet.");
        return;
      }
  
      // Check if the user has already liked the pet
      const likedQuery = query(
        collection(db, "liked"),
        where("user_id", '==', user.id),
        where("pet_id", '==', pet.id)
      );
  
      const likedSnapshot = await getDocs(likedQuery);
      if (!likedSnapshot.empty) {
        alert("You have already liked this pet.");
        return;
      }
  
      // If the user hasn't liked the pet, add a new like record
      await addDoc(collection(db, 'liked'), { user_id: user.id, pet_id: pet.id });
  
      // Create a notification record
      await addDoc(collection(db, 'notifications'), {
        sender_id: user.id,
        receiver_id: pet.user_id, // ID of the pet owner
        action: 'like',
        pet_id: pet.id,
        timestamp: new Date(),
      });
  
      alert("Pet Liked!");
  
    } catch (error) {
      console.error('Error liking the pet:', error);
      alert('Error occurred while liking the pet. Please try again.');
    }
  };

  const getLoggedInUser = async () => {
    let logged = await Storage.getData();
    console.log('user role', JSON.parse(logged));
    setLoggedInUser(JSON.parse(logged));
  }

  useEffect(async ()=>{
   await getLoggedInUser();
    fetch_all_pets()
  }, [])

  return (
    <View style={tw`flex-1 bg-[#B684EF] pt-12`}>

      <View style={tw` flex-row`}>

      <View >
          <TouchableOpacity onPress={()=> navigation.navigate("Profile")}>
            <Image style={tw`left-4 h-10 w-10 rounded-full`} source={{uri: loggedInUser.photoURL}} />
          </TouchableOpacity></View>
        <View style={tw`flex-row mx-12 pt-2`}><Text style={[{ fontSize: 18 }, { fontFamily: "SF-Pro" }, { color: "white" }]}>Hi,</Text><Text style={[{ fontWeight: 600 }, { fontSize: 18 }, { fontFamily: "SF-Pro-Medium" }, { color: "white" }]}> {loggedInUser.displayName} </Text><Text style={{ fontSize: 18 }}>👋</Text></View>
      </View>

      <View style={[styles.anotherButton, tw`top-2`]}>
        <View style={tw`flex-row justify-evenly`}>
          <Entypo name="magnifying-glass" style={tw`pt-1`} size={30} color="#a9a7b4" onPress={() => navigation.navigate("Chat")} />
          <TextInput style={styles.input} placeholder="Search pets" />
          <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-10 h-10 bg-[#FCA2CF]`}
          onPress={() => swipeRef.current.swipeLeft()}>
          <Entypo name="list" size={24} color="white" />
        </TouchableOpacity>
        </View>
      </View>
      <View style={tw`flex-1`}>

        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={pets}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(card) => {
            console.log("PASS", pets[card]);
          }}
          onSwipedRight={(card) => {
            likePet(pets[card])
          }}
          backgroundColor='#4FD0E9'
          overlayLabels={{
            left: {
              title: "PASS",
              style: {
                label: {
                  textAlign: "right",
                  color: "red"
                }
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  color: "#4DED30"
                }
              }
            }
          }}
          renderCard={(card) => (
            <View
              key={card?.id}
              style={tw`h-140 w-full bg-white rounded-xl items-end elevation-16 mt-2 bottom-12`}>

              <Image
                style={tw`absolute top-0 h-full w-full rounded-xl`}
                source={{ uri: card?.photoURL }} />
              <View style={[tw`mt-84 bg-white items-center justify-center w-full h-30`, styles.cardShadow,
              { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
                <View style={tw`flex-row`}>
                  <Text style={[{ color: "white" }, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 600 }, { fontSize: 32 }, { margin: 5 }, { opacity: 1 }]}>{card?.name}</Text>
                  <Text style={[{ color: "white" }, { fontFamily: "SF-Pro" }, { fontSize: 26 }, { margin: 5 }, { paddingTop: 5 }, { opacity: 1 }]}>{card?.age}</Text>
                  <Text style={[{ color: "white" }, { fontFamily: "SF-Pro" }, { fontSize: 18 }, { paddingTop: 16 }, { opacity: 1 }]}>yrs</Text>
                </View>
                <Text style={[{ color: "white" }, { fontFamily: "SF-Pro" }, { fontSize: 14 }]}>
                  <Entypo name="home" size={14} color="white" /> Lives in {card?.location}</Text>
                <Text style={[{ color: "white" }, { fontFamily: "SF-Pro" }, { fontSize: 14 }]}>
                  <Entypo name="location" size={14} color="white" /> {card?.Kilometer} kilometer away</Text>
              </View>

            </View>
          )}
        />
      </View>

      <View style={tw`flex flex-row justify-evenly pb-5`}>
        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16 bg-[#FCA2CF] border-solid border-b-4 border-r-2`}
          onPress={() => swipeRef.current.swipeLeft()}>
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16 bg-[#B684EF] border-solid border-b-4 border-r-2`}
          onPress={() => navigation.navigate("Chat")}>
          <Entypo name="message" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={tw`elevation-8 items-center justify-center rounded-full w-16 h-16" bg-[#FCA2CF] border-solid border-b-4 border-r-2`}
          onPress={() => swipeRef.current.swipeRight()}>
          <AntDesign name="heart" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={tw`w-full h-15 justify-center items-center bg-white`}>
        <View style={tw`flex-row justify-evenly`}>
          <Entypo style={tw`mx-8`} name="user" size={26} color="#a9a7b4" onPress={() => navigation.navigate("Profile")} />
          <Entypo style={tw`mx-8`} name="message" size={26} color="#a9a7b4" onPress={() => navigation.navigate("Chat")} />
          <Entypo style={tw`mx-8`} name="bell" size={26} color="#a9a7b4" onPress={() => navigation.navigate("PetAdopterNotificationScreen")} />
          {loggedInUser.role === "petowner" &&
          <Entypo style={tw`mx-8`} name="edit" size={26} color="#a9a7b4" onPress={() => navigation.navigate("CreatePet")} />
          }
        </View>
      </View>
    </View >
  )
}


const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffSet: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },

  anotherButton: {
    height: 54,
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding:7,
  },

  input: {
    fontSize: 16,
    width: '70%',
    fontFamily: 'PlusJakartaSans-Regular'
  }
})
export default HomeScreen