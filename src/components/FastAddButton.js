import React from 'react';
import {ActivityIndicator} from 'react-native';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

PLUS_ICON_WHITE = require('Wook_Market/src/assets/icons/plus_icon_white.png');
CHECK_ICON = require('Wook_Market/src/assets/icons/check_icon.png');

const ButtonIcon = ({state}) => {
  if (state === ButtonState.LOADING)
    return <ActivityIndicator size="small" color="white" />;
  else
    return (
      <Image
        source={state === ButtonState.CHECKED ? CHECK_ICON : PLUS_ICON_WHITE}
        style={{
          borderTopLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      />
    );
};

const FastAddButton = ({
  state = ButtonState.DEFAULT,
  onAdd,
  onRemove,
  style,
}) => {
  const cStyle = [
    {
      ...styles.containerStyle,
      backgroundColor:
        state === ButtonState.CHECKED ? colors.MEDIUM_GREEN : colors.ORANGE,
    },
    style,
  ];

  return (
    <TouchableOpacity
      disabled={state !== ButtonState.DEFAULT}
      onPress={() => onAdd()}
      activeOpacity={0.8}
      style={cStyle}>
      <ButtonIcon state={state} />
    </TouchableOpacity>
  );
};

export const ButtonState = Object.freeze({
  DEFAULT: 0,
  CHECKED: 1,
  LOADING: 2,
});

const styles = StyleSheet.create({
  containerStyle: {
    height: 33,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
  },
});

export default FastAddButton;
