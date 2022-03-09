// @flow
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _, { template } from 'lodash';
import { AXIS_Y, CONNECTOR_BOTTOM_RIGHT, CONNECTOR_CENTER, CONNECTOR_TOP_LEFT, DragResizeBlock, DragResizeContainer, ON_DRAG, ON_DRAG_END, ON_DRAG_START, ON_RESIZE, ON_RESIZE_END, ON_RESIZE_START } from './dragResizeBlock';

const LEFT_MARGIN = 60 - 1;
// const RIGHT_MARGIN = 10
const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

export default class DayView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.calendarHeight = (props.end - props.start) * 100;
    const width = props.width - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, props.start);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) -
      this.calendarHeight / (props.end - props.start);
    initPosition = initPosition < 0 ? 0 : initPosition;

    this.state = {
      _scrollY: initPosition,
      packedEvents,
      scrollenable: true,
      selectedEvent: null,
      drageEvent: null,
      showmin: false,
      resizeType: 'BR'
    };
  }

  componentWillReceiveProps(nextProps) {
    const width = nextProps.width - LEFT_MARGIN;
    this.setState({
      packedEvents: populateEvents(nextProps.events, width, nextProps.start),
    });
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
        });
      }
    }, 1);
  }

  _renderRedLine() {
    const offset = 100;
    const { format24h } = this.props;
    const { width, styles } = this.props;
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();
    return [
      <Text
        key={`timeLabel`}
        style={[styles.timeLabel, {
          color: 'red', left: 0, top: (offset * (timeNowHour - this.props.start) +
            (offset * timeNowMin) / 60) - 6
        }]}
      >
        {`${moment(timeNowHour).format('hh')}:${timeNowMin} ${moment().format('A')}`}
      </Text>,
      <View
        key={`timeNow`}
        style={[
          styles.lineNow,
          {
            top:
              offset * (timeNowHour - this.props.start) +
              (offset * timeNowMin) / 60,
            width: width - 20,
          },
        ]}
      />
    ];
  }

  _renderLines() {
    const { format24h, start, end } = this.props;
    const offset = this.calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = ``;
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? `12 AM` : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }
      const { width, styles } = this.props;
      return [
        <Text
          key={`timeLabel${i}`}
          style={[styles.timeLabel, { top: offset * index - 6 }]}
        >
          {timeText}
        </Text>,
        i === start ? null : (
          <View
            key={`line${i}`}
            style={[styles.line, { top: offset * index, width: width - 20 }]}
          />
        ),
        <View
          key={`lineHalf${i}`}
          style={[
            styles.line,
            { top: offset * (index + 0.5), width: width - 20 },
          ]}
        />,
      ];
    });
  }

  _renderTimeLabels() {
    const { styles, start, end } = this.props;
    const offset = this.calendarHeight / (end - start);
    return range(start, end).map((item, i) => {
      return (
        <View key={`line${i}`} style={[styles.line, { top: offset * i }]} />
      );
    });
  }

  _onEventTapped(event) {
    this.props.eventTapped(event);
    this.setState({ selectedEvent: event.index })
  }

  callEventHandler(eventTypeindex, coord, event, message) {
    // console.log('coord....', coord)
    // console.log('message....',message)
    
    this._CalcuateTime(event, coord)

    if (eventTypeindex == 0) {

      this.setState({ scrollenable: false })
    }
    else if (eventTypeindex == 1) {

      this.setState({ scrollenable: false })
    }
    else if (eventTypeindex == 4 || eventTypeindex == 3) {
   
      this.setState({ drageEvent: event.index, showmin: false, scrollenable: false })
    }
    else if (eventTypeindex == 5 || eventTypeindex == 2) {

      this.setState({ drageEvent: null, scrollenable: true, showmin: false })
    }

    this.setState({ selectedEvent: event.index })
  }

  // _onscroll(e) {
  //   var offset_y = e.nativeEvent.contentOffset.y;
  //   console.log('y....',y)
   
  // }

  _CalcuateTime(event, coord) {
    const { packedEvents } = this.state;

    let t1 = moment(event.start);
    let t2 = moment(event.end);

    var enddecimal = (coord.h + event.top) / 100;

    if (coord.y != event.top) {
      enddecimal = (event.top) / 100;
    }

    var n = new Date(0, 0);
    n.setMinutes(+Math.round(enddecimal * 60));
    const hours = n.getHours()
    const minutes = n.getMinutes();

    moment.locale('en')

    packedEvents[event.index].height = coord.h;

    if (coord.y != event.top) {
      packedEvents[event.index].top = coord.y;
      let newstartdate = `${moment(new Date(t1)).format('YYYY-MM-DD')} ${hours}:${minutes}:00`
      packedEvents[event.index].start = moment(newstartdate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    }
    else {
      let newenddate = `${moment(new Date(t2)).format('YYYY-MM-DD')} ${hours}:${minutes}:00`
      packedEvents[event.index].end = moment(newenddate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    }

    if (minutes == 30) {
      this.setState({ showmin: true })
    }
    else {
      this.setState({ showmin: false })
    }

    this.setState({ packedEvents: packedEvents })
  }

  _renderEvents() {
    const { styles } = this.props;
    const { packedEvents, drageEvent, showmin, resizeType } = this.state;
    let events = packedEvents.map((event, i) => {
      console.log('event...', event)
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        top: event.top,
      };
      const resizestyle = {
        height: '100%',
        width: '100%',
      };
      const eventColor = {
        backgroundColor: event.color,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';

      return (
        <>
          <DragResizeBlock
            x={event.left}
            y={event.top}
            w={style.width}
            h={style.height}
            isDraggable={true}
            event={event}
            axis={AXIS_Y}
            connectors={[
              CONNECTOR_TOP_LEFT,
              CONNECTOR_BOTTOM_RIGHT,
              CONNECTOR_CENTER
            ]}
            limitation={{
              x: 0,
              y: 0,
              w: Dimensions.get('window').width,
              h: Dimensions.get('window').height * 3,
            }}
            onPress={(obj) => {
              this._onEventTapped(this.props.events[event.index])
            }}
            onResizeStart={(coord) => {
              this.callEventHandler(ON_RESIZE_START, coord, event, 'onResizeStart');
            }}
            onResize={(coord, type) => {

              this.setState({ resizeType: type })
              this.callEventHandler(ON_RESIZE, coord, event, type, 'onResize');
            }}
            onResizeEnd={(coord) => {
              this.callEventHandler(ON_RESIZE_END, coord, event, 'onResizeEnd');
            }}
            onDragStart={(coord) => {

              this.callEventHandler(ON_DRAG_START, coord, event, 'onDragStart');
            }}
            onDrag={(coord) => {
              this.callEventHandler(ON_DRAG, coord, event, 'onDrag');
            }}
            onDragEnd={(coord) => {
              this.callEventHandler(ON_DRAG_END, coord, event, 'onDragEnd');
            }}
          >

            <View
              key={i}
              style={[styles.event, { zIndex: event.index,opacity: this.state.selectedEvent == event.index ? 1 : 0.5 }, resizestyle, event.color && eventColor]}
            >
              {this.props.renderEvent ? (
                this.props.renderEvent(event)
              ) : (
                <View>
                  <Text numberOfLines={1} style={styles.eventTitle}>
                    {event.title || 'Event'}
                  </Text>
                  {numberOfLines > 1 ? (
                    <Text
                      numberOfLines={numberOfLines - 1}
                      style={[styles.eventSummary]}
                    >
                      {event.summary || ' '}
                    </Text>
                  ) : null}
                  {numberOfLines > 2 ? (
                    <Text style={styles.eventTimes} numberOfLines={1}>
                      {moment(event.start).format(formatTime)} -{' '}
                      {moment(event.end).format(formatTime)}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>

            {
              (this.state.selectedEvent == event.index && showmin) ?

                <Text style={{ ...styles.timeLabel, left: -50, bottom: resizeType == 'BR' ? -10 : null, top: resizeType == 'TL' ? -10 : null }}>{': 30'}</Text>

                : null
            }


          </DragResizeBlock>
          {
            drageEvent == event.index &&

            <View

              key={i}
              style={[styles.event, { opacity: 0.5 }, style, event.color && eventColor]}
            >
              {this.props.renderEvent ? (
                this.props.renderEvent(event)
              ) : (
                <View>
                  <Text numberOfLines={1} style={styles.eventTitle}>
                    {event.title || 'Event'}
                  </Text>
                  {numberOfLines > 1 ? (
                    <Text
                      numberOfLines={numberOfLines - 1}
                      style={[styles.eventSummary]}
                    >
                      {event.summary || ' '}
                    </Text>
                  ) : null}
                  {numberOfLines > 2 ? (
                    <Text style={styles.eventTimes} numberOfLines={1}>
                      {moment(event.start).format(formatTime)} -{' '}
                      {moment(event.end).format(formatTime)}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          }

        </>

      );
    });

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>{events}</View>
      </View>
    );
  }

  render() {
    const { styles } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ selectedEvent: null })}>

        <ScrollView
          scrollEnabled={this.state.scrollenable}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          ref={ref => (this._scrollView = ref)}
          contentContainerStyle={[
            styles.contentStyle,
            { width: this.props.width },
          ]}
        >
          {this._renderLines()}
          {this._renderEvents()}
          {this._renderRedLine()}

        </ScrollView>
       </TouchableWithoutFeedback>
    );
  }
}
