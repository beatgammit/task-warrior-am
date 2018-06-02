/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const SET_API_TOKEN = 'SET_API_TOKEN';
export const SET_SERVER = 'SET_SERVER';

export const setApiToken = apiToken => ({type: SET_API_TOKEN, apiToken})
export const setServer = server => ({type: SET_SERVER, server})
