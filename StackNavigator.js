import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import useAuth from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import SignInScreen from './screens/SignInScreen';
import ProfileScreen from './screens/ProfileScreen';
import ModalScreen from './screens/ModalScreen';
import SignUpScreen from './screens/SignUpScreen';
import Storage from './services/Storage';
import CreatePetProfile from './screens/CreatePetProfile';
import PetOwnerNotificationsScreen from './screens/PetOnwerNotificationScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ConversationScreen from './screens/ConversationScreen';
import PetOwnerHomeScreen from './screens/PetOwnerHomeScreen';
import PetAdopterNotificationsScreen from './screens/PetAdopterNotificationScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  useEffect(async() =>{

  });
  return (
    <Stack.Navigator>
        {/* {user?( */}
        {/* <> */}
        {/* {Storage.getData() == null ? 
        <> */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        {/* </> : (
          <> */}
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="OwnerHome" component={PetOwnerHomeScreen} options={{headerShown: false}}/>

        <Stack.Screen name="Sign" component={SignInScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>


        <Stack.Group screenOptions = {{presentation: 'modal'}}>
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="ConversationScreen" component={ConversationScreen}/>
        <Stack.Screen name="PetOwnerNotifications" component={PetOwnerNotificationsScreen} options={{headerShown: true, title: "Notifications"}}/>
        <Stack.Screen name="PetAdopterNotificationScreen" component={PetAdopterNotificationsScreen} options={{headerShown: true, title: "Notifications"}}/>
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{headerShown: true}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Modal" component={ModalScreen} options={{headerShown: false}}/>
          <Stack.Screen name="CreatePet" component={CreatePetProfile} options={{headerShown: false}}/>
          
        </Stack.Group>
          {/* </> */}
        {/* ) */}
{/* } */}

       
        {/* </> */}
        {/* ) : ( */}
        {/* )} */}
    </Stack.Navigator>
  )
}

export default StackNavigator
