import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {createCard} from 'Wook_Market/src/lib/stripe';
import BackButton from 'Wook_Market/src/components/BackButton';
import dash from 'lodash';
import {
  handleAddPaymentMethodErrors,
  mapStripeErrorToMessage,
} from 'Wook_Market/src/lib/util';

const PERSON = require('Wook_Market/src/assets/icons/person_icon.png');
const TIME = require('Wook_Market/src/assets/icons/time_icon.png');
const CVV = require('Wook_Market/src/assets/icons/cvv_icon.png');
const CREDIT_CARD = require('Wook_Market/src/assets/icons/credit_card_icon.png');
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const POWRED_BY_GOOGLE = require('Wook_Market/src/assets/images/powered_by_google_on_white.png');

class PaymentMethodScreen extends Component {
  state = {
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    showAlert: '',
    loading: false,
    enabled: true,
    alertMessage: '',
    error: {
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      alertMessage: '',
    },
  };

  componentDidMount = () => {
    console.log('helo word');

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

  handlingCardNumber(number) {
    if (number.length < this.state.cardNumber.length) {
      this.setState({cardNumber: number});
    } else {
      this.setState({
        cardNumber: number
          .replace(/[^0-9]/g, '')
          .replace(/(\d{4})/g, '$1 ')
          .trim(),
      });
    }
  }

  emptyError = {
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    alertMessage: '',
  };

  checkForMissingInformations() {
    const error = {
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      alertMessage: '',
    };
    if (this.state.cardCVV === '') {
      error.cardCVV = _('error.fieledRequired');
    } else if (this.state.cardCVV.length < 3) {
      error.cardCVV = _('error.invalidCVV');
    }
    if (this.state.cardNumber === '') {
      error.cardNumber = _('error.fieledRequired');
    } else if (this.state.cardNumber.length < 19) {
      error.cardNumber = _('error.invalidNumber');
    }

    if (this.state.cardExpiry === '') {
      error.cardExpiry = _('error.fieledRequired');
    } else if (this.state.cardExpiry.length < 5) {
      error.cardExpiry = _('error.invalidExpirationDate');
    }
    return error;
  }

  getMonthFromCardExpiry(cardExpiry) {
    let month = '';
    for (let i = 0; i < 2; i++) {
      month += cardExpiry[i];
    }
    return month;
  }
  getYearFromCardExpiry(cardExpiry) {
    let year = '';
    for (let i = 3; i < 5; i++) {
      year += cardExpiry[i];
    }
    return year;
  }

  handlingCardExpiry(text) {
    if (
      text.charAt(text.length - 1) === ' ' ||
      text.charAt(text.length - 1) === '.' ||
      text.charAt(text.length - 1) === ','
    ) {
      return;
    }
    if (text.length < this.state.cardExpiry.length) {
      this.setState({cardExpiry: text});
    } else {
      let value = text
        .replace(/[^0-9]/g, '')
        .replace(/(\d{2})/g, '$1/')
        .trim();
      if (value.length === 6) {
        value = value.substring(0, value.length - 1);
      }
      this.setState({
        cardExpiry: value,
      });
    }
  }

  handlingCardCVV(text) {
    if (
      text.charAt(text.length - 1) === ' ' ||
      text.charAt(text.length - 1) === '.' ||
      text.charAt(text.length - 1) === ',' ||
      text.charAt(text.length - 1) === '-'
    ) {
      return;
    }
    this.setState({
      ...this.state,
      cardCVV: text,
    });
  }

  createErrorAlert = () =>
    Alert.alert(
      '',
      this.state.error.alertMessage,
      [
        {
          text: _('main.ok'),
          onPress: () =>
            this.setState({
              ...this.state,
              error: {...this.state.error, alertMessage: ''},
            }),
        },
      ],
      {cancelable: false},
    );

  createSuccessAlert = () =>
    Alert.alert(
      '',
      this.state.alertMessage,
      [
        {
          text: _('main.ok'),
          onPress: () => {
            this.setState({
              ...this.state,
              alertMessage: '',
            });
            this.props.navigation.pop();
          },
        },
      ],
      {cancelable: false},
    );

  createCard = () => {
    const error = this.checkForMissingInformations();
    if (!dash.isEqual(this.emptyError, error)) {
      this.setState((prevState) => ({
        ...prevState,
        error,
      }));
      return;
    }
    this.setState({...this.state, loading: true, enabled: false});
    createCard(
      this.state.cardNumber,
      this.getMonthFromCardExpiry(this.state.cardExpiry),
      this.getYearFromCardExpiry(this.state.cardExpiry),
      this.state.cardCVV,
      this.state.cardName,
      (errorCode) => this.createCardError(errorCode),
      () => this.createCardSeccess(),
    );
  };

  createCardError = (errorCode) => {
    this.setState((prevState) => ({
      ...prevState,
      loading: false,
      enabled: true,
      error: handleAddPaymentMethodErrors(errorCode),
    }));
  };

  createCardSeccess = () => {
    Analytics.event('methodes_de_paiement_sauvegarde');

    this.setState((prevState) => ({
      ...prevState,
      loading: false,
      enabled: true,
      alertMessage: _('error.cardAdded'),
    }));
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
              <Text style={$.textOneStyle}>{_('card.cardInformaion')}</Text>
              <TextField
                selectionColor={colors.ORANGE}
                containerStyle={{marginTop: 10}}
                leftIcon={CREDIT_CARD}
                keyboardType="numeric"
                maxLength={19}
                error={this.state.error.cardNumber}
                value={this.state.cardNumber}
                onChangeText={(text) => {
                  this.handlingCardNumber(text);
                  this.resetError('cardNumber', text.length);
                }}
                placeholder={_('card.cardNumber')}
                cref={(input) => {
                  this.secondTextInput = input;
                }}
                onSubmitEditing={() => {
                  this.thirdTextInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TextField
                  selectionColor={colors.ORANGE}
                  containerStyle={$.TextFeildStyleThree}
                  leftIcon={TIME}
                  value={this.state.cardExpiry}
                  error={this.state.error.cardExpiry}
                  onChangeText={(text) => {
                    this.handlingCardExpiry(text);
                    this.resetError('cardExpiry', text.length);
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholder={_('card.cardExpiration')}
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
                  containerStyle={$.TextFeildStyleFour}
                  leftIcon={CVV}
                  onChangeText={(text) => {
                    this.handlingCardCVV(text);
                    this.resetError('cardCVV', text.length);
                  }}
                  maxLength={3}
                  error={this.state.error.cardCVV}
                  value={this.state.cardCVV}
                  keyboardType="numeric"
                  placeholder={_('card.cvv')}
                  cref={(input) => {
                    this.fourthTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.createCard();
                  }}
                  returnKeyType="go"
                  s
                />
              </View>
              <GenericButton
                text={_('login.save')}
                loading={this.state.loading}
                enabled={this.state.enabled}
                onPress={() => {
                  this.createCard();
                }}
              />
              {this.state.error.alertMessage.length > 0
                ? this.createErrorAlert()
                : null}
              {this.state.alertMessage.length > 0
                ? this.createSuccessAlert()
                : null}
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
  TextFeildStyleThree: {
    flex: 2,
    marginTop: 20,
  },
  TextFeildStyleFour: {
    flex: 1,
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 50,
  },
  containerFourStyle: {padding: 24},
  TextFeildStyleTwo: {
    marginTop: 20,
  },
  textOneStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    marginBottom: 12,
  },
});

export default PaymentMethodScreen;
