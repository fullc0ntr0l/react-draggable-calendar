import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './Header.css';

class Header extends Component {
  static propTypes = {
    calendarView: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string),
    onChangeView: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    isToday: PropTypes.bool.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    views: [],
    title: '',
  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleChangeCalendarView = ({ target }) => this.props.onChangeView(target.name);

  handleBackMonth = () => this.props.onDateChange(-1);

  handleNextMonth = () => this.props.onDateChange(1);

  handleChangeToday = () => this.props.onDateChange(new Date());

  render() {
    return (
      <div className="calendar-header">
        <div className="header-navigate-buttons">
          <button
            className="btn btn-sm today-button"
            onClick={this.handleChangeToday}
            disabled={this.props.isToday}
          >
            Today
          </button>
          <div className="btn-group">
            <button
              className="btn btn-sm"
              onClick={this.handleBackMonth}
            >
              back
            </button>
            <button
              className="btn btn-sm"
              onClick={this.handleNextMonth}
            >
              next
            </button>
          </div>
        </div>
        <div className="header-current-period">
          {this.props.title}
        </div>
        <div className="header-view-buttons">
          <div className="btn-group">
            {this.props.views.map((view) => {
              const isActive = view === this.props.calendarView;
              let onClick;

              if (!isActive) onClick = this.handleChangeCalendarView;

              return (
                <button
                  name={view}
                  key={view}
                  onClick={onClick}
                  className={cn('btn', 'btn-sm', {
                    'btn-primary': isActive,
                  })}
                >
                  {view}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
