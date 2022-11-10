import React from 'react';
import {View, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const RETRY_ICON = require('Wook_Market/src/assets/icons/icn_loader_products.png');

const ListFooter = ({condition, onPress, style}) => {
  return condition ? (
    <TouchableOpacity
      style={[{alignItems: 'center'}, style]}
      activeOpacity={0.7}
      onPress={onPress}>
      <Image source={RETRY_ICON} />
    </TouchableOpacity>
  ) : (
    <View style={[{marginTop: 8}, style]}>
      <ActivityIndicator color={colors.ORANGE} size="large" />
    </View>
  );
};

export default ListFooter;
