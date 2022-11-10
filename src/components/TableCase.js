import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const TableCase = ({top, bottom, style}) => {
  return (
    <View style={[style]}>
      <Text style={styles.caseTopTextStyle}>{top}</Text>
      <Text style={styles.caseBottomTextStyle}>{bottom}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  caseTopTextStyle: {
    textAlign: 'center',
    marginTop: 11,
    marginHorizontal: 5,
    fontSize: 12,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  caseBottomTextStyle: {
    textAlign: 'center',
    marginTop: 4,
    marginHorizontal: 5,
    marginBottom: 11,
    fontSize: 12,
    fontWeight: '400',
    color: colors.ORANGE,
  },
});

export default TableCase;
