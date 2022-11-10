import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

FILLED_STAR_ICON = require('Wook_Market/src/assets/icons/star_clicked_icon.png');
EMPTY_STAR_ICON = require('Wook_Market/src/assets/icons/star_icon.png');
const RatingBar = ({size, rating, style, spacing = 1}) => {
  return (
    <View style={[styles.containerStyle, style]}>
      <Image
        source={rating >= 1 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
        style={{
          ...styles.imageStyle,
          width: size,
          height: size,
          marginRight: spacing,
        }}
      />
      <Image
        source={rating >= 2 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
        style={{
          ...styles.imageStyle,
          width: size,
          height: size,
          marginRight: spacing,
        }}
      />
      <Image
        source={rating >= 3 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
        style={{
          ...styles.imageStyle,
          width: size,
          height: size,
          marginRight: spacing,
        }}
      />
      <Image
        source={rating >= 4 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
        style={{
          ...styles.imageStyle,
          width: size,
          height: size,
          marginRight: spacing,
        }}
      />
      <Image
        source={rating == 5 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
        style={{
          ...styles.imageStyle,
          width: size,
          height: size,
          marginRight: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    marginTop: 1,
    marginBottom: 1,
  },
  containerStyle: {
    flexDirection: 'row',
  },
});

export default RatingBar;
