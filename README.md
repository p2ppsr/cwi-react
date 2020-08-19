# React CWI

Components for using CWI in React applications

## Overview

You can use this library to easily incorporate CWI into any React application.

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

## Components

The library exports various components to help you build your applications:

Name                 | Description
---------------------|---------------------------
CWIComponents        | Bundles together the CWI components. Calls the initialize function with the provided config.
CWIRoutes            | Exports the various CWI routes.

### Aggregate Components and Routes

### 

## Accessing the Authentication Library

You can import and use the authentication library as follows:

```js
import { getPrimaryKey } from '@p2ppsr/react-cwi/auth'
```

## Demo Project

## Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC. 
Except as provided for in your partnership agreement with us, you may not use this software and 
must keep it confidential.