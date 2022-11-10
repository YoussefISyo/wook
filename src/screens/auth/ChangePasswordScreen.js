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
import {updatePassword} from 'Wook_Market/src/lib/authentication';
import {
  handleRegisterError,
  handlePasswordLocalInputError,
} from 'Wook_Market/src/lib/util';
import {ERROR_MESSAGES} from 'Wook_Market/src/lib/Constants';
import dash from 'lodash';

const PASSWORD = require('Wook_Market/src/assets/icons/password_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const BACK = require('Wook_Market/src/assets/icons/back_icon.png');
const CHANGE_PASSWORD = require('Wook_Market/src/assets/images/change_password_image.png');
const EYE = require('Wook_Market/src/assets/icons/eye_icon.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
const EYE_CLOSED = require('Wook_Market/src/assets/icons/opened_eye_icon.png');
class ChangePasswordScreen extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    enabled: true,
    loading: false,
    error: {
      password: '',
    },
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      email: this.props.route.params.email,
    });
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
    this.setState({
      ...this.state,
      enabled: true,
      loading: false,
    });
    this.props.navigation.replace('Auth');
  };

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...prevState.error, [key]: ''},
      }));
    }
  }

  emptyError = {
    password: '',
  };

  updatePassword = () => {
    const error = handlePasswordLocalInputError(this.state.password);
    if (!dash.isEqual(error, this.emptyError)) {
      this.setState({
        ...this.state,
        error: error,
      });
      return;
    }
    this.setState({...this.state, enabled: false, loading: true});
    updatePassword(
      {email: this.state.email, password: this.state.password},
      () => this.onSeccess(),
      (error) => this.onError(error),
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
                source={CHANGE_PASSWORD}
                style={{alignSelf: 'center', width: 260, height: 260}}
              />
              <Text style={$.textStyleOne}>{_('login.changePassword')}</Text>
              <Text style={$.textStyleTwo}>
                {_('login.changePasswordDescription')}
              </Text>
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleOne}
                leftIcon={PASSWORD}
                autoCapitalize="none"
                type="password"
                value={this.state.password}
                rightIcon={this.state.showPassword ? EYE_CLOSED : EYE}
                rightIconPress={(e) =>
                  this.setState({showPassword: !this.state.showPassword})
                }
                placeholder={_('login.newPassword')}
                secureTextEntry={!this.state.showPassword}
                error={this.state.error.password}
                onChangeText={(value) => {
                  this.setState((prevState) => ({
                    ...prevState,
                    password: value,
                  }));
                  this.resetError('password', value.length);
                }}
                onSubmitEditing={() => {
                  this.updatePassword();
                }}
                returnKeyType="go"
              />
            </View>
            <View style={$.containerTwoStyle}>
              <GenericButton
                onPress={this.updatePassword}
                style={$.buttonStyle}
                loading={this.state.loading}
                enabled={this.state.enabled}
                text={_('login.changeMyPassword')}
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
    flex: 1,
    justifyContent: 'flex-start',
  },
  containerTwoStyle: {
    paddingHorizontal: 25,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 60,
    marginTop: 40,
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
    marginTop: 40,
  },
  TextFeildStyleTwo: {
    marginTop: 20,
    marginBottom: 60,
  },
  buttonStyle: {
    backgroundColor: colors.ORANGE,
  },
});

export default ChangePasswordScreen;
