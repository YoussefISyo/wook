import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

FILLED_STAR_ICON = require('Wook_Market/src/assets/icons/star_clicked_icon.png');
EMPTY_STAR_ICON = require('Wook_Market/src/assets/icons/star_icon.png');

const ClickableRatingBar = ({size, rating, style, spacing = 1, onClick}) => {
  [sRating, setRating] = useState(rating);
  return (
    <View style={[styles.containerStyle, style]}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (sRating === 1) {
            setRating(0);
            onClick(0);
          } else {
            setRating(1);
            onClick(1);
          }
        }}>
        <Image
          source={sRating >= 1 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
          style={{
            ...styles.imageStyle,
            width: size,
            height: size,
            marginRight: spacing,
          }}
        />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          setRating(2);
          onClick(2);
        }}>
        <Image
          source={sRating >= 2 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
          style={{
            ...styles.imageStyle,
            width: size,
            height: size,
            marginRight: spacing,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setRating(3);
          onClick(3);
        }}>
        <Image
          source={sRating >= 3 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
          style={{
            ...styles.imageStyle,
            width: size,
            height: size,
            marginRight: spacing,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setRating(4);
          onClick(4);
        }}>
        <Image
          source={sRating >= 4 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
          style={{
            ...styles.imageStyle,
            width: size,
            height: size,
            marginRight: spacing,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setRating(5);
          onClick(5);
        }}>
        <Image
          source={sRating == 5 ? FILLED_STAR_ICON : EMPTY_STAR_ICON}
          style={{
            ...styles.imageStyle,
            width: size,
            height: size,
            marginRight: 0,
          }}
        />
      </TouchableWithoutFeedback>
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

export default ClickableRatingBar;
