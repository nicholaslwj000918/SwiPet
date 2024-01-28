import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import tw from 'twrnc';
import Swiper from 'react-native-deck-swiper';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons"
import Storage from '../services/Storage';
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore/lite"; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const PetOwnerHomeScreen = () => {
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const [pets, setPets] = useState([])
  const [loggedInUser, setLoggedInUser] = useState({role: "petadopter"});

  const storage = getStorage();
  // Points to the root reference
const storageRef = ref(storage);

// Points to 'images'
const imagesRef = ref(storageRef, 'images');

  const fetch_all_pets = async () => {
    let logged = await Storage.getData();
    logged = JSON.parse(logged);
    console.log("Fetch all pets", logged.id)
    let pets = await getDocs(collection(db, "pets"), where("user_id", "==", logged.id))
    // let pets_array = pets.docs.map((doc) => {
    //   let pet = doc.data()
    //     if(pet.user_id == logged.id){
    //    return (
    //     {
    //       id: doc.id,
    //       name: pet.name,
    //       age: pet.age,
    //       location: pet.location,
    //       breed: pet.bread,
    //       Kilometer: 3,
    //       user_id: pet.user_id,
    //       photoURL:  pet.image,
    //     }
    //    )
    //   }
    // })

    let pets_array = [];
    pets.forEach(async (p) =>{
      let pet = p.data();
      console.log("pet uid", p.id)
   if(pet.user_id == logged.id){


      pets_array.push({
        id: p.id,
        name: pet.name,
        age: pet.age,
        location: pet.location,
        breed: pet.bread,
        Kilometer: 3,
        user_id: pet.user_id,
        photoURL: `https://firebasestorage.googleapis.com/v0/b/swipet-89d36.appspot.com/o/images%2F${pet.image}?alt=media&token=5335ac97-4c08-46ed-acd3-a8840b059928`
      })

    }
    });
    console.log('pets_array ',pets_array);
    setPets(pets_array)


  }



  const getLoggedInUser = async () => {
    let logged = await Storage.getData();
    logged = JSON.parse(logged);
    console.log('logged in user', logged)
    // console.log('user role', JSON.parse(logged));
    setLoggedInUser(logged);

  }

  useEffect(()=>{
    getLoggedInUser();
    fetch_all_pets();
   console.log("User logged in");
  }, [])

  const deletePet = async (petId) => {
    try {
      // Delete the pet document from the "pets" collection
      await deleteDoc(doc(db, 'pets', petId));


      // Update the local state to reflect the deletion
      setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));

      alert('Pet Deleted Successfully');
    } catch (error) {
        alert('Erro occurred while deleting.');
      console.error('Error deleting pet:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photoURL }}
      style={styles.petImage} />
      <View style={styles.details}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text>{`Age: ${item.age}`}</Text>
        <Text>{`Breed: ${item.breed}`}</Text>
        <Text>{`Location: ${item.location}`}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletePet(item.id)}
        >
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-[#B684EF] pt-12`}>

      <View style={tw` flex-row`}>

        <View >
          <TouchableOpacity onPress={()=> navigation.navigate("Profile")}>
            <Image style={tw`left-4 h-10 w-10 rounded-full`} source={{uri: loggedInUser.photoURL}} />
          </TouchableOpacity></View>
        <View style={tw`flex-row mx-12 pt-2`}><Text style={[{ fontSize: 18 }, { fontFamily: "SF-Pro" }, { color: "white" }]}>Hi,</Text><Text style={[{ fontWeight: 600 }, { fontSize: 18 }, { fontFamily: "SF-Pro-Medium" }, { color: "white" }]}> {loggedInUser.displayName} </Text><Text style={{ fontSize: 18 }}>👋</Text></View>
      </View>
      <View style={tw`flex-1`}>
        <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
</View>
      </View>



      <View style={tw`w-full h-15 justify-center items-center bg-white`}>
        <View style={tw`flex-row justify-evenly`}>
          <Entypo style={tw`mx-8`} name="user" size={26} color="#a9a7b4" onPress={() => navigation.navigate("Profile")} />
          <Entypo style={tw`mx-8`} name="message" size={26} color="#a9a7b4" onPress={() => navigation.navigate("Chat")} />
          <Entypo style={tw`mx-8`} name="bell" size={26} color="#a9a7b4" onPress={() => navigation.navigate("PetOwnerNotifications")} />
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
  },

    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    petImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    details: {
      flex: 1,
    },
    petName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    deleteButton: {
      backgroundColor: '#B684EF',
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },

})
export default PetOwnerHomeScreen;