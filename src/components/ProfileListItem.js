import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const ProfileListItem = ({image, title, value, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={$.containerOneStyle}>
      <View style={$.containerThreeStyle}>
        <Image source={image} style={$.imageStyle} />
        <View style={$.containerTwoStyle}>
          <Text style={$.textOneStyle}>{title}</Text>
          <Text style={$.textTwoStyle}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    backgroundColor: 'white',
    marginTop: 12,
    borderRadius: 10,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    width: '100%',
  },
  containerThreeStyle: {
    flexDirection: 'row',
  },
  imageStyle: {borderRadius: 10},
  containerTwoStyle: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
  },
  textOneStyle: {color: colors.DELIVERY_TIME_COLOR},
  textTwoStyle: {color: colors.ORANGE, fontSize: 18, marginTop: 8},
});

export default ProfileListItem;
