import { View, Image, Text, TextInput, TouchableOpacity, Platform, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo } from "@expo/vector-icons"
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';
import Storage from '../services/Storage'



const CreatePetProfile = () => {
    const petprofileObject = {
        image: '',
        name: '',
        bread: '',
        weight: '',
        medicalCondition: '',
        age: '',
        vaccination: '',
        spayed: '',
        location: '',
        user_id: null,
    
    };

    const [petProfile, setPetProfile] = useState(petprofileObject);
    const [image, setImage] = useState('');
    const [image_name,setImageName] = useState('')
    const [userId, setUserId] = useState()
    const storage = getStorage();

    // const incompleteForm = !image || !biography || !age || !job || !location || !email;
    const creatPet = async() => {
      console.log(petProfile);

        try {
            const docRef = await addDoc(collection(db, "pets"), petProfile);
            if(docRef.id){
              setPetProfile(petprofileObject);
              setImage('')
                alert("Pet Added");
            }
          } catch (e) {
            console.error("Error creating the profile: ", e);
            alert("Error occurred while Updating profile. Please try again");
          }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result)
        if (!result.cancelled) {
          try {
            // Fetch the image data as a Blob
            const response = await fetch(result.uri);
            const blob = await response.blob();
            const fileExtension = result.uri.split('.').pop();
            const fileName = result.fileName + Date.now().toString()
            // Create a reference with a timestamped filename
            const imageRef = ref(storage, `images/${fileName}.${fileExtension}`);
    
            // Upload the image data
            const uploadTask = await uploadBytes(imageRef, blob);
    
            // Get the download URL
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Image uploaded to:', downloadURL);
    
            setImage(result.uri);
            setPetProfile({
                ...petProfile,
                image: `${fileName}.${fileExtension}`,
                user_id: userId,
            
            })
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };

 

    useEffect(() => {
        (async () => {
          let user = await Storage.getData();
          user = JSON.parse(user)
          console.log('pet profile user id',user.id)
          setUserId(user.id);
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    return (
        <LinearGradient colors={["#D9D9D9", "#D9D9D9", "#D9D9D9", "#B684EF"]} style={tw`flex-1 `}>
            <ScrollView>
            <View style={tw`flex-1 pt-5 items-center`}>
                <Image
                    style={tw`h-20 w-30 my-1 left-4`}
                    source={require("../Images/Heart.png")}
                />
                <Text style={[{ fontFamily: 'Caveat-Bold' }, { fontSize: 24 }]}>SwiPet</Text>

                <Text style={[{ fontFamily: 'PlusJakartaSans-Bold' }, { color: "#B684EF" }, { fontSize: 24 }]}> Create Pet Profile</Text>
                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 1: Upload Pet Picture</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                            <View style={tw`h-23.5 w-23.5 left-3 rounded-full bg-[#B684EF]`}>
                                <Image style={tw`h-23 w-23 rounded-full`} source={{uri: image}} />
                            </View>
                  </TouchableOpacity>
                <View style={styles.buttonView}>
                <Pressable
                    onPress={() => pickImage()}
                    android_ripple={{ color: '#FCA2CF', borderless: true }}
                    style={styles.loginButton}>
                    <Text style={styles.buttonText}>Select Image</Text>
                </Pressable>


            </View>

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 2: Pet Name</Text>
                <TextInput 
                value={petProfile.name}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    name: text,

                })}
                maxLength={100}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Name" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 3: Age</Text>
                <TextInput 
                value={petProfile.age}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    age: text,

                })}
                keyboardType="numeric"
                maxLength={2}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Enter Pet age" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 4: Pet Weight</Text>
                <TextInput 
                value={petProfile.weight}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    weight: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Weight" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 5: Pet Breed</Text>
                <TextInput
                value={petProfile.bread}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    bread: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Breed" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 6: Medical Condition</Text>
                <TextInput
                value={petProfile.medicalCondition}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    medicalCondition: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Medical Condition" />

<Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 7: Vaccination</Text>
                <TextInput
                value={petProfile.vaccination}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    vaccination: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Vaccination" />


<Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 8: Spayed</Text>
                <TextInput
                value={petProfile.spayed}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    spayed: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Spayed" />

<Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 9: Location</Text>
                <TextInput
                value={petProfile.location}
                onChangeText={text=> setPetProfile({
                    ...petProfile,
                    location: text,

                })}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Pet Location" />
                <View style={tw`left-37`}>

                    <TouchableOpacity style={[tw`elevation-8 items-center justify-center rounded-full w-13 h-13 bg-[#FCA2CF] border-solid border-b-4 border-r-2`,
                        // incompleteForm ? tw`bg-gray-400` : tw`bg-[#FCA2CF]`,
                    ]}
                        disabled={false}
                        onPress={() => {
                           creatPet();
                        }}>
                        <Entypo name="check" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default CreatePetProfile
const styles = StyleSheet.create({

buttonView: {
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "black",
    elevation: 5,
    margin:4,
    marginLeft:25,
    marginTop:10
  },
  loginButton: {
    height: 44,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    padding:10,
    width: 120,
  }
});