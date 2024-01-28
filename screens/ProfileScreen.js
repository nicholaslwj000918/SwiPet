import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native'
import {useEffect, useState} from 'react';
import tw from 'twrnc'
import { Entypo } from "@expo/vector-icons"
import { useNavigation, CommonActions } from '@react-navigation/native'
import {app, db, auth} from '../services/firebaseConfig';
import { collection, addDoc, query, where, limit, getDocs, setDoc, doc } from "firebase/firestore/lite"; 
import Storage from '../services/Storage';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState('');
    const [fullName, setFullName] = useState(null);
    const [profileCreated, setProfileCreated] = useState(false);
    const [profileId, setProfileId] = useState(null);

    const [biography, setBiography] = useState(null);
    const [age, setAge] = useState(null);
    const [job, setJob] = useState(null);
    const [location, setLocation] = useState(null);
    const [email, setEmail] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState({role: "petadopter"});

    const fetchDocs = async ()=> {
        let user = await Storage.getData();
        user = JSON.parse(user);
        setLoggedInUser(user);
        console.log('profile user', user.displayName);
        setImage(user.photoURL);
        setFullName(user.displayName);
        setEmail(user.email);
        const q = query(collection(db, "profile"), where("uid", "==", user.id), limit(1));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let profileData = doc.data()
          setProfileCreated(true);
          setProfileId(doc.id);
          setImage(profileData.image);
          setAge(profileData.age)
          setJob(profileData.job)
          setLocation(profileData.location)
          setBiography(profileData.biography)

        });
    }

    useEffect(async()=>{
        let user = await Storage.getData();
        user = JSON.parse(user);
        setLoggedInUser(user);
        fetchDocs();
    },[])

    return (
            <View style={tw`flex-1 pt-10 bg-[#FFFFFF]`}>
                <View style={tw`items-center pb-2`}>
                    <Text style={[{ fontFamily: "PlusJakartaSans-Regular" }, { fontSize: 17 }]}>PROFILE</Text>
                </View>


                <View style={tw`h-50 items-center bg-[#F9F3FE]`}>
                    <View style={tw`pt-3`}>

                        {/*Profile Picture*/}
                        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                            <View style={tw`h-23.5 w-23.5 left-3 rounded-full bg-[#B684EF]`}>
                                <Image style={tw`h-23 w-23 rounded-full`} source={{uri: image}} />
                            </View>
                        </TouchableOpacity>

                        <View style={tw`pl-1 pt-2 justify-center items-center`}>
                            <Text style={[{ fontFamily: 'SF-Pro-Medium' }, { fontSize: 14 }, { fontWeight: 500 }]}>{fullName}</Text>
                        </View>
                        {/*Edit Profile Button*/}
                        <View style={[styles.buttonView, tw`mt-3`]}>
                            <Pressable
                                android_ripple={{ color: '#FCA2CF', borderless: true }}
                                style={styles.loginButton}
                                onPress= {()=> navigation.navigate("Modal")}>
                                <View style={tw`flex-row`}>
                                    <Entypo name="edit" size={14} color="#000000" style={tw`m-1`} />
                                    <Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 14 }, { fontWeight: 600 }]}>Edit Profile</Text>
                                </View>

                            </Pressable>
                        </View>
                    </View>
                </View>

                {/*About Me*/}

                <View style={tw`h-26 p-6`}>
                    <Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 15 }, { fontWeight: 700 }]}>About me</Text>
                    <Text style={[{ fontFamily: "SF-Pro" }, tw`pt-1`, { fontSize: 14 }]}>{biography}</Text>
                </View>

                {/*Basic Info*/}

                
                <View style={tw`h-86 p-3`}>
                    <View style={tw`m-2`}><Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 15 }, { fontWeight: 700 }]}>Basic Info</Text></View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="clipboard" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{age} years old</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="suitcase" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{job}</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="location" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{location}</Text>
                    </View>
                    <View style={tw`flex-row pl-1 m-2`}>
                        <Entypo name="mail" size={17} color="#B684EF" style={tw`pr-3`} />
                        <Text style={[{ fontFamily: "SF-Pro" }, { fontSize: 14 }]}>{email}</Text>
                    </View>
                    <View>
                            <Pressable
                                android_ripple={{ color: '#FCA2CF', borderless: true }}
                                style={styles.logoutButton}
                                onPress= {async ()=> {
                                    await Storage.logout();
                                    navigation.dispatch(
                                        CommonActions.reset({
                                          index: 1,
                                          routes: [
                                            { name: 'Login' },
                                          ],
                                        })
                                      );
                                    
                                    }}>
                                <View style={tw`flex-row`}>
                                    <Entypo name="lock" size={14} color="#000000" style={tw`m-1`} />
                                    <Text style={[{ fontFamily: "SF-Pro-Medium" }, { fontSize: 14 }, { fontWeight: 600 }]}>Logout</Text>
                                </View>

                            </Pressable>
                        </View>

                </View>

                


                <View style={tw`flex flex-row w-full h-15 justify-center items-center bg-white absolute bottom-0`}>
                    <View style={tw`flex-row justify-evenly`}>
                        <Entypo style={tw`mx-8`} name="baidu" size={26} color="#a9a7b4" onPress={() => {
                            if(loggedInUser.role == "petowner"){
                                navigation.navigate("OwnerHome");
                            }else {
                                navigation.navigate("Home")

                            }
                            }} />
                        <Entypo style={tw`mx-8`} name="message" size={26} color="#a9a7b4" onPress={() => navigation.navigate("Chat")} />
          <Entypo style={tw`mx-8`} name="bell" size={26} color="#a9a7b4" onPress={() => {
                                        if(loggedInUser.role == "petowner"){
                                            navigation.navigate("PetOwnerNotifications");
                                        }else {
                                            navigation.navigate("PetAdopterNotificationScreen")
            
                                        }
          }} />
          {loggedInUser.role === "petowner" &&
          <Entypo style={tw`mx-8`} name="edit" size={26} color="#a9a7b4" onPress={() => navigation.navigate("CreatePet")} />
          }
                    </View>
                </View>
            </View>
    )
}

export default ProfileScreen

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
        width: 130,
        backgroundColor: '#FF69B4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },

    logoutButton: {
        height: 30,
        width: 120,
        border:1,
        backgroundColor: '#FF69B4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    }

})