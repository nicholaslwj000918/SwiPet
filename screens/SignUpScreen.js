import { View, Image, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native';
import {registerUser} from '../services/auth';

import { collection, addDoc } from "firebase/firestore/lite"; 
import { app, db, auth } from '../services/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import Storage from '../services/Storage';
import DropDownPicker from 'react-native-dropdown-picker';


const USER = {
    email: '',
    password: '',
    role: '',
    fullname: '',
}

const SignUpScreen = () => {

    const [user, setUser] = useState(USER);
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    const [items, setItems] = useState([
        {label: 'Pet Owner', value: 'petowner'},
        {label: 'Pet Adopter', value: 'petadopter'},
    ]);

    const handleSignUp = async () => {
        if(user.email == '' || user.password == ''){
            alert('Please enter your email and password');
        }else {
            let response = await registerUser(user);
            if(response.created){
                let uid = response.user.uid
                console.log(response.user.uid);

                updateProfile(auth.currentUser, {
                    displayName: user.fullname,
                }).then(() => {console.log('Full name set')})
                .catch((error) => {alert('Error occurred, while setting your full name. Please do it from profile section after logging in.')});


                let userToBeStored = {
                    id: uid,
                    role: user.role,
                }


                try {
                    const docRef = await addDoc(collection(db, "profile"), {
                      uid: uid,
                      role: user.role,
                      displayName: user.fullname,
                    });

                    if(docRef.id){
                        userToBeStored = {
                            ...userToBeStored,
                            photoURL: auth.currentUser.photoURL,
                            displayName: auth.currentUser.displayName
                    }

                        await Storage.storeData(JSON.stringify(userToBeStored));
                        if(userToBeStored.role ==="petowner"){
                            navigation.navigate("OwnerHome")
                        }else {
                            navigation.navigate("Home");
                        }
                    }else {
                        alert("Error occurred while creating profile. Please try again");
                    }

                    console.log("Profile with role created: ", docRef.id);
                  } catch (e) {
                    console.error("Error creating the profile: ", e);
                  }

                // navigation.navigate("Home");
            }else {
                alert("Your email might have been taken. Please try a different one.")
            }
        }
    }
    return (
        <View style={tw`flex-1 bg-[#B684EF]`}>
        <View style={tw`items-center justify-center flex-0.35 bg-[#B684EF] pt-8 pl-8`}>
            <Image
                style={styles.imageStyle}
                source={require("../Images/Heart.png")}
            />
            <Text style={styles.swiPetText}>SwiPet - Sign Up</Text>
            </View >

            <View style={tw`items-center justify-center flex-0.52 bg-[#B684EF]`}>

            <Text style={{alignSelf: 'flex-start',marginLeft: 20, marginBottom:2}}>Full Name: </Text>
            <TextInput style={styles.input} placeholder="Full Name" 
            onChangeText={(text) => {
                setUser({
                    ...user,
                    fullname: text,
                })
            }} />

            <Text style={{alignSelf: 'flex-start',marginTop:12,marginLeft: 20, marginBottom:2}}>Email: </Text>
            <TextInput style={styles.input} placeholder="Email" 
            onChangeText={(text) => {
                setUser({
                    ...user,
                    email: text,
                })
            }} />

            <Text 
            style={{alignSelf: 'flex-start', marginTop:12,marginLeft: 20, marginBottom:2}}>Password: </Text>
            <TextInput
            secureTextEntry={true}
            style={styles.input} placeholder="Password" 
            onChangeText={(text) => {
                setUser({
                    ...user,
                    password: text,
                })
            }} />
            
            <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{width:'90%', marginLeft:19, marginTop:10}}
                    maxHeight={70}
                    onChangeValue={(text) => {
                       setUser({
                        ...user,
                        role: text,
                       })
                    }}
                    placeholder={'You are'}

                />
          </View>
           <View style={[{marginTop:12},tw`px-8 py-8 flex-0.2`]}>
    
                <Pressable
                    onPress={() =>handleSignUp()}
                    android_ripple={{ color: '#FCA2CF', borderless: true }}
                    style={styles.loginButton}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
     
              
            </View>


            <View style={tw `px-8 py-4 flex-`}>
                
                <Text style={[{color:"white"},{textAlign:"center"},{fontFamily: 'AbyssinicaSIL'}, {fontSize: 13}]}>By tapping Create Account or Sign In, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookies Policy.</Text></View>

            <View style={tw`mx-4 mb-4`}>
            <View style={styles.buttonView}>
                <Pressable
                    onPress={() => navigation.navigate("Sign")}
                    android_ripple={{ color: '#FCA2CF', borderless: true }}
                    style={styles.anotherButton}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </Pressable>
            </View>


            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 128,
        height: 85
    },

    swiPetText: {
        marginTop: 8,
        right: 13,
        color: "white",
        fontFamily: 'Caveat-Bold',
        fontSize: 24
    },

    buttonView: {
        justifyContent: 'center',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "black",
        elevation: 5,
        margin:4,
      },

      loginButton: {
        height: 54,
        backgroundColor: '#FF69B4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
      },

      anotherButton: {
        height: 54,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
      
      },

      buttonText: {
        fontFamily: 'SF-Pro-Medium',
        fontSize: 15,
        fontWeight: "600",
      },

      input: {
        fontSize: 16,
        width: '90%',
        fontFamily: 'PlusJakartaSans-Regular',
        backgroundColor: '#FFFFFF',
        padding: 8,
        color: '#000000',
        borderRadius: 8,
      }

})
export default SignUpScreen
