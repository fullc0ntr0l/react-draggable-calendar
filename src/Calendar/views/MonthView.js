import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import momentjs from 'moment';
import isEmpty from 'lodash/isEmpty';

import PostChip from '../PostChip';

import './MonthView.css';

class MonthView extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onChangeMonth: PropTypes.func.isRequired,
    weekDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    posts: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      // Chunked array of array of 7 day object
      days: this.getCurrentMonthDays(props),
    };
  }

  componentDidMount() {
    window.addEventListener('wheel', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};

    if (this.props.date !== nextProps.date) {
      newState.days = this.getCurrentMonthDays(nextProps);
    }

    if (!isEmpty(newState)) {
      this.setState(newState);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.handleScroll);
  }

  getDay = (d, monthDay = true) => ({
    date: new Date(d),
    weekDay: momentjs(d).format('ddd'),
    monthDay,
    posts: [],
  })

  getDaysInMonth = (d) => {
    const date = d;
    date.setDate(1);
    const month = date.getMonth();
    const days = [];
    while (date.getMonth() === month) {
      days.push(this.getDay(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getCurrentMonthDays = (p) => {
    const props = p || this.props;
    const { date, posts, weekDays } = props;
    const currentDate = new Date(date);
    const days = this.getDaysInMonth(currentDate);
    const firstDay = days[0];
    const lastDay = days[days.length - 1];

    const weekDayIndex = day => weekDays.indexOf(day);

    if (weekDayIndex(firstDay.weekDay) !== 0) {
      const dt = new Date(firstDay.date);

      do {
        dt.setDate(dt.getDate() - 1);
        days.unshift(this.getDay(dt, false));
      } while (weekDayIndex(momentjs(dt).format('ddd')) !== 0);
    }

    if (weekDayIndex(lastDay.weekDay) !== 6) {
      const dt = new Date(lastDay.date);
      do {
        dt.setDate(dt.getDate() + 1);
        days.push(this.getDay(dt, false));
      } while (weekDayIndex(momentjs(dt).format('ddd')) !== 6);
    }

    this.fillWithPosts(days, posts);

    const chunkedDays = [];
    for (let i = 0; i < days.length; i += 7) {
      chunkedDays.push(days.slice(i, i + 7));
    }

    return chunkedDays;
  }

  fillWithPosts = (days, posts) => {
    days.forEach((day) => {
      posts.forEach((post) => {
        if (post.scheduledAt) {
          if (momentjs(post.scheduledAt).isSame(day.date, 'day')) {
            day.posts.push(post);
          }
        }
      });
    });
  }

  handleScroll = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // scroll up
      this.props.onChangeMonth(-1);
    }

    if (e.deltaY > 0) {
      // scroll down
      this.props.onChangeMonth(1);
    }
  }

  render() {
    return (
      <div className="month-view-container">
        <table
          cellPadding={1}
          cellSpacing={0}
          className="month-table-container"
        >
          <thead>
            <tr>
              {this.props.weekDays.map(day => (
                <th
                  key={day}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.days.map((monthRow, i) => (
              <tr
                // eslint-disable-next-line
                key={i}
              >
                {monthRow.map(day => (
                  <td
                    key={day.weekDay}
                  >
                    <div className="cell-container">
                      <div className={cn('cell-date-header', {
                        'current-month-date': day.monthDay,
                      })}
                      >
                        {day.date.getDate()}
                      </div>
                      <div>
                        {day.posts.map(post => (
                          <PostChip
                            key={post._id}
                            post={post}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MonthView;
