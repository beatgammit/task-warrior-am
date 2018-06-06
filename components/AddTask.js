/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';

import { Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

const defaultState = {
  description: '',
  project: null,
  // TODO: implement priority
  // priority: null,
  // TODO: implement due
  // due: null,
  // TODO: implement dependencies
  // depends: null,
  // TODO: implement tags
  // tags: null,
  // TODO: implement wait and until
  // wait: null,
  // until: null,
  // TODO: implement scheduled
  // scheduled: null,
};

export default class AddTask extends React.Component {
  constructor() {
    super();

    this.state = Object.assign({}, defaultState);
  }

  // TODO: this should probably be passed in
  _addTask() {
    fetch('https://'+this.props.server+'/api/v2/tasks/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Token ' + this.props.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then(res => {
        console.log('add task:', res.status);
        if (res.ok) {
          this.setState(defaultState);
          return;
        }
        throw 'Error adding task: ' + res.status;
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View>
        <TextInput
          onChangeText={description => this.setState({description})}
          placeholder="Task description..."
          value={this.state.description}
        />

        <Text>Project:</Text>
        <TextInput
          onChangeText={project => this.setState({project})}
          placeholder="Project..."
          value={this.state.project}
        />

        <Button title="Cancel" onPress={() => this.props.navigation.goBack()}></Button>
        <Button title="Add" disabled={this.state.description === ''} onPress={() => this._addTask()}></Button>
      </View>
    );
  }
}
