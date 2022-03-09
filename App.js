/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';

import EventCalendar from './src/component/calenderView/EventCalendar';
import { JSONdata } from './src/common/commonjson';

let { width } = Dimensions.get('window');

const App = () => {
 
  const _eventTapped = (event) => {
  }
  
  return (

    <View style={{ flex: 1 }}>
      <EventCalendar
        eventTapped={(event) => _eventTapped(event)}
        events={JSONdata.events}
        width={width}
        initDate={'2022-01-25'}
        formatHeader={'ddd, MMM DD'}
        scrollToFirst
        upperCaseHeader
        uppercase
        scrollToFirst={false}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
