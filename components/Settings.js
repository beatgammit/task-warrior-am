/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';


const defaultState = {
  apiToken: null,
  server: 'inthe.am',
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor() {
    super();

    this.state = defaultState;
  }

  resetState() {
    this.setState(defaultState);
  }

  getProp(name) {
    return this.state[name] === null ? this.props[name] : this.state[name];
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text>API Token:</Text>
        <TextInput
            style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({apiToken: text})}
            onEndEditing={() => {
              this.props.apiTokenChanged(this.state.apiToken);
              this.resetState();
            }}
            value={this.getProp('apiToken')}
        />
        <Text>Server:</Text>
        <TextInput
            style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
            placeholder="inthe.am"
            onChangeText={(text) => this.setState({server: text})}
            onEndEditing={() => {
              this.props.serverChanged(this.state.server);
              this.resetState();
            }}
            value={this.getProp('server')}
        />
      </View>
    );
  }
}

export default SettingsScreen;
