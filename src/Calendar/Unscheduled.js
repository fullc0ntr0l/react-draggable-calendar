import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PostChip from './PostChip';

import './Unscheduled.css';

class Unscheduled extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    posts: [],
  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="unscheduled-container">
        <div className="unscheduled-header">
          Unscheduled posts
        </div>
        <div className="chips-container">
          {this.props.posts.map(post => (
            <PostChip
              key={post._id}
              post={post}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Unscheduled;
