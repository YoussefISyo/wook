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
  Alert,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {STATUSBAR_HEIGHT, OS_IOS} from 'Wook_Market/src/lib/Constants';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {loginUser} from 'Wook_Market/src/lib/authentication';
import {
  handleRegisterError,
  handleLoginLocalInputError,
} from 'Wook_Market/src/lib/util';
import {ERROR_MESSAGES} from 'Wook_Market/src/lib/Constants';
import dash from 'lodash';

const EMAIL = require('Wook_Market/src/assets/icons/email_icon.png');
const PASSWORD = require('Wook_Market/src/assets/icons/password_icon.png');
const EYE = require('Wook_Market/src/assets/icons/eye_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
const LOGO = require('Wook_Market/src/assets/images/app_icon.png');
const EYE_CLOSED = require('Wook_Market/src/assets/icons/opened_eye_icon.png');
const CLOSE = require('Wook_Market/src/assets/icons/close_drawer_icon.png');
const COMPANY = require('Wook_Market/src/assets/icons/icn_company.png');

class LoginFromMainScreen extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    loading: false,
    enabled: true,
    error: {
      email: '',
      password: '',
      alertError: '',
      invalideData: false,
    },
  };

  onSuccess() {
    Analytics.event('login_success');

    this.props.navigation.replace('Main');
    this.setState({
      ...this.state,
      enabled: true,
      loading: false,
    });
  }

  onError(error) {
    this.setState({
      ...this.state,
      error: handleRegisterError(error),
      enabled: true,
      loading: false,
    });
  }

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState({
        ...this.state,
        error: {...this.state.error, [key]: ''},
      });
    }
  }

  mapErrorToMessage() {
    if (this.state.error.invalideData) {
      return _('login.unauthorizedError');
    }
  }

  createAlert = () => {
    Alert.alert(
      '',
      this.mapErrorToMessage(),
      [
        {
          text: _('login.close'),
          onPress: () =>
            this.setState({
              ...this.state,
              error: {...this.state.error, alertError: '', invalideData: false},
            }),
        },
      ],
      {cancelable: false},
    );
  };

  emptyError = {
    email: '',
    password: '',
    alertError: '',
    invalideData: false,
  };

  loginUser = () => {
    const error = handleLoginLocalInputError(
      this.state.email,
      this.state.password,
    );
    if (!dash.isEqual(error, this.emptyError)) {
      this.setState({
        ...this.state,
        error,
      });
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      enabled: false,
      loading: true,
    }));
    loginUser(
      (error) => this.onError(error),
      () => this.onSuccess(),
      {email: this.state.email, password: this.state.password},
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={OS_IOS ? 'padding' : null}
        enabled
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
              //justifyContent: 'space-between',
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
              <TouchableOpacity
                style={$.backContainerStyle}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.pop()}>
                <View>
                  <Image source={CLOSE} />
                </View>
              </TouchableOpacity>
              <Image
                source={LOGO}
                style={{alignSelf: 'center', marginTop: 30}}
              />
              <Text style={$.connexionTextStyle}>{_('login.connexion')}</Text>
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.emailTextFeildStyle}
                leftIcon={EMAIL}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.email}
                placeholder={_('login.email')}
                error={this.state.error.email}
                onChangeText={(value) => {
                  this.setState((prevState) => ({...prevState, email: value}));
                  this.resetError('email', value.length);
                }}
                onSubmitEditing={() => {
                  this.secondTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.passwordTextFeildStyle}
                autoCapitalize="none"
                leftIcon={PASSWORD}
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
                  this.secondTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.loginUser();
                }}
                returnKeyType="go"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                style={$.touchableStyle}
                onPress={() =>
                  this.props.navigation.navigate('Auth', {
                    screen: 'ResetPassword',
                  })
                }>
                <Text style={$.forgetPasswordTextStyle}>
                  {_('login.forgetPassword')}
                </Text>
              </TouchableOpacity>
            </View>

            

            <View style={$.containerTwoStyle}>
              
              <GenericButton
                style={$.buttonStyle}
                enabled={this.state.enabled}
                loading={this.state.loading}
                text={_('login.connect')}
                onPress={() => {
                  this.loginUser();
                }}
              />
              {this.state.error.alertError !== '' ? this.createAlert() : null}

              <View style={$.signupTextStyle}>
                <Text style={$.haveAccountStyle}>
                  {_('login.notHaveAccount')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {Analytics.event('inscription_ouverture'); this.props.navigation.navigate('RegisterFromMain');}}>
                  <Text style={{color: colors.ORANGE, textDecorationLine: "underline"}} >
                    {_('login.signup')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            <View style={$.containerThreeStyle}>

                <View style={{backgroundColor: "#F8F8F8", paddingHorizontal: 20, paddingVertical: 8, alignContent: "center", justifyContent: "center", flexDirection: "row"}}>
                  <Image source={COMPANY} resizeMode="contain" style={{alignSelf: "center"}}></Image>
                  <Text style={$.isCompany}>
                    {_('login.isCompany')}
                  </Text>
                </View>
              <View style={$.signupTextStylePro}>
                
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {Analytics.event('inscription_ouverture'); this.props.navigation.navigate('RegisterProFromMain');}}>
                  <Text style={{color: colors.ORANGE, textDecorationLine: "underline"}} >
                    {_('login.registerAsPro')}
                  </Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 24,
    paddingTop: STATUSBAR_HEIGHT + 8,
    backgroundColor: 'transparent',
  },
  containerTwoStyle: {
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    marginTop: 26,
  },

  containerThreeStyle: {
    backgroundColor: 'transparent',
    marginTop: 28,
  },

  connexionTextStyle: {
    alignSelf: 'center',
    fontSize: 24,
    marginTop: 30,
  },
  emailTextFeildStyle: {
    marginTop: 30,
  },
  passwordTextFeildStyle: {
    marginTop: 20,
  },
  forgetPasswordTextStyle: {
    color: colors.ORANGE,
    alignSelf: 'flex-end',
  },
  touchableStyle: {
    marginTop: 12,
    padding: 8,
    alignSelf: 'flex-end',
  },
  haveAccountStyle: {
    marginEnd: 8,
  },
  isCompany: {
    textAlign: "center",
    fontSize: 14,
    color: "#595959",
    alignSelf: "center",
    marginLeft: 8
  },
  signupTextStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 24,
  },

  signupTextStylePro: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 8,
  },
  buttonStyle: {
    backgroundColor: colors.ORANGE,
  },
});

export default LoginFromMainScreen;
