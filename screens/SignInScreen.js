import { View, Image, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native';
import {loginUser} from '../services/auth';
import Storage from '../services/Storage';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import {app, db, auth} from '../services/firebaseConfig';
const USER = {
    email: '',
    password: '',
}
const SignInScreen = () => {

    const [user, setUser] = useState(USER);
    const navigation = useNavigation();
    const handleSignIn = async () => {
        if(user.email == '' || user.password == ''){
                alert('Please enter your email and password');
        }else {
            let response = await loginUser(user);
            if(response.isLoggedIn){
                console.log(response);
                let userToStore = null;
                const q = query(collection(db, "profile"), where("uid", "==", auth.currentUser.uid), limit(1));

                const querySnapshot = await getDocs(q);
               await querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc.id, " => ", doc.data());
                  let profileData = doc.data()
                  userToStore = {
                    id: auth.currentUser.uid,
                    role: profileData.role,
                    photoURL: auth.currentUser.photoURL,
                    displayName: auth.currentUser.displayName,
                    // email: auth.currentUser.email
                  }
        
                });
                // console.log('response user ',response.user);
                console.log('userto store', userToStore)
                if(userToStore){
                    console.log('userToStore', JSON.stringify(userToStore));
                    await Storage.storeData(JSON.stringify(userToStore));
                    if(userToStore.role ==="petowner"){
                        console.log("navigated to OwnerHome")
                        navigation.navigate("OwnerHome")
                    }else {
                        console.log("navigated to Adopter Home")
                        navigation.navigate("Home");
                    }

                }else {
                alert("Some error occured, please try again");

                }

            }else {

                alert("Invalid Credentials. Please try again.")
            }
        }
    }
    return (
        <View style={tw`flex-1 bg-[#B684EF]`}>
        <View style={tw`items-center justify-center flex-0.4 bg-[#B684EF] pt-8 pl-8`}>
            <Image
                style={styles.imageStyle}
                source={require("../Images/Heart.png")}
            />
            <Text style={styles.swiPetText}>SwiPet - Sign In</Text>
            </View >

            <View style={tw`items-center justify-center flex-0.2 bg-[#B684EF]`}>
            <Text style={{alignSelf: 'flex-start',marginLeft: 20, marginBottom:2}}>Email: </Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => {
                setUser({
                    ...user,
                    email: text,
                })
            }} />

            <Text style={{alignSelf: 'flex-start', marginTop:12,marginLeft: 20, marginBottom:2}}>Password: </Text>
            <TextInput
            secureTextEntry={true}
            style={styles.input} placeholder="Password" 
            onChangeText={(text) => {
                setUser({
                    ...user,
                    password: text,
                })
            }} />
          </View>
           <View style={tw`px-8 py-8 flex-0.2`}>
    
                <Pressable
                    onPress={() =>handleSignIn()}
                    android_ripple={{ color: '#FCA2CF', borderless: true }}
                    style={styles.anotherButton}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
     
              
            </View>


            <View style={tw `px-8 py-4 flex-`}>
                
                <Text style={[{color:"white"},{textAlign:"center"},{fontFamily: 'AbyssinicaSIL'}, {fontSize: 13}]}>By tapping Create Account or Sign In, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookies Policy.</Text></View>

            <View style={tw`mx-4 mb-4`}>
            <View style={styles.buttonView}>
                <Pressable
                    onPress={() => navigation.navigate("SignUp")}
                    android_ripple={{ color: '#FCA2CF', borderless: true }}
                    style={styles.loginButton}>
                    <Text style={styles.buttonText}>Create Account</Text>
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
export default SignInScreen
