import React from 'react';
import {View, Text, Image} from 'react-native';

const TabBarIcon = ({size, activeSource, source, focused}) => {
  return (
    <Image
      source={focused === true ? activeSource : source}
      style={{height: size, width: size}}
    />
  );
};

export default TabBarIcon;
