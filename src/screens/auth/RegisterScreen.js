import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {STATUSBAR_HEIGHT, OS_IOS} from 'Wook_Market/src/lib/Constants';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {registerUser} from 'Wook_Market/src/lib/authentication';
import {
  handleRegisterError,
  handleRegisterLocalInputError,
} from 'Wook_Market/src/lib/util';
import {ERROR_MESSAGES} from 'Wook_Market/src/lib/Constants';
import dash from 'lodash';

const EMAIL = require('Wook_Market/src/assets/icons/email_icon.png');
const PASSWORD = require('Wook_Market/src/assets/icons/password_icon.png');
const EYE = require('Wook_Market/src/assets/icons/eye_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const PERSON = require('Wook_Market/src/assets/icons/person_icon.png');
const PHONE = require('Wook_Market/src/assets/icons/phone_icon.png');
const LOGO = require('Wook_Market/src/assets/images/app_icon.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
const EYE_CLOSED = require('Wook_Market/src/assets/icons/opened_eye_icon.png');
const BACK = require('Wook_Market/src/assets/icons/back_icon.png');

class RegisterScreen extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    showPassword: false,
    loading: false,
    enabled: true,
    error: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  };

  onSuccess() {
    Analytics.event('inscription_succes');
    this.props.navigation.replace('Main');
    this.setState({
      ...this.state,
      enabled: true,
      loading: false,
    });
  }

  onError(error) {
    Analytics.event('inscription_echec');
    this.setState({
      ...this.state,
      error: handleRegisterError(error),
      enabled: true,
      loading: false,
    });
  }

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...prevState.error, [key]: ''},
      }));
    }
  }

  emptyError = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  regidterUser = async () => {
    const error = handleRegisterLocalInputError({
      lastName: this.state.lastName,
      firstName: this.state.firstName,
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone,
    });
    if (!dash.isEqual(error, this.emptyError)) {
      Analytics.event('inscription_echec');
      this.setState({
        ...this.state,
        error: error,
      });

      return;
    }
    this.setState({...this.state, enabled: false, loading: true});
    await registerUser(
      (error) => this.onError(error),
      () => this.onSuccess(),
      {
        email: this.state.email,
        password: this.state.password,
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        phone: this.state.phone,
      },
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={OS_IOS ? 'padding' : null}
        style={{marginTop: -STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT}}>
        <SafeAreaView style={{height: '100%'}}>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
            bounces={false}
            style={{backgroundColor: 'white', overflow: 'scroll'}}>
            <Image
              style={{position: 'absolute', width: '100%'}}
              source={HEADER}
            />
            <Image
              style={{position: 'absolute', bottom: 0, width: '100%'}}
              source={FOOTER}
            />
            <View style={$.containerOneStyle}>
              {false && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.props.navigation.replace('Main')}
                  style={{alignSelf: 'flex-end'}}>
                  <View style={$.skipContainerStyle}>
                    <Text>{_('login.skip')}</Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={$.backContainerStyle}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.pop()}>
                <View>
                  <Image source={BACK} />
                </View>
              </TouchableOpacity>

              <Image
                source={LOGO}
                style={{
                  alignSelf: 'center',
                  marginTop: 30,
                  width: 140,
                  height: 140,
                }}
              />
              <Text style={$.registerTextStyle}>{_('login.register')} </Text>
              <TextField
                selectionColor={colors.ORANGE}
                autoCorrect={false}
                autoCapitalize="none"
                containerStyle={$.TextFeildStyleOne}
                leftIcon={PERSON}
                value={this.state.firstName}
                placeholder={_('login.firstName')}
                error={this.state.error.firstName}
                onChangeText={(value) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    firstName: value,
                  }));
                  this.resetError('firstName', value.length);
                }}
                onSubmitEditing={() => {
                  this.secondTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                autoCorrect={false}
                autoCapitalize="none"
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={PERSON}
                value={this.state.lastName}
                placeholder={_('login.lastName')}
                error={this.state.error.lastName}
                onChangeText={(value) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    lastName: value,
                  }));
                  this.resetError('lastName', value.length);
                }}
                cref={(input) => {
                  this.secondTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.thirdTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={EMAIL}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={_('login.email')}
                value={this.state.email}
                error={this.state.error.email}
                onChangeText={(value) => {
                  this.setState((prevState) => ({...prevState, email: value}));
                  this.resetError('email', value.length);
                }}
                cref={(input) => {
                  this.thirdTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.fourthTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={PASSWORD}
                autoCapitalize="none"
                rightIcon={this.state.showPassword ? EYE_CLOSED : EYE}
                type="password"
                rightIconPress={(e) =>
                  this.setState({showPassword: !this.state.showPassword})
                }
                secureTextEntry={!this.state.showPassword}
                placeholder={_('login.password')}
                error={this.state.error.password}
                value={this.state.password}
                onChangeText={(value) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    password: value,
                  }));
                  this.resetError('password', value.length);
                }}
                cref={(input) => {
                  this.fourthTextInput = input;
                }}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.fifthTextInput.focus();
                }}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={PHONE}
                keyboardType="phone-pad"
                value={this.state.phone}
                placeholder={_('login.phone')}
                error={this.state.error.phone}
                onChangeText={(value) => {
                  this.setState((prevState) => ({...prevState, phone: value}));
                  this.resetError('phone', value.length);
                }}
                cref={(input) => {
                  this.fifthTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.regidterUser();
                }}
                returnKeyType="go"
              />
            </View>
            <View style={$.containerTwoStyle}>
              <View style={$.connectTextStyle}>
                <Text style={$.haveAccountStyle}>{_('login.haveAccount')}</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.props.navigation.pop()}>
                  <Text style={{color: colors.ORANGE}}>
                    {_('login.connect')}
                  </Text>
                </TouchableOpacity>
              </View>
              <GenericButton
                style={$.buttonStyle}
                text={_('login.signup')}
                enabled={this.state.enabled}
                loading={this.state.loading}
                onPress={() => this.regidterUser()}
              />
              <Text
                onPress={() => this.props.navigation.navigate('TermsOfUse')}
                style={$.textStyleOne}>
                {_('login.termesOfUseTextOne')}{' '}
                <Text style={{color: colors.ORANGE}}>
                  {_('login.termsOfUseTextTwo')}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const $ = StyleSheet.create({
  skipContainerStyle: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: 'white',
  },
  containerOneStyle: {
    paddingHorizontal: 25,
    paddingTop: STATUSBAR_HEIGHT + 8,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-start',
  },
  containerTwoStyle: {
    paddingHorizontal: 25,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 60,
  },
  registerTextStyle: {
    alignSelf: 'center',
    fontSize: 24,
    marginTop: 30,
  },
  TextFeildStyleOne: {
    marginTop: 30,
  },
  TextFeildStyleTwo: {
    marginTop: 20,
  },
  haveAccountStyle: {
    marginEnd: 8,
  },
  connectTextStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 16,
  },
  buttonStyle: {
    backgroundColor: colors.ORANGE,
  },
  textStyleOne: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
  },

  backContainerStyle: {
    width: 36,
    height: 36,
    borderRadius: 3,
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    shadowColor: colors.LIGHT_GRAY,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegisterScreen;
