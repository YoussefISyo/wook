import React, {useState, useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {colors} from 'Wook_Market/src/lib/globalStyles';
import {set} from 'react-native-reanimated';

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 30,
    alignSelf: 'center',
  },
  cell: {
    width: 48,
    height: 52,
    lineHeight: 38,
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 2,
    color: colors.ORANGE,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    textAlign: 'center',
    lineHeight: 47,
    margin: 8,
  },
  focusCell: {
    backgroundColor: colors.LIGHT_ORANGE,
  },
  errorCell: {
    width: 48,
    height: 52,
    lineHeight: 38,
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 2,
    color: colors.ORANGE,
    backgroundColor: 'white',
    textAlign: 'center',
    lineHeight: 47,
    margin: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
});

const CELL_COUNT = 4;

const VerificationCodeInput = ({onValue, isError = false}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    console.log('called');
    if (isError) {
      setValue('');
    }
  }, [isError]);

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={(value) => {
        if (
          value.charAt(value.length - 1) === ' ' ||
          value.charAt(value.length - 1) === '-' ||
          value.charAt(value.length - 1) === '.' ||
          value.charAt(value.length - 1) === ','
        ) {
          return;
        }
        setValue(value);
        onValue(value);
      }}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      renderCell={({index, symbol, isFocused}) => {
        return (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        );
      }}
    />
  );
};

export default VerificationCodeInput;
