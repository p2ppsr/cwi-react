# React CWI

Components for using CWI in React applications

### Basic Usage

```js
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { CWIRoutes, CWIComponents } from '@p2ppsr/react-cwi'

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

## Requirements

Currently, we require that you use `react-router` and `react-router-dom` in your project. We define several routes in your application, discussed below.

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
mainPage        | Specify the page where users should be sent after they log in with CWI
planariaToken   | Specify the Planaria token that will be used to interact with the blockchain. Obtain a token from [token.planaria.network](https://token.planaria.network)
secretServerURL | Specify the CWI secret server to use. You should ignore this unless you have specific permission and instructions from us to do otherwise.
commissions     | Specify an array of commissions for your application

### CWIRoutes

Put this at the bottom of your React Router `Switch`, right before your default ("404") route.

It will install the various `<Route />` components that are used by the CWI pages.

CWI is responsible for the following routes (page names for use in the `routes` prop are in bold on the left):

- **Greeter** (default /), where your App Logo will be shown and where users can log in or sign up with CWI
- **Recovery** (default /recovery), where users can get back into their CWI accounts
- **RecoveryLostPassword** (default /recovery/lost-password), where users can reset their passwords
- **RecoveryLostPhone** (default /recovery/lost-phone), where users can reset their phone numbers
- **Change** (default /change) where users can change and manage their login details
- **ChangePassword** (default /change/password), where users can change their passwords
- **ChangePhone** (default /change/phone), where users can change their phone numbers
- **ChangeRecoveryKey** (default /change/recovery-key), where users can view or change their recovery recovery keys

#### Props

Name   | Description
-------|----------------------
routes | An object mapping page names to paths

## Accessing the Authentication Library

You can import and use the [authentication library](https://npm-registry.babbage.systems/-/web/detail/@p2ppsr/cwi-auth) as follows:

```js
import { getPrimaryKey } from '@p2ppsr/react-cwi/auth'
```

There is no need to install a separate version of the authentication library when you use this package.

## Demo Project

Convo is a decentralized, secure messaging application built with `react-cwi`. Check out the [website](https://convo.babbage.systems) or ask for a copy of the code!

## Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC. 
Except as provided for in your partnership agreement with us, you may not use this software and 
must keep it confidential.