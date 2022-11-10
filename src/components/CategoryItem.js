import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
const CategoryItem = ({style, image, title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.containerStyle, style]}>
      <View style={styles.subContainerStyle}>
        <ImageBackground
          source={{uri: image}}
          style={styles.imageStyle}
          imageStyle={{
            borderRadius: 10,
          }}>
          <View style={styles.itemHeadStyle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.titleStyle}>
              {title}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export const ITEM_HEIGHT = 134;

const styles = StyleSheet.create({
  subContainerStyle: {flex: 1, aspectRatio: 2.38},
  containerStyle: {
    // width: '100%',
    borderRadius: 10,
    //height: ITEM_HEIGHT,
  },
  imageStyle: {
    borderRadius: 10,
    flex: 1,
    resizeMode: 'cover',
  },

  itemHeadStyle: {
    justifyContent: 'center',
    height: 45,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  titleStyle: {
    fontSize: 15.5,
    color: colors.ITEM_TEXT_GRAY,
    marginHorizontal: 16,
  },
});

export default CategoryItem;
