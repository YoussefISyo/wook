import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const CircularButton = ({style, image, elevation, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        onPress();
      }}
      style={[$.buttonStyle, style, elevation ? {elevation: 2} : null]}>
      <View>
        <Image source={image ? image : null} />
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  buttonStyle: {
    width: 30,
    height: 30,
    backgroundColor: colors.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

export default CircularButton;
