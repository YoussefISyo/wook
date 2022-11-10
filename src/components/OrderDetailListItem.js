import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {formatPrice} from 'Wook_Market/src/lib/util';
import {_} from 'Wook_Market/src/lang/i18n';

const OrderDetailListItem = ({product}) => {
  const displayQuantity = (unit, quantity) => {
    if (unit === 'items') return `${quantity}`;
    if (unit === 'kg') {
      if (quantity < 1.0) {
        return `${quantity * 1000}g`;
      } else {
        return `${quantity}kg`;
      }
    }
  };

  return (
    <View
      shadowOffset={{width: 1, height: 1}}
      shadowColor="black"
      shadowOpacity={0.2}
      style={$.containerOneStyle}>
      <Image source={{uri: product.image}} style={$.imageStyle} />
      <View style={$.containerTwoStyle}>
        <Text style={$.textOneStyle}>{product.name}</Text>
        <View style={{marginTop: 8, flexDirection: 'row'}}>
          <Text style={$.textTwoStyle}>
            {formatPrice(product.price) + _('main.currencyType')}
            

            
          </Text>
        </View>
      </View>
      <Text style={$.textThreeStyle}>
        {displayQuantity(product.unit, product.quantity)}
      </Text>
    </View>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    backgroundColor: 'white',
    marginTop: 12,
    borderRadius: 10,
  },
  imageStyle: {width: 70, height: 60, borderRadius: 10, resizeMode: 'contain'},
  containerTwoStyle: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 4,
  },
  textOneStyle: {fontSize: 16, color: colors.CART_TEXT_COLOR},
  textTwoStyle: {color: colors.LIGHT_GRAY},
  textThreeStyle: {
    color: colors.LIGHT_GRAY,
  },
  textFourStyle: {
    color: colors.ORANGE,
  },
});

export default OrderDetailListItem;
