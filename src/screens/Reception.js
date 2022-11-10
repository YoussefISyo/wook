import React from 'react';
import {View, StatusBar, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {ALREADY_OPEN} from 'Wook_Market/src/lib/Constants';
import SplashScreen from 'react-native-splash-screen';
import Analytics from 'Wook_Market/src/lib/analytics';
//import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';

const SPLASH_IMAGE = require('Wook_Market/src/assets/images/splash_screen.png');

class Reception extends React.Component {
  loadFirstScreen = async (navigation) => {
    const isAuthenticated = await getToken();
    const alreadyOpen = await AsyncStorage.getItem(ALREADY_OPEN);
    console.log(isAuthenticated);
    if (!alreadyOpen) {
      return navigation.replace('TutorialStack');
    } else {
      if (isAuthenticated !== null) {
        navigation.replace('Main');
      } else navigation.replace('Auth');
    }
  };

  componentDidMount() {
    console.log('adds');
    console.log('DeviceInfo', DeviceInfo.getVersion());
    if (Platform.OS === 'ios') SplashScreen.hide();

    /*const updateConfig = RemoteConfigService.getRemoteValue('APP_UPDATE')?.asBoolean()
    //this.setState({region: regionConfig})
    console.log("updateConfig", updateConfig)
    if(updateConfig==true){
      /*Alert.alert('', _('login.networkError'), [
        {
          text: _('main.ok'),
        },
      ]);*/

    //}

    this.loadFirstScreen(this.props.navigation);
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') SplashScreen.hide();
    SplashScreen.hide();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
      </View>
    );
  }
}

export const setAlreadyOpen = async () => {
  AsyncStorage.setItem(ALREADY_OPEN, 'true');
};

export default Reception;
