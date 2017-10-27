import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import momentjs from 'moment';

import PostChip from '../PostChip';

import './WeekView.css';

class WeekView extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    posts: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      days: this.getWeekDays(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (this.props.date !== nextProps.date) {
      newState.days = this.getWeekDays(nextProps);
    }

    if (!isEmpty(newState)) {
      this.setState(newState);
    }
  }

  getWeekDays = (p) => {
    const props = p || this.props;
    const { date, posts } = props;
    const days = [];
    const firstDay = momentjs(date).startOf('isoWeek');

    for (let i = 0; i < 7; i += 1) {
      days.push({
        date: firstDay.toDate(),
        weekDay: firstDay.format('ddd D/M'),
        posts: [],
      });
      firstDay.add(1, 'day');
    }

    this.fillWithPosts(days, posts);

    return days;
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

  render() {
    return (
      <div className="week-view-container">
        <table className="week-table-container">
          <thead>
            <tr>
              {this.state.days.map(day => (
                <th key={day.weekDay}>
                  {day.weekDay}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {this.state.days.map(day => (
                <td key={day.weekDay}>
                  {day.posts.map(post => (
                    <PostChip
                      key={post._id}
                      post={post}
                    />
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default WeekView;
