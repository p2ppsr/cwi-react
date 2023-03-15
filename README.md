# @cwi/react

The Computing with Integrity User Interface, implemented in React

## Setup

This component has a few peer dependencies that you need to add alongside it to your project:

- **React**: This is a React library. You need to install `react` in order to use it.
- **CWI Core**: Install a copy of the CWI kernel so that it can be bound to `window.CWI` before this library loads.

## Basic Usage

Before the `UserInterface` component is first rendered, a few things need to have happened within your implementation:
- You must first call `CWI.initialize()` and "boot" the CWI kernel with its snapshot MBR
- You must somehow instantiate `window.CWI` with the initialized CWI kernel instance
- The instantiated `window.CWI` version must inject the originator you want to use into all calls
- You must be able to provide the various callbacks and other props required by the UI

### Electron

Check out how the UI is [integrated within Babbage Desktop](https://github.com/p2ppsr/babbage-desktop/blob/master/src/index.js).

### Browser

Check out how the UI is [integrated within Prosperity Desktop](https://github.com/p2ppsr/prosperity/blob/master/src/index.js).

### Mobile WebView

Check out how the UI is [integrated within Hades](https://github.com/p2ppsr/hades/blob/master/src/index.js).

## The UserInterface Component

You render the UserInterface component to the root of your webpage (or within a modal), in such a way that the modal or fullscreen interface can be shown and hidden from on top of any other user interfaces. You respond to the various focus-related callbacks which are fired when the CWI kernel requires user attention. This allows a user to interact with the various CWI processes when required. The user will be returned to their previous task by the kernel when the kernel no longer requires the attention of the user.

You respond to `onFocusRequested` and `onFocusRelinquished` by showing or hiding the CWI user interface.

You provide the various props shown in the above-linked examples.

## About CWI Core

You should familiarize yourself with the `@cwi/core` package, since it's the primary interface to CWI. This package is concerned with the UI components, while `@cwi/core` deals with the actual meat and potatoes.

If you are an outside app developer or service provider working to create things with Babbage, then you want to check out the [Babbage SDK](https://projectbabbage.com/sdk) instead.

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