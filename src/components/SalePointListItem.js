import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';

const SalePointListItem = ({salePoint, onSalePointSelect}) => {
  const {address, name} = salePoint;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={$.containrTwoStyle}
      onPress={() => onSalePointSelect(salePoint)}>
      <Text style={$.textOneStyle}>{name}</Text>
      <Text style={$.textTwoStyle}>{address}</Text>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containrTwoStyle: {flex: 1, marginBottom: 16, marginTop: 16},
  textOneStyle: {color: colors.ITEM_TEXT_GRAY, marginBottom: 6},
  textTwoStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 13},
});

export default SalePointListItem;
