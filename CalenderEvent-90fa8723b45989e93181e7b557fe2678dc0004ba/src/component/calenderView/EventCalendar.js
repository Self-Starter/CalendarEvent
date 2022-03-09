// @flow
import {
  VirtualizedList,
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import styleConstructor from './style';
import DayView from './DayView';
import NavbarView from './NavbarView';

const width = Dimensions.get('window').width;

export default class EventCalendar extends Component {
  constructor(props) {
    super(props);

    const start = props.start ? props.start : 0;
    const end = props.end ? props.end : 24;

    this.styles = styleConstructor(props.styles, (end - start) * 100);
    this.state = {
      date: moment(this.props.initDate),
      index: this.props.size,
      eventData: this.props.events
    };
  }

  componentDidUpdate(prevProps) {
    if ( this.props.events !== prevProps.events ) {
      this.setState({eventData: this.props.events})
  }
   
  }
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  static defaultProps = {
    size: 30,
    initDate: new Date(),
    formatHeader: 'DD MMMM YYYY',
  };

  _getItemLayout(data, index) {
    const { width } = this.props;
    return { length: width, offset: width * index, index };
  }

  _getItem(events, index) {
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );
    return _.filter(events, event => {
      const eventStartTime = moment(event.start);
      return (
        eventStartTime >= date.clone().startOf('day') &&
        eventStartTime <= date.clone().endOf('day')
      );
    });
  }

  _renderItem({ index, item }) {
    const {
      width,
      format24h,
      initDate,
      scrollToFirst = true,
      start = 0,
      end = 24,
      formatHeader,
      upperCaseHeader = false,
    } = this.props;
    const date = moment(initDate).add(index - this.props.size, 'days');

    let headerText =
      // upperCaseHeader
      //   ? date.format(formatHeader || 'DD MMMM YYYY').toUpperCase(): 
      date.format(formatHeader || 'DD MMMM YYYY');

    return (
      <View key={index} style={[this.styles.container, { width }]}>
        <NavbarView
          styles={this.styles}
          headerText={headerText}
          totalTask={this.props.totalTask}
          totalFreeHr={this.props?.totalFreeHr}
          totalStudyHr={this.props?.totalStudyHr}
          onTodayDate={() => this._goToDate(this.props?.initDate)}
          onSettingsPress={() => this.props?.onSettingsPress()}
        />
        <DayView
          date={date}
          index={index}
          format24h={format24h}
          formatHeader={this.props.formatHeader}
          headerStyle={this.props.headerStyle}
          renderEvent={this.props.renderEvent}
          eventTapped={this.props.eventTapped}
          events={item}
          width={width}
          styles={this.styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}
        />
        
      </View>
    );
  }

  
  _goToPage(index) {
    if (index <= 0 || index >= this.props.size * 2) {
      return;
    }
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );
    this.refs.calendar.scrollToIndex({ index, animated: true });
    this.setState({ index, date });
  }

  _goToDate(date) {
    const earliestDate = moment(this.props.initDate).subtract(
      this.props.size,
      'days'
    );
    const index = moment(date).diff(earliestDate, 'days');
    this._goToPage(index);
  }

  _previous = () => {
    this._goToPage(this.state.index - 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index - 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }
  };

  _next = () => {
    this._goToPage(this.state.index + 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index + 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }
    console.log('date....', this.state.date)
  };

  render() {
    const {
      width,
      virtualizedListProps,
      events,
      initDate,
    } = this.props;

    return (
      <View style={[this.styles.container, { width }]}>
        <VirtualizedList
          ref="calendar"
          windowSize={2}
          extraData={this.props.initDate}
          initialNumToRender={2}
          initialScrollIndex={this.props.size}
          data={this.state.eventData}
          getItemCount={() => this.props.size * 2}
          getItem={this._getItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={this._getItemLayout.bind(this)}
          horizontal
          pagingEnabled
          renderItem={this._renderItem.bind(this)}
          style={{ width: width }}
          onMomentumScrollEnd={event => {
            const index = parseInt(event.nativeEvent.contentOffset.x / width);
            const date = moment(this.props.initDate).add(
              index - this.props.size,
              'days'
            );
            if (this.props.dateChanged) {
              this.props.dateChanged(date.format('YYYY-MM-DD'));
            }
            this.setState({ index, date });
          }}
          {...virtualizedListProps}
        />
      </View>
    );
  }
}
