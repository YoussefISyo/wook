import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';

const EDIT = require('Wook_Market/src/assets/icons/edit_icon.png');

const DeliveryAddressCard = ({
  address,
  onEditPress,
  digicode,
  building,
  floor,
}) => {
  const displayAddress = () => {
    return (
      address +
      (digicode ? ', ' + digicode : '') +
      (building ? ', ' + building : '') +
      (floor ? ', ' + floor : '')
    );
  };
  return (
    <View style={$.containerOneStyle}>
      <View style={$.containrTwoStyle}>
        <Text style={$.textOneStyle}>{_('main.france')}</Text>
        <Text style={$.textTwoStyle}>{displayAddress()}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={onEditPress}>
        <View style={$.containerThreeStyle}>
          <Image source={EDIT} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderColor: colors.ORANGE,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.DELEVERY_CACD_BACKGROUND_COLOR,
  },
  containrTwoStyle: {flex: 1, marginRight: 16},
  textOneStyle: {color: colors.ITEM_TEXT_GRAY, marginBottom: 6},
  textTwoStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 13},
  containerThreeStyle: {
    width: 30,
    height: 30,
    backgroundColor: colors.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});

export default DeliveryAddressCard;
