import React from 'react';
import Toast, {BaseToast} from 'react-native-toast-message';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const toastConfig = {
  success: ({text1, ...rest}) => (
    <BaseToast
      {...rest}
      trailingIcon={null}
      style={{
        borderLeftColor: colors.ORANGE,
        height: 50,
        backgroundColor: colors.ORANGE,
        borderRadius: 5,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        fontWeight: '400',
      }}
      text1={text1}
      text2={null}
    />
  ),
  minimumBalanceerror: ({text1, ...rest}) => (
    <BaseToast
      {...rest}
      trailingIcon={null}
      leadingIcon={DANGER_ICON}
      leadingIconContainerStyle={{width: 20, marginLeft: 5}}
      style={{
        borderLeftColor: colors.DISABLED_BUTTON_COLOR,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.DISABLED_BUTTON_COLOR,
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
      text1Style={{
        textAlign: 'center',
        color: colors.TOTAL_PRICE_TEXT_COLOR,
        fontSize: 13,
        fontWeight: '400',
      }}
      text1={text1}
      text2={null}
    />
  ),
  error: ({text1, ...rest}) => (
    <BaseToast
      {...rest}
      trailingIcon={null}
      //leadingIcon={DANGER_ICON}
      leadingIconContainerStyle={{width: 20, marginLeft: 5}}
      style={{
        zIndex: 3,
        borderLeftColor: 'red',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 8,
      }}
      text1Style={{
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        fontWeight: '400',
      }}
      text1={text1}
      text2={null}
    />
  ),
};

const CustomToast = () => {
  return <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />;
};

export default CustomToast;
