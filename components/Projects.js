/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import { SectionList, Text, View } from 'react-native';

import { Task } from './Next';

export default class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      projects: [],
      refreshing: true,
    };
  }

  componentDidMount() {
    this._fetchTracks();
  }

  _tasksToProjects(tasks) {
    let map = tasks.reduce((acc, task) => {
      if (acc[task.project]) {
        acc[task.project].push(task);
      } else {
        acc[task.project] = [task];
      }
      return acc;
    }, {});
    
    let projects = Object.keys(map).sort().map(key => ({key, data: map[key]}));
    console.log('projects:', projects);
    return projects;
  }

  _fetchTracks() {
    console.log('Fetching tracks in da projectz');
    this.setState({refreshing: true})
    fetch('https://'+this.props.server+'/api/v2/tasks/', {
      mode: 'cors',
      headers: {'Authorization': 'Token ' + this.props.apiToken},
    })
      .then(res => {
        if (res.ok) return res.json();
        throw 'Error fetching tracks: ' + res.status;
      })
      .then(tasks => this.setState({projects: this._tasksToProjects(tasks), refreshing: false}))
      .catch(err => console.error(err));
  }

  _markTaskDone(task) {
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.id+'/', {
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
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.id+'/start/', {
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
    fetch('https://'+this.props.server+'/api/v2/tasks/'+task.id+'/stop/', {
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
      <View>
        <SectionList
          renderItem={({item, index, section}) => <Task
                                                    startTask={this._startTask.bind(this)}
                                                    stopTask={this._stopTask.bind(this)}
                                                    markDone={this._markTaskDone.bind(this)}
                                                    project={section}
                                                    val={item} />}
          renderSectionHeader={({section: {key}}) => (
            <Text style={{fontWeight: 'bold'}}>{key}</Text>
          )}
          onRefresh={() => this._fetchTracks()}
          refreshing={this.state.refreshing}
          sections={this.state.projects}
          keyExtractor={(item, i) => item.id}
        />
      </View>
    );
  }
}
