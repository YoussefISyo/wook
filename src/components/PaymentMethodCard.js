import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';

const VISA_CARD = require('Wook_Market/src/assets/images/logo_visa.png');
const EDIT = require('Wook_Market/src/assets/icons/edit_icon.png');

const PaymentMethodCard = ({
  cardBrand,
  cardType,
  last4,
  image,
  onEditPress,
}) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <View style={$.containerOneStyle}>
      <View style={$.containrTwoStyle}>
        <Text style={$.textOneStyle}>
          {capitalizeFirstLetter(cardBrand) +
            ' ' +
            capitalizeFirstLetter(cardType)}
        </Text>
        <View style={$.containerFourStyle}>
          <Image source={{uri: image}} style={$.imageStyle} />
          <Text style={$.textFourStyle}>******</Text>
          <Text style={$.textFiveStyle}>{last4}</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={onEditPress}>
        <View style={$.containerThreeStyle}>
          <Image source={EDIT} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderColor: colors.ORANGE,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.DELEVERY_CACD_BACKGROUND_COLOR,
  },
  containrTwoStyle: {flex: 1, marginRight: 16},
  textOneStyle: {color: colors.ITEM_TEXT_GRAY, marginBottom: 6},
  textTwoStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 13},
  containerThreeStyle: {
    width: 30,
    height: 30,
    backgroundColor: colors.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  containerFourStyle: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  imageStyle: {
    width: 50,
    height: 30,
  },
  textFourStyle: {
    marginTop: 5,
    color: colors.DELIVERY_TIME_COLOR,
  },
  textFiveStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 12,
  },
});

export default PaymentMethodCard;
