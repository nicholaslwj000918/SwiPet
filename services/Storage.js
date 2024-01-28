import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
    static storeData = async (value) => {
        console.log('value', value)
        try {
          const jsonValue = JSON.stringify(value);
          console.log('jsonValue', jsonValue)
          await AsyncStorage.setItem('user', jsonValue);
          return true;
        } catch (e) {
          // saving error
          return false;
        }
      };

      static getData = async () => {
        try {
          const value = await AsyncStorage.getItem('user');
          console.log('value', value);
          if (value !== null) {
            return JSON.parse(value);
          }else {
            return null;
          }
        } catch (e) {
          // error reading value
          console.log('exception: ',e);
          return null;
        }
      };


      static logout = async () => {
        try {
          await AsyncStorage.removeItem('user');
          return true;
        } catch (e) {
          console.log('exception: ',e);
          return false;
        }
      };

      static getUserId = async () => {
        let user = await this.getData();
        if(user){
          return user.id;
        }else {
          return false;
        }
      }
      
      
}

export default Storage;