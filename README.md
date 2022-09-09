# @cwi/react

Components for using CWI in React applications

## Setup

This component has a few peer dependencies that you need to add alongside it to your project:

- **React**: This is a React library. You need to install `react` in order to use it.
- **CWI Core**: You won't interact with CWI very much through this package. Install at least the `@cwi/core` module. You'll also probably want the `@cwi/users` package if you're building a multi-user app.

### Basic Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { UserInterface } from '@cwi/react'
import CWI from '@cwi/core'

/*
Before @cwi/react will load, a few things need to have happened:
- You must call `CWI.initialize()` and "boot" the CWI kernel
- You must somehow enstantiate `window.CWI` with a CWI kernel instance
- You must be able to provide the various callback props required by the UI

This example is taken from an Electron application using this library.
*/

const { ipcRenderer } = window.require('electron')

const getID = () => Buffer.from(
  require('crypto').randomBytes(8)
).toString('base64')
const ids = {}

ipcRenderer.on('message', (e, data) => {
  if (data.type !== 'CWI' || typeof ids[data.id] !== 'function') return
  ids[data.id](data)
})

const runCommand = (call, ...params) => {
  return new Promise((resolve, reject) => {
    const id = getID()
    ipcRenderer.invoke('message', {
      type: 'CWI',
      id,
      call
    }, ...params)
    ids[id] = data => {
      delete ids[id]
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
    ids[id] = x => cb(x.result)
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
      id = typeof cb === 'string' ? cb : Object.entries(ids).filter(x => x[1] === cb)[0][0]
      if (typeof id === 'undefined') {
        throw new Error('No id')
      }
    } catch (e) {
      throw new Error('Invalid callback ID or callback function.')
    }
    delete ids[id]
    ipcRenderer.invoke('message', {
      type: 'CWI',
      id,
      call: 'unbindCallback'
    }, name)
    return true
  }
  funcs.saveLocalSnapshot = () => runCommand('saveLocalSnapshot')
  funcs.removeLocalSnapshot = () => runCommand('removeLocalSnapshot')
  window.CWI = funcs
  window.CWI.defaults = await runCommand('getDefaults')
  window.ENV = await window.CWI.getEnv()
  window.isPackaged = await window.CWI.isElectronAppPackaged()

  // Renders the app
  ReactDOM.render(
    <UserInterface />,
    document.getElementById('root')
  )
})()
```

## The UserInterface Component

You render the UserInterface component to the root of your webpage. It allows a user to interact with the various CWI processes. You respond to `onFocusRequested` and `onFocusRemoved` by showing or hiding the CWI user interface.

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