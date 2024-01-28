import { View, Text, ImageBackground, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import Storage from '../services/Storage'
import tw from 'twrnc';
import useAuth from '../hooks/useAuth';


const LoginScreen = () => {

  const navigation = useNavigation();

  const {user} = useAuth();

  const handleGetStarted = async () => {
    // let user = await Storage.getData();
    // user = JSON.parse(user);
    // if (user) {
    //   if(user.role == "petowner"){
    //   navigation.navigate("OwnerHome");
    //   }else {
    //     navigation.navigate("Home");
    //   }
    // } else {
      navigation.navigate("Sign");
    // }
  };

  return (
    <LinearGradient colors={["#D9D9D9", "#D9D9D9", "#D9D9D9", "#B684EF"]} style={tw`flex-1`}>
      <View style={tw`flex-1`}>
       <View style={styles.circleBackground}>
          <ImageBackground
            source={require('../Images/Doggo.png')}
            style={styles.dogImage} />
          <View style={tw`items-center`}>
            <Text style={styles.promoText}>Love Your Perfect Pet</Text></View>
            <View style={tw`flex-row pl-10`}>
            <View style={styles.buttonContainer}>
            <Image source={require('../Images/Swipe.png')}
            
            style={{width: 130,
              height: 70}}/></View>

            {/* <View style={styles.swipeView}><Text style={[{ fontFamily: 'PlusJakartaSans-Bold' }, { color: "white" }, { fontSize: 16 }]}>Swipe</Text></View> */}
              <Text style={styles.promoText}>  and adopt</Text></View>
            
          
          <ImageBackground />

          
          <View style={styles.buttonView}>
            <Pressable
              onPress={handleGetStarted}
              android_ripple={{ color: '#FCA2CF', borderless: true }}
              style={styles.loginButton}>
              <Text style={styles.swiPetText}>Get Started</Text>
            </Pressable>
          </View>
        </View>
      </View>

    </LinearGradient>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  circleBackground: {
    width: 343,
    height: 343,
    backgroundColor: '#B684EF',
    borderRadius: 171.5,
    top: 115,
    left: 25,
  },

  dogImage: {
    width: 292.47,
    height: 387.4,
    left: 25,
    top: 20,
  },

  promoText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    marginTop: 5
  },

  swiPetText: {
    fontFamily: 'SF-Pro-Medium',
    fontSize: 15,
    fontWeight: "600",
  },

  buttonView: {
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "black",
    elevation: 5,
  },

  swipeView: {
    width: 109,
    height: 39.5,
    borderWidth:2,
    borderRadius: 29.26,
    borderColor:"black",
    backgroundColor: '#B684EF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingBottom: 5,
    transform: [{ rotate: '-9.3deg' }],
  },
  
  loginButton: {
    height: 54,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },

  buttonContainer: {
    marginBottom:75,
    height: 70,
    
  }
});
