import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {_} from 'Wook_Market/src/lang/i18n';

const DISABLED = require('Wook_Market/src/assets/icons/icn_i.png');

const GenericButton = ({
  style,
  containerStyle,
  text,
  enabled = true,
  loading = false,
  disabledOpacity = false,
  disabledStyle,
  onPress,
  textStyle,
  minBalance,
  spinnerSize,
  disabledText,
  activeOpacity = 0.8,
  loadingStyle,
  spinnerColor,
  showMinCommand = false,
}) => {
  return enabled ? (
    <View>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={[$.outerContainerStyle, containerStyle]}>
        <View style={[$.button, style]}>
          <Text style={[$.buttonText, textStyle]}>{text}</Text>
        </View>
      </TouchableOpacity>

      {showMinCommand && (
        <View style={[$.disabledButton1, containerStyle, {marginTop: 0}]}>
          <Image
            style={{height: 18, width: 18, resizeMode: 'contain'}}
            source={DISABLED}
          />
          <Text style={$.disabledButtonText}>
            {disabledText
              ? disabledText
              : `${_('main.minimumForDelivery1')} ${minBalance}€ ${_(
                  'main.minimumForDelivery2',
                )}\n${_('main.noMinimum')}`}
          </Text>
        </View>
      )}
    </View>
  ) : disabledOpacity ? (
    <View style={[$.disabledOpacityStyle, containerStyle, disabledStyle]}>
      <Text style={[$.buttonText, textStyle]}>{text}</Text>
    </View>
  ) : loading ? (
    <View style={[$.loadingButtonStyle, containerStyle, loadingStyle]}>
      <ActivityIndicator
        color={spinnerColor ? spinnerColor : 'white'}
        size={spinnerSize ? spinnerSize : 34}
      />
    </View>
  ) : (
    <View style={[$.disabledButton, containerStyle]}>
      <Image source={DISABLED} />
      <Text style={$.disabledButtonText}>
        {disabledText
          ? disabledText
          : `${_('card.minimumAmount')} ${minBalance}${_(
              'login.currencyType',
            )}`}
      </Text>
    </View>
  );
};

const $ = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.ORANGE,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
  disabledButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: colors.DISABLED_BUTTON_COLOR,
    borderRadius: 8,
  },

  disabledButton1: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: '#FFF9EB',
    opacity: 0.8,
    borderRadius: 8,
  },
  loadingButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: OS_IOS ? 6.75 : 7.7,
    backgroundColor: colors.ORANGE,
    opacity: 0.7,
    borderRadius: 8,
  },
  disabledButtonText: {
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    fontSize: 12,
    marginLeft: 8,
  },
  outerContainerStyle: {},
  disabledOpacityStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.ORANGE,
    borderRadius: 8,
    opacity: 0.7,
  },
});

export default GenericButton;
