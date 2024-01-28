import * as React from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';
import LoadingScreen from './screens/LoadingScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      loading: true, 
    };
  }
  async loadFonts() {
    await Font.loadAsync({
      'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
      'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
      'SF-Pro': require('./assets/fonts/SFProText-Regular.ttf'),
      'SF-Pro-Medium': require('./assets/fonts/SFProText-Medium.ttf'),
      'Caveat-Bold': require('./assets/fonts/Caveat-Bold.ttf'),
      'AbyssinicaSIL' : require('./assets/fonts/AbyssinicaSIL-Regular.ttf')
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();

    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  render() {
    const { fontsLoaded, loading } = this.state;

    if (fontsLoaded) {
      if (loading) {
        return (
          <LoadingScreen />
        );
      }

      return (
        <NavigationContainer>
          <AuthProvider>
            <StackNavigator/>
          </AuthProvider>
        </NavigationContainer>
      );
    } else {
      return null;
    }
  }
}
