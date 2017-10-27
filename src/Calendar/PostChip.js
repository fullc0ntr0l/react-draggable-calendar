import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

import './PostChip.css';

const getItemStyle = (draggableStyle, isDragging) => ({
  ...draggableStyle,
});

class PostChip extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    if (!this.props.post) return null;

    const { post } = this.props;

    return (
      <Draggable
        draggableId={post._id}
      >
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              style={getItemStyle(
                provided.draggableStyle,
                snapshot.isDragging,
              )}
              {...provided.dragHandleProps}
            >
              <div className="postchip-container">
                <div className={cn('post-status', {
                  'post-status-approved': post.approved,
                })}
                />
                <div className="post-container">
                  <div className="post-title">
                    {post.plainText || post.mediaType}
                  </div>
                </div>
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

export default PostChip;
