import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {getUser} from 'Wook_Market/src/lib/user';
import dash from 'lodash';
import {updateProfilePro} from 'Wook_Market/src/lib/user';
import {
  handleRegisterError,
  handleProfileProLocalInputError,
} from 'Wook_Market/src/lib/util';
import BackButton from 'Wook_Market/src/components/BackButton';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const EMAIL = require('Wook_Market/src/assets/icons/email_icon.png');
const PHONE = require('Wook_Market/src/assets/icons/phone_icon.png');
const PLACE = require('Wook_Market/src/assets/icons/location_icon.png');
const COMPANY = require('Wook_Market/src/assets/icons/icn_company_input.png');
const SIRET = require('Wook_Market/src/assets/icons/icn_siret_input.png');

class EditProfileProScreen extends Component {
  state = {
    showPassword: false,
    loading: false,
    enabled: false,
    disabledOpacity: true,
    user: {
      company_name: '',
      address: '',
      postal_code: '',
      city : "",
      siret : '',
      email: '',
      phone: '',
    },
    error: {
      company_name: '',
      address: '',
      postal_code: '',
      city : "",
      siret : '',
      email: '',
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
    
      this.setState({
        ...this.state,
        user: {
          company_name: user.pro.company_name,
          address: user.pro.payment_address,
          postal_code: user.pro.postal_code,
          city: user.pro.city,
          siret: user.pro.siret,
          email: user.email,
          phone: user.phone,
        },
      });
      this.user = {
        company_name: user.pro.first_name,
        address: user.pro.payment_address,
        postal_code: user.pro.postal_code,
        city: user.pro.city,
        siret: user.pro.siret,
        email: user.email,
        phone: user.phone,
      };
    
  
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
    company_name: '',
      address: '',
      postal_code: '',
      city : "",
      siret : '',
      email: '',
      phone: '',
  };

  updateProfile = () => {
    const error = handleProfileProLocalInputError({
      company_name: this.state.user.company_name,
      address: this.state.user.address,
      postal_code: this.state.user.postal_code,
      city: this.state.user.city,
      siret: this.state.user.siret,
      email: this.state.user.email,
      phone: this.state.user.phone,
    });
    console.log("error", error)
    if (!dash.isEqual(error, this.emptyError)) {
      this.setState({
        ...this.state,
        error: error,
      });
      return;
    }
    this.setState({...this.state, enabled: false, loading: true});
    updateProfilePro(
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
                leftIcon={COMPANY}
                value={this.state.user.company_name}
                placeholder={_('login.companyName')}
                error={this.state.error.company_name}
                onChangeText={(value) => {
                  this.onTextChange('company_name', value);
                  this.resetError('company_name', value.length);
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
                leftIcon={PLACE}
                value={this.state.user.address}
                placeholder={_('login.address')}
                error={this.state.error.address}
                onChangeText={(value) => {
                  this.onTextChange('address', value);
                  this.resetError('address', value.length);
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
                leftIcon={PLACE}
                value={this.state.user.postal_code}
                placeholder={_('login.postalCode')}
                error={this.state.error.postal_code}
                onChangeText={(value) => {
                  this.onTextChange('postal_code', value);
                  this.resetError('postal_code', value.length);
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
                leftIcon={PLACE}
                value={this.state.user.city}
                placeholder={_('login.city')}
                error={this.state.error.city}
                onChangeText={(value) => {
                  this.onTextChange('city', value);
                  this.resetError('city', value.length);
                }}
                cref={(input) => {
                  this.fourthTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.fifthTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={$.TextFeildStyleTwo}
                leftIcon={SIRET}
                value={this.state.user.siret}
                placeholder={_('login.siret')}
                error={this.state.error.siret}
                onChangeText={(value) => {
                  this.onTextChange('siret', value);
                  this.resetError('siret', value.length);
                }}
                cref={(input) => {
                  this.fifthTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.sixthTextInput.focus();
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
                  this.sixthTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.seventhTextInput.focus();
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
                  this.seventhTextInput = input;
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
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const $ = StyleSheet.create({
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
  TextFeildStyleTwo: {
    marginTop: 16,
  },
});

export default EditProfileProScreen;
