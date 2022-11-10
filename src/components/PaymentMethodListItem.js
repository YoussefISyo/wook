import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const BTN_CHOOSE_ACTIVATED = require('Wook_Market/src/assets/icons/btn_choose_activated.png');
const BTN_CHOOSE_EMPTY = require('Wook_Market/src/assets/icons/btn_choose_empty.png');

const PaymentMethodListItem = ({
  item,
  paymentMethod,
  onPaymentMethodSelect,
}) => {
  const {name, image} = item;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPaymentMethodSelect(item.id)}>
      <View
        style={[
          $.containerStyle,
          paymentMethod === item.id
            ? {backgroundColor: colors.LIGHT_ORANGE}
            : null,
        ]}>
        <Image source={image} />
        <Text style={$.textStyle}>{name}</Text>
        <Image
          source={
            paymentMethod === item.id ? BTN_CHOOSE_ACTIVATED : BTN_CHOOSE_EMPTY
          }
          style={$.imageStyle}
        />
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  textStyle: {
    marginLeft: 12,
  },
  imageStyle: {
    marginLeft: 'auto',
  },
});

export default PaymentMethodListItem;
