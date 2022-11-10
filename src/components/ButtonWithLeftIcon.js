import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';

const ButtonWithLeftIcon = ({
  text,
  icon,
  style,
  containerStyle,
  textStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[$.outerContainerStyle, containerStyle]}>
      <View style={[$.innerContainerStyle, style]}>
        <Image source={icon} />
        <Text style={[$.textStyle, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  outerContainerStyle: {
    borderRadius: 8,
    backgroundColor: colors.ORANGE,
    alignSelf: 'stretch',
  },
  innerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: 'white',
    marginLeft: 16,
  },
});

export default ButtonWithLeftIcon;
