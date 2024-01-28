import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo } from "@expo/vector-icons"
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import Storage from '../services/Storage'

const ModalScreen = () => {

    const [image, setImage] = useState('');
    const [fullName, setFullName] = useState('');
    const [profileCreated, setProfileCreated] = useState(false);
    const [profileId, setProfileId] = useState(null);

    const [biography, setBiography] = useState(null);
    const [age, setAge] = useState(null);
    const [job, setJob] = useState(null);
    const [location, setLocation] = useState(null);
    const [email, setEmail] = useState(null);
    const [role, setRole] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const incompleteForm = !image || !biography || !age || !job || !location || !email;
    const creatProfile = async() => {
        let profileData = {
            image: image,
            biography: biography,
            age: age,
            job: job,
            location: location,
            email: email,
            uid: loggedInUser.id,
            role: role,
            displayName: fullName,
        }

        console.log('profile', profileData);

        try {
            // const docRef = await addDoc(collection(db, "profile"), profileData);
            await setDoc(doc(db, "profile", profileId), profileData);

            // if(docRef.id){
                alert("Profiel Updated");
            // }else {
            //     alert("Error occurred while Updating profile. Please try again");
            // }

            // console.log("Profile with role created: ", docRef.id);
          } catch (e) {
            console.error("Error creating the profile: ", e);
            alert("Error occurred while Updating profile. Please try again");
          }
    }

    const fetchDocs = async ()=> {
        // console.log('uid ',loggedInUser.id);
        let user = await Storage.getData();
        user = JSON.parse(user);
        const q = query(collection(db, "profile"), where("uid", "==", user.id), limit(1));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id," => ", doc.data());
          let profileData = doc.data()
          setProfileCreated(true);
          setProfileId(doc.id);
          setAge(profileData.age)
          setJob(profileData.job)
          setLocation(profileData.location)
          setBiography(profileData.biography)
          setRole(profileData.role)

        });
    }

    const getLoggedInUser = async () => {
        try {
            let user = await Storage.getData();
            user = JSON.parse(user);
            setLoggedInUser(user);
            setFullName(user.displayName);
            setImage(user.photoURL);
        }catch(e) {
            alert(e);
        }

    }

    useEffect(()=>{
        getLoggedInUser();
        fetchDocs();

    }, []);

    return (
        <LinearGradient colors={["#D9D9D9", "#D9D9D9", "#D9D9D9", "#B684EF"]} style={tw`flex-1 `}>
            <View style={tw`flex-1 pt-5 items-center`}>
                <Image
                    style={tw`h-20 w-30 my-1 left-4`}
                    source={require("../Images/Heart.png")}
                />
                <Text style={[{ fontFamily: 'Caveat-Bold' }, { fontSize: 24 }]}>SwiPet</Text>

                <Text style={[{ fontFamily: 'PlusJakartaSans-Bold' }, { color: "#B684EF" }, { fontSize: 24 }]}> Welcome To SwiPet </Text>
                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 1: The Profile Picture</Text>
                <TextInput 
                value ={image}
                onChangeText={text=> setImage(text)}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Enter a Profile Picture URL" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 2: Biography</Text>
                <TextInput 
                value={biography}
                onChangeText={text=> setBiography(text)}
                maxLength={100}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Tell us about you" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 3: Age</Text>
                <TextInput 
                value={age}
                onChangeText={text=> setAge(text)}
                keyboardType="numeric"
                maxLength={2}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Enter your age" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 4: Job Description</Text>
                <TextInput 
                value={job}
                onChangeText={text=>setJob(text)}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Tell us what you do" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 5: Location</Text>
                <TextInput
                value={location}
                onChangeText={text=>setLocation(text)}
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Enter residential area" />

                <Text style={[tw`text-center p-4`, { fontFamily: "SF-Pro-Medium" }, { fontWeight: 700 }]}>Step 6: E-mail</Text>
                <TextInput
                value={email}
                onChangeText={text=>setEmail(text)} 
                maxLength={30}
                style={[tw`text-center pb-2 w-60%`, { fontFamily: "SF-Pro-Medium" }]} placeholder="Provide us your contact email" />

                <View style={tw`left-37`}>

                    <TouchableOpacity style={[tw`elevation-8 items-center justify-center rounded-full w-13 h-13 bg-[#FCA2CF] border-solid border-b-4 border-r-2`,
                        incompleteForm ? tw`bg-gray-400` : tw`bg-[#FCA2CF]`,
                    ]}
                        disabled={incompleteForm}
                        onPress={() => {
                            creatProfile();
                        }}>
                        <Entypo name="check" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    )
}

export default ModalScreen