import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';

import CalendarStrip from 'react-native-calendar-strip';
import { colors } from '../themes/colors';

// eslint-disable-next-line
const ActCalendar = ({}) => {
  return (
    <View>
      <CalendarStrip
        style={{ paddingTop: 10, paddingBottom: 5 }}
        selectedDate={new Date()}
        // markedDates={[
        //   {
        //     date: new Date(),
        //     dots: [{ key: 0, color: colors.primary, selectedDotColor: colors.primary }],
        //   },
        // ]}
        customDatesStyles={[
          {
            startDate: moment(),
            // dateNameStyle: { fontWeight: 'bold' },
            dateNumberStyle: { fontWeight: 'bold' },
          },
        ]}
        // highlightDateNumberStyle={{ fontWeight: 'normal' }}
        datesWhitelist={[{
          start: moment(),
          end: moment().add(0, 'days') }]}
        // calendarAnimation={{ type: 'sequence', duration: 30 }}
        calendarHeaderStyle={{ fontWeight: '300' }}
        dateNumberStyle={{ fontWeight: 'normal' }}
        daySelectionAnimation={{ type: 'background',
          duration: 200,
          highlightColor: colors.lightBlue }}
      />
    </View>
  );
};

ActCalendar.propTypes = {

}

export default ActCalendar;
