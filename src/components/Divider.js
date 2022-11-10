import React from 'react';
import {View} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const Divider = () => {
  return (
    <View
      style={{
        height: '100%',
        borderWidth: 0.5,
        borderColor: colors.BORDER_GRAY,
      }}
    />
  );
};

export default Divider;
