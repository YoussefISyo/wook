import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  }
}

export function replace(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.dispatch(StackActions.replace(name, params));
  }
}
