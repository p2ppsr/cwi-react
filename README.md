# @cwi/react

Components for using CWI in React applications

## Setup

This component has a few peer dependencies that you need to add alongside it to your project:

- **React**: This is a React library. You need to install `react` in order to use it.
- **React Router**: We'll define a few routes in your app. In order to do this, you'll need to install `react-router` and `react-router-dom`, and use it for routing.
- **CWI Core**: You won't interact with CWI very much through this package. Install at least the `@cwi/core` module. You'll also probably want the `@cwi/users` package if you're building a multi-user app.

### Basic Usage

```js
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { CWIRoutes, CWIComponents } from '@cwi/react'

export default () => (
  <Router>
    <CWIComponents
      mainPage='/dashboard'
    />
    <Switch>
      <Route path='/dashboard' component={Dashboard} />
      <CWIRoutes />
    </Switch>
  </Router>
)
```

## Components

Name                 | Description
---------------------|---------------------------
CWIComponents        | Bundles together the CWI components. Calls the initialize function with the provided config.
CWIRoutes            | Exports the various CWI routes and pages.

### CWIComponents

This component is the main entry point for the library. It should be rendered outside your `Router` to avoid unmounting.

#### Props

Name            | Description
----------------|---------------------
mainPage        | The page where users should be sent after they log in with CWI
planariaToken   | The Planaria token that will be used to interact with the blockchain. Obtain a token from [token.planaria.network](https://token.planaria.network)
secretServerURL | The CWI secret server to use. You should ignore this unless you have specific permission and instructions from us to do otherwise.
commissions     | An array of commissions for your application
logoURL         | The URL to your app's logo image. We recommend making it a square.

### CWIRoutes

Put this at the bottom of your React Router `Switch`, right before your default ("404") route.

It will install the various `<Route />` components that are used by the CWI pages.

CWI is responsible for the following routes (page names for use in the `routes` prop are in bold on the left):

- **Greeter** (default /), where your App Logo will be shown and where users can log in or sign up with CWI
- **Recovery** (default /recovery), where users can get back into their CWI accounts
- **RecoveryLostPassword** (default /recovery/lost-password), where users can reset their passwords
- **RecoveryLostPhone** (default /recovery/lost-phone), where users can reset their phone numbers
- **Settings** (default /cwi-settings) where users can change and manage their login details
- **PasswordSettings** (default /cwi-settings/password), where users can change their passwords
- **PhoneSettings** (default /cwi-settings/phone), where users can change their phone numbers
- **RecoveryKeySettings** (default /cwi-settings/recovery-key), where users can view or change their recovery recovery keys

#### Props

Name   | Description
-------|----------------------
routes | An object mapping page names to paths

## About CWI Core

You should familiarize yourself with the `@cwi/core` package, since it's the primary interface to CWI. This package is concerned with the UI components, while `@cwi/core` deals with the actual meat and potatoes.

## Changing the Redirect URL

To dynamically change where the user is redirected after authenticating with CWI, set a relative path in `sessionStorage.redirect`. Instead of being taken to `mainPage`, the user will be taken to this path.

## Logging Out

We persist the user's session with local storage. To log the user out:

- Call the `logout` function from `@cwi/react/auth`
- Run `delete localStorage.CWIAuthStateSnapshot`
- Reset your app to its initial state
- Go to the Greeter route (default: `/`)

## Demo Project

Convo is a decentralized, secure messaging application built with `@cwi/core` and `@cwi/react`. Check out the [website](https://convo.babbage.systems) or ask for a copy of the code!

## Development

> Use these instructions if you've been given access to source code in order to contribute to @cwi/react.

To set up for development, pull down the repo and do the following:

```bash
npm install
cd example
npm install
```

Then, each time you want to spin up the environment, open two terminal tabs.

In the first one, just run `npm run dev`.

In the second one, run `cd example && npm run start` to spin up the development server.

Hot reloading should be supported by this setup.

## Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC. 
Except as provided for in your CWI Partner Agreement with us, you may not use this software and 
must keep it confidential.