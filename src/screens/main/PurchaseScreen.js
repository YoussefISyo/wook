import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Alert,
} from 'react-native';
import {_} from 'Wook_Market/src/lang/i18n';
import {getUser} from 'Wook_Market/src/lib/user';
import {v4 as uuidv4} from 'uuid';

import {formatPrice} from 'Wook_Market/src/lib/util';
import {getPurchaseMethods} from 'Wook_Market/src/lib/paymentService';
import PurchaseMethod from 'Wook_Market/src/lib/PurchaseMethod';
import BackButton from 'Wook_Market/src/components/BackButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import PurchaseMethodListItem from 'Wook_Market/src/components/PurchaseMethodListItem';
import DeliveryAddressCard from 'Wook_Market/src/components/DeliveryAddressCard';
import SalePointsDropDownComponent from 'Wook_Market/src/components/SalePointsDropDownComponent';
import {updateAddress} from '../../lib/user';
import {handleAddressRemotErrors} from '../../lib/util';
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const HINT_ICON = require('Wook_Market/src/assets/icons/icn_i.png');

class PurchaseScreen extends Component {
  state = {
    useBonus: false,
    user: {},
    checkout: 0,
    data: [],
    toggle: PurchaseMethod.DELIVERY,
    deliveryRegion: '',
    salePoints: [],
    salePoint: null,
    orderType: 'delivery',
    promoCode: null,
    minOrderAmount: 0,
    buttonLoading: false,
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.getUserData();
    });
    this.initStateFromParams();
    this.setNavigationOptions();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }

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

  getUserData = async () => {
    const user = JSON.parse(await getUser());
    this.setState({
      user,
    });
  };

  initStateFromParams = () => {
    const {
      useBonus,
      checkout,
      data,
      deliveryRegion,
      salePoints,
      orderType,
      promoCode,
      minOrderAmount,
    } = this.props.route.params;
    this.setState({
      useBonus,
      checkout,
      data,
      deliveryRegion: 'Nous ne livrons que dans Paris, Nogent-sur-Marne et Le Perreux-sur-Marne.',
      salePoints,
      orderType,
      promoCode,
      minOrderAmount,
    });
  };

  handleItemPress = (purchaseMethodId) => {
    const {salePoint} = this.state;
    let oldOrderType = this.state.orderType;
    const orderType = this.getOrderType(purchaseMethodId);
    // update price - 5%
    if (oldOrderType == 'delivery' && orderType == 'click_collect') {
      this.setState({
        checkout: this.state.checkout - this.state.checkout * 0.05,
      });
    } else if (oldOrderType == 'click_collect' && orderType == 'delivery') {
      this.setState({
        checkout: this.state.checkout / (1 - 0.05),
      });
    }
    const updatedSalePoint = purchaseMethodId === 1 ? null : salePoint;
    this.setState({
      toggle: purchaseMethodId,
      orderType,
      salePoint: updatedSalePoint,
    });
  };

  getOrderType = (purchaseMethodId) => {
    return purchaseMethodId === 1 ? 'delivery' : 'click_collect';
  };

  navigate = (destination, params) => {
    this.props.navigation.navigate(destination, params);
  };

  handleSalePointSelect = (salePoint) => {
    this.setState({salePoint});
  };

  disabledOpacity = () => {
    const {toggle, user, salePoint} = this.state;
    if (toggle === PurchaseMethod.DELIVERY && user.address) return false;
    if (toggle === PurchaseMethod.CLICKANDCOLLECT && salePoint) return false;
    return true;
  };

  navigateToPaymentScreen = () => {
    Analytics.event('commande_etape3_choix_livraison', {
      order_tye: this.state.orderType,
      total: this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout),
      sale_point: this.state.salePoint ? this.state.salePoint.name : 'none',
    });

    if (
      this.state.orderType == 'delivery' &&
      this.state.checkout < this.state.minOrderAmount
    ) {
      Alert.alert(
        '',
        `${_('main.minimumForDelivery1')} ${this.state.minOrderAmount}€ ${_(
          'main.minimumForDelivery2',
        )}`,
      );
      return;
    }
    if (this.state.orderType == 'delivery') {
      const {checkout, user, deliveryRegion, toggle, salePoints, salePoint} =
        this.state;
      // {"address": "9 Rue Bizet, 94800 Villejuif, France", "building": "", "city": "Villejuif", "department": "Val-de-Marne", "digicode": "",
      //  "floor": "", "lat": "48.7975522", "lng": "2.3713338", "region": "Île-de-France"}
      this.setState({buttonLoading: true});
      updateAddress(
        {
          address: user.address,
          building: user.building,
          city: user.city,
          department: user.department,
          digicode: user.digicode,
          floor: user.floor,
          lat: user.lat,
          lng: user.lng,
          region: user.region,
        },
        () => {
          this.setState({buttonLoading: false});

          const {useBonus, checkout, data, orderType, salePoint, promoCode} =
            this.state;
          this.navigate('Payment', {
            useBonus,
            checkout,
            data,
            orderType,
            salePoint: salePoint ? salePoint.id : null,
            promoCode,
          });
        },
        (error) => {
          // console.log(handleAddressRemotErrors(error));
          // this.setState({error:handleAddressRemotErrors(error)})
          //Alert.alert('Erreur', error.address.invalid);
          this.setState({buttonLoading: false});

          Alert.alert(
            'Erreur',
            handleAddressRemotErrors(error).selectedAddress,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          );
        },
      );
    } else {
      const {useBonus, checkout, data, orderType, salePoint, promoCode} =
        this.state;
      this.navigate('Payment', {
        useBonus,
        checkout,
        data,
        orderType,
        salePoint: salePoint ? salePoint.id : null,
        promoCode,
      });
    }
  };

  render() {
    const {checkout, user, deliveryRegion, toggle, salePoints, salePoint} =
      this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={$.scrollViewContentStyle}
            bounces={false}
            style={{backgroundColor: 'white', overflow: 'scroll'}}>
            <View style={{padding: 24}}>
              <Text style={$.titleStyle}>{_('main.choosePurchaseMethod')}</Text>
              <PurchaseMethodListItem
                purchaseMethod={getPurchaseMethods()[0]}
                onPress={this.handleItemPress}
                toggle={this.state.toggle}
              />
              {this.state.user.role != 'pro' && (
                <PurchaseMethodListItem
                  purchaseMethod={getPurchaseMethods()[1]}
                  onPress={this.handleItemPress}
                  toggle={this.state.toggle}
                />
              )}
              <View style={{marginTop: 12}}>
                {toggle === 1 ? (
                  <>
                    <View style={$.addressTitleContainerStyle}>
                      <Text style={$.addressTitleStyle}>
                        {_('main.delevryAddress')}
                      </Text>
                      {user.address ? null : (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() =>
                            this.navigate('DeliveryAddressFromTab', {
                              enterAddress: true,
                            })
                          }>
                          <Text style={$.addTextStyle}>{_('login.add')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={$.deliveryRegionContainerStyle}>
                      <Image source={HINT_ICON} />
                      <Text style={$.deliveryRegionTextStyle}>
                        {deliveryRegion}
                      </Text>
                    </View>
                    {user.address ? (
                      <DeliveryAddressCard
                        address={user.address}
                        onEditPress={() =>
                          this.navigate('DeliveryAddressFromTab')
                        }
                        digicode={user.digicode}
                        building={user.building}
                        floor={user.floor}
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        color: colors.DELIVERY_TIME_COLOR,
                        marginBottom: 14,
                      }}>
                      {_('main.chooseSalePoint')}
                    </Text>
                    <SalePointsDropDownComponent
                      salePoints={salePoints}
                      salePoint={salePoint}
                      onSalePointSelect={this.handleSalePointSelect}
                    />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
          <View style={$.bottomContainerStyle}>
            <View style={$.checkoutContainerStyle}>
              <Text style={$.checkoutTextStyle}>{_('card.totalOrder')}</Text>
              <Text style={$.checkoutValueTextStyle}>
                {checkout < 0 ? 0 : formatPrice(checkout)}
                {_('login.currencyType')}
              </Text>
            </View>
            <GenericButton
              text={_('main.next')}
              containerStyle={{marginBottom: 36}}
              disabledOpacity={this.disabledOpacity()}
              enabled={!this.disabledOpacity()}
              loading={this.state.buttonLoading}
              onPress={this.navigateToPaymentScreen}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const $ = StyleSheet.create({
  checkoutValueTextStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutTextStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 16},
  checkoutContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 24,
  },
  bottomContainerStyle: {
    paddingHorizontal: 24,
    marginTop: 'auto',
    backgroundColor: 'white',
    elevation: 8,
    paddingTop: 24,
    shadowOffset: {width: 0, height: -0.1},
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.PAYMENT_TEXT_COLOR,
    marginBottom: 16,
  },
  addressTitleContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressTitleStyle: {
    fontSize: 16,
    color: colors.PAYMENT_TEXT_COLOR,
  },
  addTextStyle: {color: colors.ORANGE, fontWeight: '700'},
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
  scrollViewContentStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});

export default PurchaseScreen;
