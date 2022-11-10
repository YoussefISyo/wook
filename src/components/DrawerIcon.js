import React from 'react';
import {TouchableOpacity, Image} from 'react-native';

DRAWER_ICON = require('Wook_Market/src/assets/icons/menu_icon.png');

const DrawerIcon = ({onPress}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{marginLeft: 8, padding: 10}}
    onPress={onPress}>
    <Image source={DRAWER_ICON} style={{height: 22, width: 26}} />
  </TouchableOpacity>
);

export default DrawerIcon;
