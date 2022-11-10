import React from 'react';
import {StyleSheet, TouchableOpacity, Image, View} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';

QuantityCircularButton = ({style, icon, onPress, enabled = true}) => {
  return enabled ? (
    <TouchableOpacity
      style={[styles.circularButtonContainerStyle, style]}
      activeOpacity={0.8}
      onPress={onPress}>
      <Image source={icon} style={styles.circularButtonIconStyle} />
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.circularButtonContainerStyle,
        style,
        {backgroundColor: colors.GRAY_DISABLED},
      ]}>
      <Image source={icon} style={styles.circularButtonIconStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  circularButtonContainerStyle: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.GRAY_VARIANT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButtonIconStyle: {
    height: 25,
    width: 25,
  },
});

export default QuantityCircularButton;
