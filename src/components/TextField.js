import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const TextFeild = (props) => {
  var defaultStyle = {
    width: '100%',
    height: 44,
    backgroundColor: '#FFF',
    borderBottomWidth: props.error || props.errorWithoutText ? 1 : 1,
    borderBottomColor:
      props.error || props.errorWithoutText ? 'red' : '#828282',
    paddingHorizontal: 16,
    paddingRight: props.rightIcon
      ? 32
      : props.loading ||
        props.euro ||
        props.present ||
        props.euroRight ||
        props.wheight
      ? 32
      : 16,
    paddingLeft: props.leftIcon ? 32 : props.leftNumber ? 24 : 16,
    color: '#000',
    fontSize: 14,
  };

  var errorStyle = {
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 10,
    minHeight: 20,
    paddingStart: 10,
    paddingTop: 3,
    marginBottom: -20,
  };

  var iconStyle = {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  };

  var iconContainerStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: props.label ? 26 : 1,
    right: 1,
    width: 42,
    height: 42,
  };

  var labelStyle = {
    fontSize: 14,
    height: 20,
    color: '#9E9E9E',
    marginBottom: 5,
    marginStart: 4,
  };

  var loadingContainerStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 1,
    right: 1,
    width: 42,
    height: 42,
  };

  var style =
    props.style && props.style.length
      ? props.style.reduce(function (s0, s) {
          return {...s0, ...s};
        })
      : props.style;
  style = {...defaultStyle, ...style};
  ({color, fontSize, fontWeight} = style);

  return (
    <View
      style={[{width: '100%', flexDirection: 'column'}, props.containerStyle]}>
      {props.label ? (
        <Text style={[labelStyle, props.labelStyle]}>{props.label}</Text>
      ) : null}
      <TextInput
        {...props}
        textAlign={I18nManager.isRTL ? 'right' : 'left'}
        style={[style, props.inputStyle]}
        placeholderTextColor="#BDBDBD"
        ref={props.cref}
        onBlur={() => {
          props.onBlur && props.onBlur();
          // setIsFocused(false);
        }}
        onFocus={() => {
          props.onFocus && props.onFocus();
          // setIsFocused(true);
        }}
      />

      {props.leftIcon ? (
        <View style={[iconContainerStyle, {left: 1, width: 32}]}>
          <Image
            style={[iconStyle, props.leftIconStyle]}
            source={props.leftIcon}
          />
        </View>
      ) : null}
      {props.rightIcon ? (
        <TouchableOpacity
          style={iconContainerStyle}
          onPress={props.rightIconPress}>
          <Image
            style={[iconStyle, props.rightIconStyle]}
            source={props.rightIcon}
          />
        </TouchableOpacity>
      ) : null}
      {props.loading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator size="small" color={colors.DELIVERY_TIME_COLOR} />
        </View>
      ) : props.wheight ? (
        <View style={[loadingContainerStyle]}>
          <Text style={{color: '#808080'}}>kg</Text>
        </View>
      ) : null}
      <Text style={[errorStyle, props.errorStyle]}>{props.error}</Text>
    </View>
  );
};

export default TextFeild;
