/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation';

import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  task: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#555',
    minHeight: 50,
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 20,
    color: '#ccc',
  },
  taskDetails: {
    fontSize: 16,
    color: '#ccc',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  doneButton: {
    color: '#f33',
  },
  deleteButton: {
    color: '#f00',
  },
  startStopButton: {
    color: '#0f0',
  },
});

export default class NextScreen extends React.Component {
  constructor() {
    super();
    console.log('props:', this.props);
    this.state = {
      tasks: [],
      refreshing: true,
    };
  }
  
  componentDidMount() {
    this._fetchTracks();
  }

  _fetchTracks() {
    console.log('Fetching tracks');
    this.setState({refreshing: true})
    fetch('https://'+this.props.server+'/api/v2/tasks/', {
      mode: 'cors',
      headers: {'Authorization': 'Token ' + this.props.apiToken},
    })
      .then(res => {
        if (res.ok) return res.json();
        throw 'Error fetching tracks: ' + res.status;
      })
      .then(tasks => this.setState({tasks, refreshing: false}))
      .catch(err => console.error(err));
  }

  _markTaskDone(task) {
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.uuid+'/', {
      method: 'DELETE',
      mode: 'cors',
      headers: {'Authorization': 'Token ' + this.props.apiToken},
    })
      .then(res => {
        if (res.ok) return this._fetchTracks();
        throw 'Error marking task done: ' + res.status;
      })
      .catch(err => console.error(err));
  }
  
  _startTask(task) {
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.uuid+'/start/', {
      method: 'POST',
      mode: 'cors',
      headers: {'Authorization': 'Token ' + this.props.apiToken},
    })
      .then(res => {
        console.log('start task:', res.status);
        if (res.ok) return this._fetchTracks();
        throw 'Error starting task: ' + res.status;
      })
      .catch(err => console.error(err));
  }

  _stopTask(task) {
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.uuid+'/stop/', {
      method: 'POST',
      mode: 'cors',
      headers: {'Authorization': 'Token ' + this.props.apiToken},
    })
      .then(res => {
        console.log('stop task:', res.status);
        if (res.ok) return this._fetchTracks();
        throw 'Error stopping task: ' + res.status;
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <FlatList
        data={this.state.tasks.sort((a, b) => a.urgency - b.urgency)}
        keyExtractor={(item, i) => item.id}
        onRefresh={() => this._fetchTracks()}
        refreshing={this.state.refreshing}
        renderItem={({item}) => <Task
                                  startTask={this._startTask.bind(this)}
                                  stopTask={this._stopTask.bind(this)}
                                  markDone={this._markTaskDone.bind(this)}
                                  val={item} />}
      />
    );
  }
}

function dateDiff(start, end = Date.now()) {
  console.log('Diffing:', start, end);
  return moment.duration(end - start).humanize();
}

class Task extends React.Component {
  constructor() {
    super();
    this.state = {expanded: false};
  }

  _extraInfoLine(task) {
    if (this.state.expanded) {
      return (
        <View>
          <Text style={styles.taskDetails}>Urgency: {task.urgency}</Text>
          <Text style={styles.taskDetails}>Age: {dateDiff(Date.parse(task.entry))}</Text>
          {Array.isArray(task.tags) && task.tags.length > 0 && (
            <Text style={styles.taskDetails}>Tags: {task.tags.join(', ')}</Text>
          )}
          {task.project && (
            <Text style={styles.taskDetails}>Project: {task.project}</Text>
          )}
        </View>
      );
    }
    return null;
  }

  _buttons(task) {
    if (this.state.expanded && task.status === "pending") {
      return (
        <View style={styles.buttonsContainer}>
          {task.start ? (
              <Button
                style={styles.startStopButton}
                onPress={() => this.props.stopTask(task)}
                title="Stop"
                accessibilityLabel={"Stop Task - " + task.description}
              />
            ) : (
              <Button
                style={styles.startStopButton}
                onPress={() => this.props.startTask(task)}
                title="Start"
                accessibilityLabel={"Start Task - " + task.description}
              />
            )
          }

          <Button
            style={styles.doneButton}
            onPress={() => this.props.markDone(task)}
            title="Done"
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const task = this.props.val;

    return (
      <TouchableNativeFeedback onPress={() => this.setState({expanded: !this.state.expanded})}>
        <View style={styles.task}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.taskTitle}>{task.description}</Text>
          </View>
          {this._extraInfoLine(task)}
          {this._buttons(task)}
        </View>
      </TouchableNativeFeedback>
    );
  }
}
