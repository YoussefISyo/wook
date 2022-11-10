import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const LOCATION = require('Wook_Market/src/assets/icons/location_icon.png');

const PredictionsListItem = ({onPress, item}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        onPress(item.description,item.place_id);
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginVertical: 8,
        }}>
        <Image source={LOCATION} />
        <Text
          style={{
            fontSize: 14,
            marginStart: 4,
            color: colors.DELIVERY_TIME_COLOR,
            flex: 1,
            flexWrap: 'wrap',
            alignSelf: 'center',
          }}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({});

export default PredictionsListItem;
