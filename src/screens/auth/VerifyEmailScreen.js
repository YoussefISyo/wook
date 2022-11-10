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
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {STATUSBAR_HEIGHT, OS_IOS} from 'Wook_Market/src/lib/Constants';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import VerificationCodeInput from 'Wook_Market/src/components/VerificationCodeInput';
import Timer from 'Wook_Market/src/components/Timer';
import NetInfo from '@react-native-community/netinfo';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const BACK = require('Wook_Market/src/assets/icons/back_icon.png');
const VERIFY_EMAIL = require('Wook_Market/src/assets/images/send_email_code_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
import {verifyCode} from 'Wook_Market/src/lib/authentication';
import {handleRegisterError} from 'Wook_Market/src/lib/util';
import {ERROR_MESSAGES} from 'Wook_Market/src/lib/Constants';
import {resetPassword} from 'Wook_Market/src/lib/authentication';

class VerifyEmailScreen extends Component {
  state = {
    enabled: false,
    loading: false,
    disabledOpacity: true,
    email: '',
    code: '',
    isError: false,
    error: {
      email: '',
      alertError: '',
      invalideCode: '',
    },
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      email: this.props.route.params.email,
    });
  };

  onVerifyCodeError = (error) => {
    this.setState({
      ...this.state,
      loading: false,
      enabled: false,
      disabledOpacity: true,
      isError: true,
      error: {
        ...this.error,
        alertError: '',
        invalideCode: error['code.invalid'],
      },
    });
  };

  onVerifyCodeSeccess = () => {
    this.setState({
      ...this.state,
      disabledOpacity: false,
      loading: false,
      enabled: true,
    });
    this.props.navigation.navigate('ChangePassword', {
      email: this.state.email,
    });
  };

  verifyCode = () => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        this.setState((prevState) => ({
          ...prevState,
          error: {
            ...this.state.error,
            alertError: ERROR_MESSAGES.NETWORK_ERROR,
          },
        }));
      } else {
        this.setState({
          ...this.state,
          disabledOpacity: false,
          loading: true,
          enabled: false,
        });
        verifyCode(
          {email: this.state.email, code: this.state.code},
          () => this.onVerifyCodeSeccess(),
          (error) => this.onVerifyCodeError(error),
        );
      }
    });
  };

  onValue = (value) => {
    if (value.length === 4) {
      this.setState((prevState) => ({
        ...prevState,
        code: value,
        disabledOpacity: false,
        loading: false,
        enabled: true,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        code: '',
        disabledOpacity: true,
        enabled: false,
      }));
    }
    if (this.state.isError) {
      this.setState((prevState) => ({
        ...prevState,
        isError: false,
        error: {...prevState.error, invalideCode: ''},
      }));
    }
  };

  onResendCodeError = (error) => {
    this.setState({
      ...this.state,
      error: handleRegisterError(error),
    });
  };

  resetPassword = (isConnected) => {
    if (!isConnected) {
      this.setState({
        ...this.state,
        error: {
          ...this.state.error,
          alertError: ERROR_MESSAGES.NETWORK_ERROR,
        },
      });
    } else {
      resetPassword(
        (error) => {
          this.onResendCodeError(error);
        },
        () => {},
        {email: this.state.email},
      );
    }
  };

  createAlert = () => {
    return Alert.alert(
      '',
      this.state.error.alertError === ERROR_MESSAGES.NETWORK_ERROR
        ? _('login.networkError')
        : _('login.serverError'),
      [
        {
          text: _('login.close'),
          onPress: () =>
            this.setState((prevState) => ({
              ...prevState,
              error: {...this.state.error, alertError: ''},
            })),
        },
      ],
      {cancelable: false},
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
              <TouchableOpacity
                style={$.backContainerStyle}
                activeOpacity={0.5}
                onPress={() => this.props.navigation.pop()}>
                <View>
                  <Image source={BACK} />
                </View>
              </TouchableOpacity>
              <Image
                source={VERIFY_EMAIL}
                style={{alignSelf: 'center', width: 260, height: 260}}
              />
              <Text style={$.textStyleOne}>{_('login.verifyEmail')}</Text>
              <Text style={$.textStyleTwo}>
                {_('login.verifyEmailDescription')}
              </Text>
              <VerificationCodeInput
                onValue={this.onValue}
                isError={this.state.isError}
              />
              {this.state.error.invalideCode === '' ? null : (
                <Text style={$.textStyleSix}>
                  {this.state.error.invalideCode}
                </Text>
              )}
            </View>
            <View style={$.containerTwoStyle}>
              <Timer resetPassword={this.resetPassword} />
              <GenericButton
                loading={this.state.loading}
                enabled={this.state.enabled}
                disabledOpacity={this.state.disabledOpacity}
                onPress={this.verifyCode}
                style={$.buttonStyle}
                text={_('login.verifyAndContinue')}
              />
              {this.state.error.alertError.length !== 0
                ? this.createAlert()
                : null}
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
    shadowColor: '#000',
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
  buttonStyle: {
    backgroundColor: colors.ORANGE,
  },
  textStyleSix: {marginTop: 8, color: 'red', alignSelf: 'center'},
});

export default VerifyEmailScreen;
