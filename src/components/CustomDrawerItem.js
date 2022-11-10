import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const CustomDrawerItem = ({
  label,
  icon,
  onPress,
  style,
  labelStyle,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[$.containerOneStyle, containerStyle]}>
      <View style={[$.containerTwoStyle, style]}>
        <Image source={icon} />
        <Text style={[$.textOneStyle, labelStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    marginHorizontal: 10,
    marginVertical: 4,
  },
  containerTwoStyle: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  textOneStyle: {
    alignSelf: 'center',
    marginLeft: 6,
    color: colors.ITEM_TEXT_GRAY,
  },
});

export default CustomDrawerItem;
