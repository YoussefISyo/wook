import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {_} from 'Wook_Market/src/lang/i18n';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const GenericError = ({errorText, onRetry, style}) => {
  return (
    <View style={[{alignItems: 'center'}, style]}>
      <Text style={styles.errorTextStyle}>{errorText}</Text>
      <TouchableOpacity
        style={{padding: 10}}
        activeOpacity={0.8}
        onPress={onRetry}>
        <Text style={{color: colors.ORANGE, fontSize: 16}}>
          {_('main.retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorTextStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default GenericError;
