import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Text,
  SafeAreaView,
  Linking,
} from 'react-native';
import {
  DrawerContentScrollView,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import CustomDrawerItem from 'Wook_Market/src/components/CustomDrawerItem';
import {removeToken, getToken} from 'Wook_Market/src/lib/authentication';
import {getUser} from 'Wook_Market/src/lib/user';

import {removeUser, logout} from 'Wook_Market/src/lib/user';
import {removeOrdersFromCache} from 'Wook_Market/src/lib/order';
import {_} from 'Wook_Market/src/lang/i18n';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';

const LOGO = require('Wook_Market/src/assets/images/app_icon.png');
const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');
const PERSON = require('Wook_Market/src/assets/icons/person_icon.png');
const CREDIT_CARD = require('Wook_Market/src/assets/icons/credit_card_icon.png');
const LOCATION = require('Wook_Market/src/assets/icons/location_icon.png');
const BAG = require('Wook_Market/src/assets/icons/bag_icon.png');
const POWER = require('Wook_Market/src/assets/icons/power_icon.png');
const INFO = require('Wook_Market/src/assets/icons/info_icon.png');
const LOGOUT = require('Wook_Market/src/assets/icons/icn_loggin_app.png');
const PAY_AND_GO = require('Wook_Market/src/assets/icons/icn_pay_and_go.png');

const APP_STORE = require('Wook_Market/src/assets/icons/btn_app_store.png');
const PLAY_STORE = require('Wook_Market/src/assets/icons/btn_google_play.png');

const CustomDrawerContent = (props) => {
  const [isConnected, setIsCnnected] = useState(getTokenFromStorage());

  const [isPro, setIsPro] = useState(false);

  const navigation = props.navigation;
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    navigation.addListener('focus', () => {
      getTokenFromStorage();
      getUserRoleFromStorage();
    });
  }, [navigation]);

  async function getTokenFromStorage() {
    const token = await getToken();
    if (token === null) {
      setIsCnnected(false);
      return true;
    } else {
      setIsCnnected(true);
      return false;
    }
  }

  async function getUserRoleFromStorage() {
    const user = JSON.parse(await getUser());
    if (user === null) {
      setIsPro(false);
    } else {
      setIsPro(user.role == 'pro');
    }
  }

  const closeDrawerThenNavigateTo = (destination) => {
    if (destination == 'Profil') {
      Analytics.event('mon_profil_ouverture_ecran');
    }

    if (destination == 'Orders') {
      Analytics.event('mes_commandes_ouverture_ecran');
    }

    if (destination == 'PayAndGo') {
      Analytics.event('pay_and_go_ouverture_ecran');
    }

    navigation.closeDrawer();
    navigation.navigate(destination);
  };

  const renderSeparator = (
    marginBottomValue,
    marginTopValue,
    marginLeftValue,
    marginRightValue,
  ) => (
    <View
      style={[
        $.containerOneStyle,
        {
          marginBottom: marginBottomValue,
          marginTop: marginTopValue,
          marginLeft: marginLeftValue,
          marginRight: marginRightValue,
        },
      ]}
    />
  );

  const showDrawerItems = () => {
    return (
      <View>
        <CustomDrawerItem
          label={_('main.myProfile')}
          icon={PERSON}
          onPress={() => closeDrawerThenNavigateTo('Profil')}
        />
        <CustomDrawerItem
          label={_('main.paymentMethod')}
          icon={CREDIT_CARD}
          onPress={() => closeDrawerThenNavigateTo('PaymentMethod')}
        />
        <CustomDrawerItem
          label={_('main.delevryAddress')}
          icon={LOCATION}
          onPress={() => closeDrawerThenNavigateTo('DeliveryAddress')}
        />

        {!isPro && (
          <CustomDrawerItem
            label={_('main.payAndGo')}
            icon={PAY_AND_GO}
            labelStyle={{fontSize: 16, fontWeight: 'bold'}}
            onPress={() => closeDrawerThenNavigateTo('PayAndGo')}
          />
        )}
        <CustomDrawerItem
          label={_('main.logout')}
          icon={LOGOUT}
          style={{paddingHorizontal: 13, paddingVertical: 10}}
          labelStyle={{color: colors.RED, marginLeft: 10}}
          containerStyle={{marginTop: 22}}
          onPress={async () => {
            //logout
            Analytics.event('logout');

            await logout();
            navigation.closeDrawer();
          }}
        />
      </View>
    );
  };

  const hideDrawerItems = () => {
    return (
      <CustomDrawerItem
        label={_('main.login')}
        icon={POWER}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('LoginFromMain');
        }}
      />
    );
  };

  return (
    <SafeAreaView style={$.containerTwoStyle}>
      <View style={{flex: 1}}>
        <StatusBar
          barStyle={isDrawerOpen ? 'dark-content' : 'light-content'}
          translucent
          backgroundColor="transparent"
        />
        <DrawerContentScrollView {...props}>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
              }}
              activeOpacity={0.6}
              style={$.containerThreeStyle}>
              <Image source={CLOSE} />
            </TouchableOpacity>
            <Image source={LOGO} style={$.imageOneStyle} />
            {renderSeparator(8)}
          </View>
          {isConnected ? showDrawerItems() : hideDrawerItems()}
        </DrawerContentScrollView>
        <View style={{marginTop: 'auto'}}>
          <Text style={$.joinUs}>
            {'Besoin d’un job/service?' + '\n'}
            <Text>
              Rejoignez nous sur l’application
              <Text style={{fontWeight: 'bold'}}>{' WOOK!'}</Text>
            </Text>
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            {!OS_IOS && (
              <TouchableOpacity
                activeOpacity={0.6}
                style={$.buttonContainer}
                onPress={() => {
                  navigation.closeDrawer();
                  if (OS_IOS) {
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.dzmob.services88',
                    );
                  } else {
                    Linking.openURL('market://details?id=com.dzmob.services88');
                  }
                }}>
                <View style={$.containerFiveStyle}>
                  <Image source={PLAY_STORE} />
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.6}
              style={$.buttonContainer}
              onPress={() => {
                if (OS_IOS) {
                  //Linking.openURL("itms://itunes.apple.com/us/app/apple-store/id1546379679?mt=8");
                  Linking.openURL(
                    'https://apps.apple.com/fr/app/wook/id1546379679',
                  );
                } else {
                  Linking.openURL(
                    'https://apps.apple.com/fr/app/wook/id1546379679',
                  );
                }
              }}>
              <View style={$.containerFiveStyle}>
                <Image source={APP_STORE} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          style={$.containerFourStyle}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Auth', {screen: 'TermsOfUse'});
          }}>
          {renderSeparator(12)}
          <View style={$.containerFiveStyle}>
            <Image source={INFO} />
            <Text style={$.textOneStyle}>{_('login.TermsOfUseDrawer')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    borderBottomColor: colors.GRAY_VARIANT,
    borderBottomWidth: 0.6,
  },
  containerTwoStyle: {height: '100%'},
  containerThreeStyle: {
    alignSelf: 'flex-end',
    marginEnd: 24,
    marginTop: 4,
    padding: 8,
    backgroundColor: colors.CLOSE_BUTTON_BACKGROUND_COLOR,
    borderRadius: 100,
  },
  imageOneStyle: {
    alignSelf: 'center',
    marginBottom: 0,
    width: 140,
    height: 140,
  },
  containerFourStyle: {marginTop: 'auto'},
  containerFiveStyle: {
    flexDirection: 'row',
    marginBottom: 12,
    marginLeft: 12,
  },
  textOneStyle: {
    alignSelf: 'center',
    marginLeft: 4,
    color: colors.LIGHT_BLUE,
  },

  joinUs: {
    textAlign: 'center',
    marginHorizontal: 12,
    color: '#5C5C5C',
    fontSize: 12,
  },

  buttonContainer: {
    marginTop: 8,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default CustomDrawerContent;
