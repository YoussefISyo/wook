import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import ProfileListItem from 'Wook_Market/src/components/ProfileListItem';
import {colors} from '../../lib/globalStyles';
import {getUser, getRemoteUserData} from 'Wook_Market/src/lib/user';
import {_} from 'Wook_Market/src/lang/i18n';

const MONEY = require('Wook_Market/src/assets/images/money_image.png');
const BAG = require('Wook_Market/src/assets/images/bag_image.png');
const WALLET = require('Wook_Market/src/assets/images/wallet_image.png');
import BackButton from 'Wook_Market/src/components/BackButton';
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');

class ProfileScreen extends Component {
  state = {
    user: {
      role: "",
      first_name: '',
      company_name: "",
      name: '',
      credit: null,
      orderCount: null,
      loyaltyBonus: null,
    },
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserData();
    });
    this.getRemoteUserData();
    this.setNavigationOptions();
  }

  componentWillUnmount() {
    this.unsubscribe();
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

    console.log(user)
    if(user.role=="user") {
      this.setState({
        ...this.state,
        user: {
          role: user.role,
          first_name: user.first_name,
          name: user.name,
          credit: user.credit,
          orderCount: user.order_count,
          loyaltyBonus: user.loyalty_bonus,
        },
      });
    }
    else {
      this.setState({
        ...this.state,
        user: {
          role: user.role,
          company_name: user.pro.company_name,
          credit: user.credit,
          orderCount: user.order_count,
          loyaltyBonus: user.loyalty_bonus,
        },
      });
    }
  };

  getRemoteUserDataSeccess = (responce) => {
    const user = responce.data;
    if(user.role=="user") {
      this.setState({
        ...this.state,
        user: {
          role: user.role,

          first_name: user.first_name,
          name: user.name,
          credit: user.credit,
          orderCount: user.order_count,
          loyaltyBonus: user.loyalty_bonus,
        },
      });
    }
    else {
      this.setState({
        ...this.state,
        user: {
          role: user.role,

          company_name: user.pro.company_name,
          credit: user.credit,
          orderCount: user.order_count,
          loyaltyBonus: user.loyalty_bonus,
        },
      });
    }
    
  };

  getRemoteuserError = () => {};

  getRemoteUserData = () => {
    getRemoteUserData(
      (responce) => this.getRemoteUserDataSeccess(responce),
      () => this.getRemoteuserError(),
    );
  };

  navigateToOrders = () => {
    this.props.navigation.pop();
    this.props.navigation.navigate('Orders');
  };

  render() {
    return (
      <ScrollView bounces={false} style={$.containerOneStyle}>
        <View style={$.containerTwoStyle}>
          {this.state.user.role=="user" ? <Text style={$.textOneStyle}>
            {this.state.user.first_name} {this.state.user.name}
          </Text>
          :<Text style={$.textOneStyle}>
          {this.state.user.company_name} 
        </Text> }
          <GenericButton
            text={_('main.editProfile')}
            textStyle={$.buttonOneStyle}
            style={{paddingVertical: 10, paddingHorizontal: 30}}
            onPress={() => {this.state.user.role=="user" ? this.props.navigation.navigate('EditProfile') : this.props.navigation.navigate('EditProfilePro')}}
          />
          <Text style={$.textTowStyle}>{_('main.statistics')}</Text>
          <ProfileListItem
            image={WALLET}
            title={_('main.bonus')}
            value={
              this.state.user.loyaltyBonus !== null
                ? this.state.user.loyaltyBonus + ' ' + _('main.currencyType')
                : '-'
            }
          />
          <ProfileListItem
            image={MONEY}
            title={_('card.balance')}
            value={
              this.state.user.credit !== null
                ? this.state.user.credit + ' ' + _('main.currencyType')
                : '-'
            }
          />
          <ProfileListItem
            image={BAG}
            onPress={this.navigateToOrders}
            title={_('main.passedCommands')}
            value={
              this.state.user.orderCount !== null
                ? this.state.user.orderCount
                : '-'
            }
          />
        </View>
      </ScrollView>
    );
  }
}

const $ = StyleSheet.create({
  containerOneStyle: {flex: 1, backgroundColor: 'white'},
  containerTwoStyle: {
    padding: 24,
    alignItems: 'center',
  },
  textOneStyle: {
    fontSize: 18,
    color: colors.CLAIM_TEXT_COLOR,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  textTowStyle: {
    alignSelf: 'flex-start',
    marginTop: 24,
    fontSize: 16,
    color: colors.CLAIM_TEXT_COLOR,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonOneStyle: {fontSize: 14},
});

export default ProfileScreen;
