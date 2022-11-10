import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const BackButton = ({onPress, image}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={$.containerStyle}>
      <Image source={image} />
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerStyle: {
    paddingRight: 15,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;
