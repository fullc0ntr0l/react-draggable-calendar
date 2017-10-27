import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Calendar from './Calendar';

import posts from './posts';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts,
    };
  }

  getUnscheduledPosts = () => this.state.posts.filter(p => !p.scheduledAt);

  getScheduledPost = () => this.state.posts.filter(p => !!p.scheduledAt);

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="calendar-container">
          <Calendar
            unscheduled={this.getUnscheduledPosts()}
            posts={this.getScheduledPost()}
          />
        </div>
      </div>
    );
  }
}

export default App;
