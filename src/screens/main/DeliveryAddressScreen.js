import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import TextField from 'Wook_Market/src/components/TextField';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import PredictionsListItem from 'Wook_Market/src/components/PredictionsListItem';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {v4 as uuidv4} from 'uuid';
import {addressSearch, locationSearch} from 'Wook_Market/src/lib/map';
import BackButton from 'Wook_Market/src/components/BackButton';
import {handleAddressRemotErrors} from 'Wook_Market/src/lib/util';
import {getRemoteUserData, updateAddress} from 'Wook_Market/src/lib/user';
import GenericError from 'Wook_Market/src/components/GenericError';

const ADRESS = require('Wook_Market/src/assets/icons/adress_icon.png');
const BUILDING = require('Wook_Market/src/assets/icons/building_icon.png');
const DIGICODE = require('Wook_Market/src/assets/icons/digicode_icon.png');
const STAGE = require('Wook_Market/src/assets/icons/stage_icon.png');
const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const POWRED_BY_GOOGLE = require('Wook_Market/src/assets/images/powered_by_google_on_white.png');
const HINT_ICON = require('Wook_Market/src/assets/icons/icn_i.png');

class DeliveryAddressScreen extends Component {
  state = {
    data: [],
    selectedAddress: '',
    showSearchView: false,
    loading: false,
    focused: false,
    digicode: '',
    building: '',
    floor: '',
    currentState: 'loading',
    lat: '',
    lng: '',
    buttonLoading: false,
    buttonEnabled: true,
    alertMessage: '',
    city: '',
    department: '',
    region: '',
    error: {
      selectedAddress: '',
    },
  };

  componentDidMount = () => {
    this.getRemoteUserData();
    this.setNavigationOptions();
  };

  getRemoteUserData = () => {
    this.setState({...this.state, currentState: 'loading'});
    getRemoteUserData(
      (response) => {
        const user = response.data;
        this.setState((prevState) => ({
          ...prevState,
          selectedAddress: user.address ? user.address : '',
          digicode: user.digicode ? user.digicode : '',
          building: user.building ? user.building : '',
          floor: user.floor ? user.floor.toString() : '',
          lat: user.lat ? user.lat : '',
          lng: user.lng ? user.lng : '',
          currentState: 'success',
          deliveryRegion: response.config.delivery_region,
          city: user.city ? user.city : '',
          department: user.department ? user.department : '',
          region: user.region ? user.region : '',
        }));
      },
      (error) => {
        this.setState({...this.state, currentState: 'error'});
      },
    );
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

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...this.state.error, [key]: ''},
      }));
    }
  }

  sessiontoken = uuidv4();

  addressSearch = (value) => {
    if (value.length === 0) {
      this.setState({
        ...this.state,
        selectedAddress: '',
        showSearchView: false,
      });
    } else {
      this.setState({
        ...this.state,
        selectedAddress: value,
        showSearchView: true,
        loading: true,
      });
    }
    console.log(value);
    addressSearch(
      value,
      this.sessiontoken,
      (data) => {
        this.setState({data, loading: false});
      },
      () => {
        this.setState({
          loading: false,
        });
      },
    );
    if (this.state.lat !== '' && this.state.log !== '') {
      this.setState({lat: '', lng: ''});
    }
    this.resetError('selectedAddress', value.length);
  };

  searchResultComponentStyle = {
    flex: 1,
    width: '100%',
    height: 220,
    backgroundColor: 'white',
    zIndex: 5,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 96,
    borderRadius: 5,
    borderColor: colors.GRAY_VARIANT,
    borderWidth: 1,
  };

  handleOnFocus = () => {
    this.sessiontoken = uuidv4();
    this.setState({
      ...this.state,
      data: [],
      focused: true,
      showSearchView: true,
    });
  };

  handleOnBlur = () => {
    this.setState({
      ...this.state,
      data: [],
      focused: false,
      showSearchView: false,
    });
  };

  onTextChange = async (key, value) => {
    await this.setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  getCity = (addressComponent) => {
    let city = '';
    addressComponent.forEach((item) => {
      if (item.types[0] === 'locality') {
        city = item.long_name;
      }
    });
    return city;
  };

  getDepartment = (addressComponent) => {
    let department = '';
    addressComponent.forEach((item) => {
      if (item.types[0] === 'administrative_area_level_2') {
        department = item.long_name;
      }
    });
    return department;
  };

  getRegion = (addressComponent) => {
    let region = '';
    addressComponent.forEach((item) => {
      if (item.types[0] === 'administrative_area_level_1') {
        region = item.long_name;
      }
    });
    return region;
  };

  handleItemPress = (description, placeId) => {
    this.setState({...this.state, selectedAddress: description});
    locationSearch(
      placeId,
      (result) => {
        this.setState({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          city: this.getCity(result.address_components),
          department: this.getDepartment(result.address_components),
          region: this.getRegion(result.address_components),
          loading: false,
        });
      },
      () => {
        this.setState({
          loading: false,
        });
      },
    );
  };

  updataAddress() {
    if (
      this.state.selectedAddress === '' ||
      this.state.lat === '' ||
      this.state.lng === ''
    ) {
      this.setState({
        ...this.state,
        error: {
          ...this.state.error,
          selectedAddress: _('login.invalideAddress'),
        },
      });
      return;
    }
    this.setState({
      ...this.state,
      buttonEnabled: false,
      buttonLoading: true,
      error: {...this.state.error, selectedAddress: ''},
    });
    console.log(this.state.region);
    updateAddress(
      {
        address: this.state.selectedAddress,
        lat: this.state.lat,
        lng: this.state.lng,
        digicode: this.state.digicode,
        building: this.state.building,
        floor: this.state.floor,
        city: this.state.city,
        department: this.state.department,
        region: this.state.region,
      },
      () => {
        Analytics.event('adresse_de_livraison_sauvegarde');

        this.setState({
          ...this.state,
          buttonEnabled: true,
          buttonLoading: false,
          alertMessage: _('main.addressAdded'),
        });
      },
      (error) => {
        this.onError(error);
      },
    );
  }

  onError(error) {
    this.setState({
      ...this.state,
      error: handleAddressRemotErrors(error),
      buttonEnabled: true,
      buttonLoading: false,
    });
  }

  createAlert = () =>
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
            }),
              this.props.navigation.pop();
          },
        },
      ],
      {cancelable: false},
    );

  searchResultComponent() {
    return (
      <View style={this.searchResultComponentStyle}>
        <FlatList
          keyExtractor={(item) => item.place_id}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={false}
          contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 8}}
          data={this.state.data}
          renderItem={({item}) => {
            return (
              <PredictionsListItem item={item} onPress={this.handleItemPress} />
            );
          }}
        />
        <Image
          style={{marginTop: 6, marginBottom: 6, marginLeft: 8}}
          source={POWRED_BY_GOOGLE}
        />
      </View>
    );
  }

  handlingFloor(text) {
    if (
      text.charAt(text.length - 1) === ' ' ||
      text.charAt(text.length - 1) === '.' ||
      text.charAt(text.length - 1) === ',' ||
      text.charAt(text.length - 1) === '-'
    ) {
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      floor: text,
    }));
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={$.containerOneStyle}
        behavior={OS_IOS ? 'padding' : null}
        enabled
        keyboardVerticalOffset={60}>
        <SafeAreaView style={$.containerTwoStyle}>
          {this.state.currentState === 'loading' ? (
            <ActivityIndicator
              color={colors.ORANGE}
              size="large"
              style={$.loaderStyle}
            />
          ) : null}
          {this.state.currentState === 'success' ? (
            <ScrollView
              keyboardShouldPersistTaps="always"
              bounces={false}
              nestedScrollEnabled={true}
              style={$.containerThreeStyle}>
              <View style={$.containerFourStyle}>
                <Text style={$.textStyleOne}>
                  {_('login.addressInformation')}
                </Text>
                <TextField
                  selectionColor={colors.ORANGE}
                  leftIcon={ADRESS}
                  rightIcon={
                    this.state.selectedAddress.length > 0 &&
                    !this.state.loading &&
                    this.state.focused
                      ? CLOSE
                      : null
                  }
                  rightIconPress={() => {
                    this.setState({selectedAddress: '', showSearchView: false});
                  }}
                  placeholder={_('login.deliveryAddress')}
                  value={this.state.selectedAddress}
                  loading={this.state.loading}
                  onChangeText={this.addressSearch}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleOnBlur}
                  onSubmitEditing={(event) => this.setState({loading: false})}
                  error={this.state.error.selectedAddress}
                  onSubmitEditing={() => {
                    this.secondTextInput.focus();
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                />
                <TextField
                  selectionColor={colors.ORANGE}
                  containerStyle={$.TextFeildStyleTwo}
                  value={this.state.digicode}
                  leftIcon={DIGICODE}
                  onChangeText={(value) => this.onTextChange('digicode', value)}
                  placeholder={_('login.digicode')}
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
                  leftIcon={BUILDING}
                  value={this.state.building}
                  onChangeText={(value) => this.onTextChange('building', value)}
                  placeholder={_('login.building')}
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
                  leftIcon={STAGE}
                  placeholder={_('login.floor')}
                  value={this.state.floor}
                  keyboardType="numeric"
                  onChangeText={(value) => this.handlingFloor(value)}
                  cref={(input) => {
                    this.fourthTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.updataAddress();
                  }}
                  returnKeyType="go"
                />
                <GenericButton
                  onPress={() => this.updataAddress()}
                  containerStyle={$.buttonOneStyle}
                  loading={this.state.buttonLoading}
                  enabled={this.state.buttonEnabled}
                  text={_('login.save')}
                />
                <View style={$.deliveryRegionContainerStyle}>
                  <Image source={HINT_ICON} />
                  <Text style={$.deliveryRegionTextStyle}>
                    Nous ne livrons que dans Paris, Nogent-sur-Marne et Le Perreux-sur-Marne.
                  </Text>
                </View>
                {this.state.data.length > 0 && this.state.showSearchView
                  ? this.searchResultComponent()
                  : null}
                {this.state.alertMessage !== '' ? this.createAlert() : null}
              </View>
            </ScrollView>
          ) : null}
          {this.state.currentState === 'error' ? (
            <GenericError
              errorText={_('login.errorMessage')}
              onRetry={this.getRemoteUserData}
            />
          ) : null}
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
  containerTwoStyle: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerThreeStyle: {
    backgroundColor: 'white',
    width: '100%',
  },
  buttonOneStyle: {marginTop: 40},
  containerFourStyle: {paddingVertical: 24, paddingHorizontal: 16},
  TextFeildStyleTwo: {
    marginTop: 16,
  },
  textStyleOne: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    marginBottom: 12,
  },
  loaderStyle: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  deliveryRegionTextStyle: {
    color: colors.ORANGE,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  deliveryRegionContainerStyle: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
});

export default DeliveryAddressScreen;
