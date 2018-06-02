/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { SET_API_TOKEN, SET_SERVER } from '../actions';

const settings = (state = {}, action) => {
  switch (action.type) {
  case SET_API_TOKEN:
    return Object.assign({}, state, {apiToken: action.apiToken});
  case SET_SERVER:
    return Object.assign({}, state, {server: action.server});
  default:
    console.log("Unimplemented action:", action.type);
    return state;
  }
}

export default settings;
