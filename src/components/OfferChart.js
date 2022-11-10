import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const rectangleWidth = 12;
const circularTextRadius = 40;

const OfferChart = ({
  firstQuantity,
  secondQuantity,
  lastQuantity,
  firstDiscount,
  secondDiscount,
  lastDiscount,
  numOfOrders,
  size,
  fontSize,
  rectangleSize,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
        }}>
        {renderFirstCircle(
          firstQuantity,
          secondQuantity,
          numOfOrders,
          size,
          fontSize,
          rectangleSize,
        )}

        {renderSecondCircle(
          secondQuantity,
          lastQuantity,
          numOfOrders,
          size,
          fontSize,
          rectangleSize,
        )}

        {renderLastCircle(lastQuantity, numOfOrders, size, fontSize)}
      </View>

      <View style={styles.pricesContainerStyle}>
        <Text
          style={firstTextStyle(
            firstQuantity,
            secondQuantity,
            numOfOrders,
            fontSize,
          )}>
          {firstDiscount}€
        </Text>
        <Text
          style={secondTextStyle(
            secondQuantity,
            lastQuantity,
            numOfOrders,
            fontSize,
          )}>
          {secondDiscount}€
        </Text>
        <Text style={lastTextStyle(lastQuantity, numOfOrders, fontSize)}>
          {lastDiscount}€
        </Text>
      </View>
    </View>
  );
};

renderFirstCircle = (
  firstQuantity,
  secondQuantity,
  numOfOrders,
  size,
  fontSize,
  rectangleSize,
) => {
  if (numOfOrders < firstQuantity) {
    return (
      <>
        <OutlinedCircularText
          text={firstQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <OutlinedRectangle rectangleSize={rectangleSize} />
        <OutlinedRectangle rectangleSize={rectangleSize} />
      </>
    );
  } else if (numOfOrders >= firstQuantity && numOfOrders < secondQuantity) {
    return (
      <>
        <OrangeCircularText
          text={firstQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <FilledOrangeRectangle rectangleSize={rectangleSize} />
        <OutlinedRectangle rectangleSize={rectangleSize} />
      </>
    );
  } else if (numOfOrders >= secondQuantity) {
    return (
      <>
        <CircularText
          text={firstQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <FilledRectangle rectangleSize={rectangleSize} />
        <FilledRectangle rectangleSize={rectangleSize} />
      </>
    );
  }
};

renderSecondCircle = (
  secondQuantity,
  lastQuantity,
  numOfOrders,
  size,
  fontSize,
  rectangleSize,
) => {
  if (numOfOrders < secondQuantity) {
    return (
      <>
        <OutlinedCircularText
          text={secondQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <OutlinedRectangle rectangleSize={rectangleSize} />
        <OutlinedRectangle rectangleSize={rectangleSize} />
      </>
    );
  } else if (numOfOrders >= secondQuantity && numOfOrders < lastQuantity) {
    return (
      <>
        <OrangeCircularText
          text={secondQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <FilledOrangeRectangle rectangleSize={rectangleSize} />
        <OutlinedRectangle rectangleSize={rectangleSize} />
      </>
    );
  } else if (numOfOrders >= lastQuantity) {
    return (
      <>
        <CircularText
          text={secondQuantity}
          size={size ?? circularTextRadius}
          fontSize={fontSize}
        />
        <FilledRectangle rectangleSize={rectangleSize} />
        <FilledRectangle rectangleSize={rectangleSize} />
      </>
    );
  }
};

renderLastCircle = (lastQuantity, numOfOrders, size, fontSize) => {
  if (numOfOrders < lastQuantity) {
    return (
      <OutlinedCircularText
        text={`+${lastQuantity}`}
        size={size ?? circularTextRadius}
        fontSize={fontSize}
      />
    );
  } else {
    return (
      <OrangeCircularText
        text={`+${lastQuantity}`}
        size={size ?? circularTextRadius}
        fontSize={fontSize}
      />
    );
  }
};

firstTextStyle = (
  firstQuantity,
  secondQuantity,
  numOfOrders,
  fontSize = 12,
) => {
  if (numOfOrders < firstQuantity) {
    return [styles.grayTextStyle, {fontSize: fontSize}];
  } else if (numOfOrders >= firstQuantity && numOfOrders < secondQuantity) {
    return styles.orangeTextStyle;
  } else if (numOfOrders >= secondQuantity) {
    return [styles.LinetextStyle, {fontSize: fontSize}];
  }
};

secondTextStyle = (
  secondQuantity,
  lastQuantity,
  numOfOrders,
  fontSize = 12,
) => {
  if (numOfOrders < secondQuantity) {
    return [styles.grayTextStyle, {fontSize: fontSize}];
  } else if (numOfOrders >= secondQuantity && numOfOrders < lastQuantity) {
    return [styles.orangeTextStyle, {fontSize: fontSize}];
  } else if (numOfOrders >= lastQuantity)
    return [styles.LinetextStyle, {fontSize: fontSize}];
};

lastTextStyle = (lastQuantity, numOfOrders, fontSize = 11) => {
  if (numOfOrders < lastQuantity) {
    return [styles.grayTextStyle, {fontSize: fontSize}];
  } else {
    return [styles.orangeTextStyle, {fontSize: fontSize}];
  }
};

const FilledRectangle = ({rectangleSize}) => {
  return (
    <View
      backgroundColor={colors.DARK_GRAY}
      style={{width: rectangleSize ?? rectangleWidth, height: 4}}
    />
  );
};

const FilledOrangeRectangle = ({rectangleSize}) => {
  return (
    <View
      backgroundColor={colors.ORANGE}
      style={{width: rectangleSize ?? rectangleWidth, height: 4}}
    />
  );
};

const OutlinedRectangle = ({rectangleSize}) => {
  return (
    <View
      backgroundColor="white"
      style={{
        width: rectangleSize ?? rectangleWidth,
        height: 4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#DDDDDD',
      }}
    />
  );
};

const CircularText = ({text, size, fontSize}) => {
  return (
    <View
      style={{
        ...styles.circularContainerStyle,
        backgroundColor: colors.DARK_GRAY,
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
      backgroundColor={colors.DARK_GRAY}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: fontSize ?? 12,
          color: 'white',
          fontWeight: '500',
        }}>
        {text}
      </Text>
    </View>
  );
};

const OrangeCircularText = ({text, size, fontSize}) => {
  return (
    <View
      style={{
        ...styles.circularContainerStyle,
        backgroundColor: colors.ORANGE,
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
      backgroundColor={colors.ORANGE}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: fontSize ?? 12,
          color: 'white',
          fontWeight: '500',
        }}>
        {text}
      </Text>
    </View>
  );
};

const OutlinedCircularText = ({text, size, fontSize}) => {
  return (
    <View
      style={{
        ...styles.circularContainerStyle,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: '#DDDDDD',
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: fontSize ?? 11,
          color: colors.LIGHT_GRAY,
          fontWeight: '500',
        }}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circularContainerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  LinetextStyle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.DELIVERY_TIME_COLOR,
    textDecorationLine: 'line-through',
  },
  grayTextStyle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.DELIVERY_TIME_COLOR,
  },
  orangeTextStyle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.ORANGE,
  },
  pricesContainerStyle: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
  },
});

export default OfferChart;
