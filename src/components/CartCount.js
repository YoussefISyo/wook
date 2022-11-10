import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const CART_ACTIVE = require('Wook_Market/src/assets/icons/cart_active_icon.png');

const CartCount = ({quantity, unit}) => {
  return (
    <View style={$.container}>
      <Image source={CART_ACTIVE} style={$.image} />
      <Text style={$.text}>
        {quantity} {unit}
      </Text>
    </View>
  );
};

const $ = StyleSheet.create({
  text: {
    fontSize: 13,
    color: colors.HINT_GRAY,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  image: {
    height: 20,
    width: 20,
    marginRight: 4,
  },
  container: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default CartCount;
