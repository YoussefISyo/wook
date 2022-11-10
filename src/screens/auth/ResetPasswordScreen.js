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
import {resetPassword} from 'Wook_Market/src/lib/authentication';

const EMAIL = require('Wook_Market/src/assets/icons/email_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const BACK = require('Wook_Market/src/assets/icons/back_icon.png');
const FORGOT_PASSWORD = require('Wook_Market/src/assets/images/forgot_password_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
import {
  handleRegisterError,
  handleEmailLocalInputError,
} from 'Wook_Market/src/lib/util';
import dash from 'lodash';

class ResetPasswordScreen extends Component {
  state = {
    email: '',
    enabled: true,
    loading: false,
    error: {
      email: '',
    },
  };

  onError = (error) => {
    this.setState({
      ...this.state,
      error: handleRegisterError(error),
      enabled: true,
      loading: false,
    });
  };

  onSeccess = () => {
    Analytics.event('mot_de_passe_oublie_envoie');
    this.setState({
      ...this.state,
      enabled: true,
      loading: false,
    });
    this.props.navigation.navigate('VerifyEmail', {
      email: this.state.email,
    });
  };

  emptyError = {
    email: '',
  };

  resetPassword = () => {
    const error = handleEmailLocalInputError(this.state.email);
    if (!dash.isEqual(error, this.emptyError)) {
      this.setState({
        ...this.state,
        error: error,
      });
      return;
    }
    this.setState({...this.state, enabled: false, loading: true});
    resetPassword(
      (error) => {
        this.onError(error);
      },
      () => this.onSeccess(),
      {email: this.state.email},
    );
  };

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...prevState.error, [key]: ''},
      }));
    }
  }

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
              <TouchableOpacity
                style={$.backContainerStyle}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.pop()}>
                <View>
                  <Image source={BACK} />
                </View>
              </TouchableOpacity>
              <Image
                source={FORGOT_PASSWORD}
                style={{alignSelf: 'center', width: 260, height: 260}}
              />
              <Text style={$.textStyleOne}>{_('login.forgetPasswordOne')}</Text>
              <Text style={$.textStyleTwo}>
                {_('login.forgetPasswordOneDescription')}
              </Text>
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleOne}
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
                onSubmitEditing={() => {
                  this.resetPassword();
                }}
                returnKeyType="go"
              />
            </View>
            <View style={$.containerTwoStyle}>
              <GenericButton
                loading={this.state.loading}
                enabled={this.state.enabled}
                style={$.buttonStyle}
                text={_('login.sendEmail')}
                onPress={() => this.resetPassword()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const $ = StyleSheet.create({
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
  containerOneStyle: {
    paddingHorizontal: 25,
    paddingTop: STATUSBAR_HEIGHT + 8,
    backgroundColor: 'transparent',
    paddingBottom: 24,
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
  textStyleOne: {
    alignSelf: 'center',
    fontSize: 24,
  },
  textStyleTwo: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: colors.LIGHT_GRAY,
  },
  TextFeildStyleOne: {
    marginTop: 30,
    marginBottom: 40,
  },
  buttonStyle: {
    backgroundColor: colors.ORANGE,
  },
});

export default ResetPasswordScreen;
