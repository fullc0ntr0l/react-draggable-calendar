import React, { Component } from 'react';
import PropTypes from 'prop-types';
import momentjs from 'moment';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Header from './Header';
import Unscheduled from './Unscheduled';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';

import './utils/wheelEventListener';

import './index.css';

class Calendar extends Component {
  static propTypes = {
    views: PropTypes.arrayOf(PropTypes.string),
    defaultView: PropTypes.oneOf(['month', 'week']),
    unscheduled: PropTypes.arrayOf(PropTypes.object),
    posts: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    views: ['month', 'week'],
    defaultView: 'month',
    unscheduled: [],
    posts: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      calendarView: props.defaultView,
      currentDate: new Date(),
    };

    this.weekDays = this.getWeekDays();
  }

  getWeekDays = () => {
    const days = momentjs.weekdaysShort();
    const firstDay = days.shift();
    days.push(firstDay);
    return days;
  }

  getWeekHeader = (currentDate) => {
    const firstDayOfWeek = momentjs(currentDate).startOf('isoWeek');
    const lastDatOfWeek = momentjs(currentDate).endOf('isoWeek');

    let firstDay = '';
    let lastDay = '';

    firstDay += firstDayOfWeek.format('MMM D');
    if (firstDayOfWeek.year() !== lastDatOfWeek.year()) {
      firstDay += `, ${firstDayOfWeek.format('YYYY')}`;
    }

    if (firstDayOfWeek.month() !== lastDatOfWeek.month()) {
      lastDay += `${lastDatOfWeek.format('MMM')} `;
    }
    lastDay += lastDatOfWeek.format('D, YYYY');

    return `${firstDay} - ${lastDay}`;
  }

  getHeaderProps = () => {
    const headerProps = {};

    if (this.state.calendarView === 'month') {
      headerProps.isToday = this.isTodayMonth();
      headerProps.onDateChange = this.handleChangeMonth;
      headerProps.title = momentjs(this.state.currentDate).format('MMMM YYYY');
    } else if (this.state.calendarView === 'week') {
      headerProps.isToday = this.isTodayWeek();
      headerProps.onDateChange = this.handleChangeWeek;
      headerProps.title = this.getWeekHeader(this.state.currentDate);
    }

    return headerProps;
  }

  isTodayMonth = () => {
    const now = new Date();
    const date = this.state.currentDate;
    return now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth();
  }

  isTodayWeek = () => {
    const now = new Date();
    const date = this.state.currentDate;
    return now.getFullYear() === date.getFullYear() &&
      momentjs(now).week() === momentjs(date).week();
  }

  handleChangeMonth = monthsDifference => this.setState((state) => {
    if (monthsDifference instanceof Date) {
      return { currentDate: new Date() };
    } else if (typeof (monthsDifference) === 'number') {
      const currentDate = new Date(state.currentDate);
      currentDate.setMonth(currentDate.getMonth() + monthsDifference);
      return { currentDate };
    }
    return null;
  });

  handleChangeWeek = weekDifference => this.setState((state) => {
    if (weekDifference instanceof Date) {
      return { currentDate: new Date() };
    } else if (typeof (weekDifference) === 'number') {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() + (7 * weekDifference));
      return { currentDate };
    }
    return null;
  });

  handleChangeView = calendarView => this.setState({ calendarView });

  handleDragEnd = (result) => {
    console.log(result);
  }

  renderCalendar = () => {
    switch (this.state.calendarView) {
      case 'month':
        return (
          <MonthView
            date={this.state.currentDate}
            weekDays={this.weekDays}
            onChangeMonth={this.handleChangeMonth}
            posts={this.props.posts}
          />
        );
      case 'week':
        return (
          <WeekView
            date={this.state.currentDate}
            posts={this.props.posts}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const headerProps = this.getHeaderProps();

    return (
      <DragDropContext
        onDragEnd={this.handleDragEnd}
      >
        <Droppable
          droppableId="droppable"
        >
          {(provided, snapshot) => (
            <div className="planable-calendar">
              <div className="unscheduled-content">
                <Unscheduled
                  posts={this.props.unscheduled}
                />
              </div>
              <div
                ref={provided.innerRef}
                className="calendar-view"
              >
                <Header
                  calendarView={this.state.calendarView}
                  views={this.props.views}
                  onChangeView={this.handleChangeView}
                  {...headerProps}
                />
                {this.renderCalendar()}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Calendar;
