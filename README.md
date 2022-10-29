# @cwi/react

Components for using CWI in React applications

## Setup

This component has a few peer dependencies that you need to add alongside it to your project:

- **React**: This is a React library. You need to install `react` in order to use it.
- **CWI Core**: You won't interact with CWI very much through this package. Install at least the `@cwi/core` module. You'll also probably want the `@cwi/users` package if you're building a multi-user app.

## Basic Usage

Before @cwi/react will load, a few things need to have happened:
- You must first call `CWI.initialize()` and "boot" the CWI kernel with its snapshot MBR
- You must somehow instantiate `window.CWI` with the initialized CWI kernel instance
- You must be able to provide the various callbacks and other props required by the UI

### Electron

This example is taken from an Electron application using this library.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { UserInterface } from '@cwi/react'
const { ipcRenderer } = window.require('electron')

const getID = () => Buffer.from(
  require('crypto').randomBytes(8)
).toString('base64')
const callbackIDs = {}

ipcRenderer.on('message', (e, data) => {
  if (data.type !== 'CWI' || typeof callbackIDs[data.id] !== 'function') return
  callbackIDs[data.id](data)
})

const runCommand = (call, ...params) => {
  return new Promise((resolve, reject) => {
    const id = getID()
    ipcRenderer.invoke('message', {
      type: 'CWI',
      id,
      call
    }, ...params)
    callbackIDs[id] = data => {
      delete callbackIDs[id]
      if (data.status === 'error') {
        if (data.err instanceof Error) {
          reject(data.err)
        } else {
          reject(new Error(data.err.message))
        }
      } else {
        resolve(data.result)
      }
    }
  })
}

(async () => {
  const names = await runCommand('listFunctions')
  const funcs = {}
  names.forEach(x => {
    if (x.indexOf('.') === -1) {
      funcs[x] = (...params) => runCommand(x, ...params)
    } else {
      const [obj, func] = x.split('.')
      if (typeof funcs[obj] === 'undefined') funcs[obj] = {}
      funcs[obj][func] = (...params) => runCommand(x, ...params)
    }
  })
  funcs.bindCallback = (name, cb) => {
    const id = getID()
    callbackIDs[id] = x => cb(x.result)
    ipcRenderer.invoke('message', {
      type: 'CWI',
      id,
      call: 'bindCallback'
    }, name)
    return id
  }
  funcs.unbindCallback = (name, cb) => {
    let id
    try {
      // If unbindCallback referenced a function pointer instead of an ID, the ID needs to be rediscovered by finding the right function.
      id = typeof cb === 'string' ? cb : Object.entries(callbackIDs).filter(x => x[1] === cb)[0][0]
      if (typeof id === 'undefined') {
        throw new Error('No id')
      }
    } catch (e) {
      throw new Error('Invalid callback ID or callback function.')
    }
    delete callbackIDs[id]
    ipcRenderer.invoke('message', {
      type: 'CWI',
      id,
      call: 'unbindCallback'
    }, name)
    return true
  }
  window.CWI = funcs
  const env = await runCommand('getEnv')
  const isPackaged = await runCommand('isElectronAppPackaged')
  const appVersion = await runCommand('getElectronAppVersion')

  // Renders the app
  ReactDOM.render(
    <UserInterface
      onFocusRequested={() => runCommand('requestFocus')}
      onFocusRelinquished={() => runCommand('relinquishFocus')}
      isFocused={() => runCommand('isFocused')}
      saveLocalSnapshot={() => runCommand('saveLocalSnapshot')}
      removeLocalSnapshot={() => runCommand('removeLocalSnapshot')}
      env={env}
      isPackaged={isPackaged}
      appName='Babbage Desktop'
      appVersion={appVersion}
    />,
    document.getElementById('root')
  )
})()
```

### Browser

Here's how you might go about running this in a browser app:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { UserInterface } from '@cwi/react'
import CWI from '@cwi/core'

// [TODO] This is not yet complete.

(async () => {
  window.CWI = CWI
  await CWI.initialize()
  ReactDOM.render(
    <UserInterface
      appName='Prosperity Desktop'
      appVersion='0.1.0'
    />,
    document.getElementById('root')
  )
})()
```

## The UserInterface Component

You render the UserInterface component to the root of your webpage. It allows a user to interact with the various CWI processes.

You respond to `onFocusRequested` and `onFocusRelinquished` by showing or hiding the CWI user interface.

You provide the various props shown in the example.

## About CWI Core

You should familiarize yourself with the `@cwi/core` package, since it's the primary interface to CWI. This package is concerned with the UI components, while `@cwi/core` deals with the actual meat and potatoes.

If you are an outside app developer or service provider workin to create things with Babbage, then you want to check out the [Babbage SDK](https://projectbabbage.com/sdk) instead.

## Development

> Use these instructions if you've been given access to source code in order to contribute to @cwi/react.

To set up for development, pull down the repo and do the following:

```bash
npm install
```

Then, each time you want to spin up the environment, `npm link` this project, move to the place where you are implementing `@cwi/react`, then run `npm link @cwi/react`, and spin up your development environment.

## Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC. 
Except as provided for in your CWI Partner Agreement with us, you may not use this software and 
must keep it confidential.