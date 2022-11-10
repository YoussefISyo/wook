import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Alert,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {getUser} from 'Wook_Market/src/lib/user';
import {getToken} from '../../lib/authentication';
import {deleteAccount} from '../../lib/user';

import dash from 'lodash';
import {updateProfile} from 'Wook_Market/src/lib/user';
import {
  handleRegisterError,
  handleProfileLocalInputError,
} from 'Wook_Market/src/lib/util';
import BackButton from 'Wook_Market/src/components/BackButton';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const EMAIL = require('Wook_Market/src/assets/icons/email_icon.png');
const PERSON = require('Wook_Market/src/assets/icons/person_icon.png');
const PHONE = require('Wook_Market/src/assets/icons/phone_icon.png');
const DELETE_ICON = require('Wook_Market/src/assets/icons/icn_delete_account.png');
const CAUTION_ICON = require('Wook_Market/src/assets/icons/icn_caution.png');

class EditProfileScreen extends Component {
  state = {
    showPassword: false,
    loading: false,
    enabled: false,
    disabledOpacity: true,
    visibility: false,
    user: {
      first_name: '',
      name: '',
      email: '',
      phone: '',
    },
    error: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  };

  componentDidMount = () => {
    this.getUserData();
    this.setNavigationOptions();
  };

  setNavigationOptions() {
    this.props.navigation.setOptions({
      headerLeft: () => {
        return (
          <BackButton
            onPress={() => this.props.navigation.pop()}
            image={BACK_WHTE_ICON}
          />
        );
      },
    });
  }

  user = {};

  getUserData = async () => {
    const user = JSON.parse(await getUser());
    if (user.role == 'user') {
      this.setState({
        ...this.state,
        user: {
          role: user.role,
          first_name: user.first_name,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
      this.user = {
        role: user.role,
        first_name: user.first_name,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
    } else {
      this.setState({
        ...this.state,
        user: {
          role: user.role,
          company_name: user.first_name,
          address: user.address,
          postal_code: user.postal_code,
          city: user.city,
          siret: user.siret,
          email: user.email,
          phone: user.phone,
        },
      });
      this.user = {
        role: user.role,
        company_name: user.first_name,
        address: user.address,
        postal_code: user.postal_code,
        city: user.city,
        siret: user.siret,
        email: user.email,
        phone: user.phone,
      };
    }
  };

  enableButton = () => {
    if (!dash.isEqual(this.user, this.state.user)) {
      this.setState((prevState) => ({
        ...prevState,
        disabledOpacity: false,
        enabled: true,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        disabledOpacity: true,
        enabled: false,
      }));
    }
  };

  onTextChange = async (key, value) => {
    await this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [key]: value,
      },
    }));

    this.enableButton();
  };

  onError(error) {
    this.setState({
      ...this.state,
      error: handleRegisterError(error),
      enabled: true,
      loading: false,
    });
  }

  onSeccess = async () => {
    Analytics.event('mon_profil_sauvegarde');
    await this.getUserData();
    this.setState({
      ...this.state,
      loading: false,
    });
    this.enableButton();
    this.props.navigation.pop();
  };

  emptyError = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  updateProfile = () => {
    const error = handleProfileLocalInputError({
      lastName: this.state.user.name,
      firstName: this.state.user.first_name,
      email: this.state.user.email,
      phone: this.state.user.phone,
    });
    if (!dash.isEqual(error, this.emptyError)) {
      this.setState({
        ...this.state,
        error: error,
      });
      return;
    }
    this.setState({...this.state, enabled: false, loading: true});
    updateProfile(
      this.state.user,
      () => this.onSeccess(),
      (error) => this.onError(error),
    );
  };

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...this.state.error, [key]: ''},
      }));
    }
  }
  showDeleteAccountModal = () => {
    this.setState({visibility: !this.state.visibility});
  };
  onDeleteAccuntPress = async () => {
    const token = await getToken();
    console.log(token);
    deleteAccount(
      {token: token},
      (success) => this.onSuccess(),
      (error) => this.onError(error),
    );
  };
  onSuccess() {
    // Analytics.event('login');

    this.props.navigation.replace('Reception');
    this.setState({
      visibility: !this.state.visibility,
    });
    // this.setState({
    //   ...this.state,
    //   enabled: true,
    //   loading: false,
    // });
  }

  onError(error) {
    console.log(error);
  }
  _deleteAccount = async () => {
    var userToken = await AsyncStorage.getItem('token');

    Account.deleteAccount({token: userToken}).then(async (loggedout) => {
      console.log(loggedout);
      Account.unsubscribeFromPush({
        token: await AsyncStorage.getItem('device_token'),
      });
      this.setState({visibility: !this.state.visibility});

      this.props.navigation.navigate('Main');
    });
  };
  onPress = () => {
    this.setState({visibility: !this.state.visibility});
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={$.containerOneStyle}
        behavior={OS_IOS ? 'padding' : null}
        enabled
        keyboardVerticalOffset={60}>
        <SafeAreaView style={$.containerTwoStyle}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            bounces={false}
            style={$.containerThreeStyle}>
            <View style={$.containerFourStyle}>
              <TextField
                selectionColor={colors.ORANGE}
                leftIcon={PERSON}
                value={this.state.user.first_name}
                placeholder={_('login.firstName')}
                error={this.state.error.firstName}
                onChangeText={(value) => {
                  this.onTextChange('first_name', value);
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
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={PERSON}
                value={this.state.user.name}
                placeholder={_('login.lastName')}
                error={this.state.error.lastName}
                onChangeText={(value) => {
                  this.onTextChange('name', value);
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
                value={this.state.user.email}
                placeholder={_('login.email')}
                error={this.state.error.email}
                onChangeText={(value) => {
                  this.onTextChange('email', value);
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
                leftIcon={PHONE}
                value={this.state.user.phone}
                placeholder={_('login.phone')}
                error={this.state.error.phone}
                onChangeText={(value) => {
                  this.onTextChange('phone', value);
                  this.resetError('phone', value.length);
                }}
                cref={(input) => {
                  this.fourthTextInput = input;
                }}
                onSubmitEditing={() => {
                  if (this.state.enabled) this.updateProfile();
                }}
                returnKeyType="go"
              />
              <GenericButton
                loading={this.state.loading}
                enabled={this.state.enabled}
                disabledOpacity={this.state.disabledOpacity}
                containerStyle={$.buttonOneStyle}
                text={_('login.save')}
                onPress={this.updateProfile}
              />
              <TouchableOpacity onPress={this.showDeleteAccountModal}>
                <View style={$.deleteAccount}>
                  <Image source={DELETE_ICON} style={$.imageDelete} />
                  <Text
                    style={{fontSize: 16, color: '#FC3C3C', fontWeight: '600'}}>
                    {_('deleteAccount.message')}
                  </Text>
                  <View style={{width: 5}}></View>
                </View>
              </TouchableOpacity>
              <Modal
                visible={this.state.visibility}
                animationType={'fade'}
                transparent={true}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(52, 52, 52, 0.8)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: 'white',
                      height: 306,
                      width: '90%',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 7,
                      elevation: 10,
                    }}>
                    <Image
                      source={CAUTION_ICON}
                      style={{
                        height: 70,
                        width: 80,
                        marginTop: 30,
                      }}
                    />
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 14.5,
                          marginTop: 15,
                          textAlign: 'center',
                          fontFamily: 'Poppins-Regular',
                          marginLeft: 40,
                          marginRight: 40,
                        }}>
                        {_('deleteAccount.title')}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '95%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        borderBottomWidth: 0,
                        borderRadius: 5,
                        marginTop: 14,
                      }}>
                      <GenericButton
                        loading={this.state.loading}
                        enabled={true}
                        disabledOpacity={true}
                        containerStyle={$.buttonCancel}
                        text={_('deleteAccount.non')}
                        onPress={this.onPress}
                      />
                      <TouchableOpacity onPress={this.onDeleteAccuntPress}>
                        <Text
                          style={{
                            color: '#D0021B',
                            marginTop: 20,
                            fontSize: 14,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {_('deleteAccount.yes')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const $ = StyleSheet.create({
  deleteAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  imageDelete: {
    width: 24,
    height: 24,
  },
  containerOneStyle: {
    height: '100%',
    backgroundColor: 'white',
  },
  containerTwoStyle: {height: '100%'},
  containerThreeStyle: {
    backgroundColor: 'white',
  },
  buttonOneStyle: {marginTop: 36},
  containerFourStyle: {padding: 24},
  buttonCancel: {marginTop: 24, width: 300, fontSize: 14},

  TextFeildStyleTwo: {
    marginTop: 16,
  },
});

export default EditProfileScreen;
