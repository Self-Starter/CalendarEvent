/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';

import EventCalendar from './src/component/calenderView/EventCalendar';
import { JSONdata } from './src/common/commonjson';
import moment from 'moment';

let { width } = Dimensions.get('window');

const App = () => {
  const currentdate = moment(new Date()).format('YYYY-MM-DD')
 
 const [eventlist, setEventList] = useState([])

  useEffect(() => {
    setEventList([
      {
        start: '2022-01-01 00:00:00',
        end: '2022-01-01 02:00:00',
        title: 'New Year Party',
        summary: 'xyz Location',
      },
      {
        start: '2022-01-01 01:00:00',
        end: '2022-01-01 02:00:00',
        title: 'New Year Wishes',
        summary: 'Call to every one',
      },
      {
        start: '2022-01-02 00:30:00',
        end: '2022-01-02 01:30:00',
        title: 'Parag Birthday Party',
        summary: 'Call him',
      },
      {
        start: '2022-01-03 01:30:00',
        end: '2022-01-03 02:20:00',
        title: 'My Birthday Party',
        summary: 'Lets Enjoy',
      },
      {
        start: '2022-02-04 04:10:00',
        end: '2022-02-04 04:40:00',
        title: 'Engg Expo 2020',
        summary: 'Expoo Vanue not confirm',
      },
    ])
  },[])

  const _eventTapped = (event) => {
  } 
  
  return (

    <View style={{ flex: 1 }}>
      <EventCalendar
        eventTapped={(event) => _eventTapped(event)}
        events={eventlist}
        width={width}
        initDate={'2022-01-01'}
        formatHeader={'ddd, MMM DD'}
        scrollToFirst
        upperCaseHeader
        uppercase
        scrollToFirst={false}
        totalStudyHr={2}
        totalFreeHr={1}
        onSettingsPress={() => {}}
        totalTask={[1]}
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