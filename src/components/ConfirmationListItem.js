import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {formatPrice} from 'Wook_Market/src/lib/util';

export const ConfirmationListitem = ({product}) => {
  const displayQuantity = (unit, quantity) => {
    if (unit === 'items') return `${quantity} x`;
    if (unit === 'kg') {
      if (quantity < 1.0) {
        return `${quantity * 1000} g`;
      } else {
        return `${quantity} kg`;
      }
    }
  };

  return (
    <View style={$.containerOneStyle}>
      <Image source={{uri: product.image}} style={$.imageStyle} />
      <View style={$.containerTowStyle}>
        <Text style={$.textOneStyle}>{product.name}</Text>
        <Text style={$.textTwoStyel}>
          {formatPrice(product.price * product.quantity)}
          {_('login.currencyType')}
        </Text>
        <Text style={$.textThreeStyle}>
          {displayQuantity(product.unit, product.quantity)}
        </Text>
      </View>
    </View>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {flexDirection: 'row', paddingVertical: 14},
  imageStyle: {width: 70, height: 60, borderRadius: 12, resizeMode: 'contain'},
  containerTowStyle: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
  },
  textOneStyle: {fontSize: 16, color: colors.CART_TEXT_COLOR},
  textTwoStyel: {color: colors.CONFIRMATION_PRICE_COLOR, marginTop: 8},
  textThreeStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginTop: 8,
    color: colors.LIGHT_GRAY,
  },
});

export default ConfirmationListitem;
