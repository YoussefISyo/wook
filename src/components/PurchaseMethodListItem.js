import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const BTN_CHOOSE_ACTIVATED = require('Wook_Market/src/assets/icons/btn_choose_activated.png');
const BTN_CHOOSE_EMPTY = require('Wook_Market/src/assets/icons/btn_choose_empty.png');

const PurchaseMethodListItem = ({purchaseMethod, onPress, toggle}) => {
  const {name, id} = purchaseMethod;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(id)}>
      <View style={$.containerStyle}>
        <Image
          source={toggle === id ? BTN_CHOOSE_ACTIVATED : BTN_CHOOSE_EMPTY}
        />
        <Text style={$.nameStyle}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 8,
  },
  nameStyle: {
    color: colors.PAYMENT_TEXT_COLOR,
    marginLeft: 10,
  },
});

export default PurchaseMethodListItem;
