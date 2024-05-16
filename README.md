# Read Me First

A neon-style website that allows you to play 2D games. The website allows you to create an account, leave a comment under each game and reply to others' comments.

## Features

* a responsive website that renders correctly on screens with widths ranging from 320px to 1440px
* three 2d games: TicTacToe, Snake, Minesweeper
* comments panel with lazy content fetching algorithm
* two color themes available
* notification system
* account creation function, user can sign in on multiple devices and sign out of a single or all sessions
* access to operations for modifying account details (username and password change)
* functionality for adding, editing and deleting comments under games
* functionality for adding, editing and deleting replies to comments
* administrator panel enabling user management - banning, unbanning, granting administrator rights
* administrator panel for managing comments and replies (deleting and editing)
* user permissions reflecting the three roles that the account can assume: user, administrator and banned
* functionality of generating a list of added comments and replies for a given account in PDF format
* communication with the server via the axios library
* tests of components, hooks and plain functions using react-testing-library and mock-service-worker

## Technologies

Let me explain why each dependency is used:

* usehooks-ts -usehooks-ts is a lightweight, type-safe, and tree-shakable React hook library written in TypeScript. It provides a collection of useful hooks that you can easily incorporate into your React applications.
* typescript -TypeScript is a syntactic superset of JavaScript that adds static typing
* react -React is a JavaScript library for building user interfaces. It is used to create single-page applications, which are web apps that load a single HTML page and dynamically update it as the user interacts with the app. React allows you to create reusable UI components, which are pieces of the UI that have their own logic and appearance. For example, you can create a button component that can be used in different parts of your app.
* react-router -React Router is a library for routing in React applications. It allows you to create multiple pages that can be accessed by different URLs, and keep the UI in sync with the browser history. React Router also supports nested routes, dynamic parameters, redirects, and other features that make web development easier and more enjoyable.
* react-testing-library -React Testing Library is a library for testing React components. It helps you write tests that resemble how a user would interact with your app, by providing methods to query the DOM elements and simulate user events. React Testing Library works with any test runner, but it is often used with Jest. The render function takes a React element and renders it into a container attached to the document. The screen object provides various methods to query the DOM, such as getByText, getByRole, getByTestId, etc. You can use these methods to find the elements you want to test, and then use Jest’s expect function to make assertions With Jest, you can run js tests that interact with the DOM using jsdom, which is fast and has many useful features such as module and timer mocks. Jest allows you to write and run your test cases as normal js code as part of your development workflow. Jsdom is a simple browser emulator that works within Node.js.
* msw - MSW is an API mocking library that allows you to write client-agnostic mocks and reuse them across any frameworks, tools, and environments1. It works by intercepting requests using the Service Worker API and responding with your mock definition on the network level2. This way, your application does not know about the mocking and behaves as if it was communicating with a real server.
* framer-motion -Framer-motion is a library for animating React components with simple and declarative syntax1. It allows you to create complex animations, gestures, transitions, and more with minimal code and high performance
* axios -Axios is a library for making HTTP requests from the browser or Node.js.
* mui/material -MUI/material is a React component library that implements Google’s Material Design1. It provides 40+ ready-to-use components that are customizable and performant. You can use MUI/material to create beautiful and interactive user interfaces for your web applications.
* @fontsource -@fontsource is a collection of open-source fonts that are packaged into individual NPM packages for self-hosting in your web applications1. It allows you to download and use fonts offline, manage them as dependencies, and improve your website performance by avoiding extra network requests.
* @emotion/styled -@emotion/styled is a package that allows you to create React components with styles attached to them. It is based on the styled-components and glamorous libraries, but it uses emotion as the core styling library. With @emotion/styled, you can write your styles in template literals or objects, and use props to dynamically change them. You can also style any component that accepts a className prop, or use the withComponent method to change the rendered tag of a styled component.
* formik -Formik is a library for building forms in React and React Native. It helps you with managing form state, validation, submission, and more. It is one of the most popular open source form libraries for React.
* yup -Yup is a package that allows you to create and validate schemas for runtime values in JavaScript. It is often used with form libraries like Formik to handle form state and validation. Yup schemas are expressive and flexible, and can handle complex and interdependent validations. You can write your schemas using template literals or objects, and use references and custom methods to extend them

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To build and run the project, follow these steps:

1. First, ensure you have Node.js installed on your local development machine. You can check your Node.js version by running `node -v` in your terminal. If you don’t have Node.js, you can download it from the official website: Node.js.

2. Open your terminal or command line and navigate to project folder
`cd trickyplay-web`

3. Make sure trickyplay-api is listening for requests

4. Set environment variables pointing to the appropriate addresses supported by the API launched in point 3

5. To start the development server, run:
`npm start`

6. When you’re ready to deploy your app to production, create a minified bundle using:
`npm run build`
This command generates an optimized build in the build folder. You can then serve this build using a static file server or deploy it to platforms like Netlify, Vercel, or GitHub Pages.

## Project structure

Atomic design is a methodology for creating design systems from atoms, molecules, organisms, templates and pages. It helps you think about your web design in a more methodical way and craft systems that are consistent, scalable and flexible.

The colocation principle in web development is the idea that related files or components should be placed close together in the same directory or folder. This makes it easier to find, maintain, and reuse code. It also reduces the complexity and dependencies of the web application

In accordance with the atomic design methodology and the collocation principle, it was decided to group the files and tests together inside folders grouped by feature. As React doesn't have opinions on how to put files into folders, it is up to us to choose granularity of the groups. The overview of the project is schematically presented below:

```
my-app/
├── node_modules/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── index.ts
│   ├── App.tsx
│   ├── pages/
│   │   └── ...
│   ├── shared/
│   │   └── assets
│   │   │   └── ...
│   │   └── components
│   │   │   └── ...
│   │   └── models
│   │   │   └── ...
│   │   └── services
│   │   │   └── ...
│   │   └── utils
│   │   │   └── ...
│   │   └── ...
│   └── router/
│       └── ...
├── package.json
└── README.md
```

src/: This directory contains the React app’s source code.

pages/: Contains higher-level components responsible for rendering specific pages.

shared/components/: Houses individual React components for the app.

shared/assets/: Contains assets.

shared/utils/: Holds utility functions.

shared/services/: Services responsible for communicating with the API, storing contexts available globally or used on many pages, managing comments and replies collections, managing the state of dialogs and managing notifications.

index.js: The entry point that renders the root component (App.js) and mounts it to the DOM.
package.json: Lists the dependencies for the project.

public/: Contains the index.html file and other static assets.

## How to contributes

I believe contributing should be as easy and transparent as possible. Changes including bug fixes and documentation improvements can be implemented and reviewed via the normal GithuHub pull request workflow. Any new functionality should contains unit tests. It is important to use yarn test to make sure you don't introduce any regressions as you work on your change.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

For further reference, please consider the following sections:

* [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
* [react](https://reactjs.org/)
* [@emotion](https://emotion.sh/docs/introduction)
* [@fontsource](https://fontsource.org/docs/getting-started/introduction)
* [@mui](https://mui.com/material-ui/getting-started/)
* [@testing-library](https://testing-library.com/docs/react-testing-library/intro/)
* [@jest](https://jestjs.io/docs/getting-started)
* [axios](https://axios-http.com/docs/intro)
* [formik](https://formik.org/docs/overview)
* [yup](https://github.com/jquense/yup)
* [usehooks-ts](https://usehooks-ts.com/)
* [typescript](https://www.typescriptlang.org/docs/)
* [react-router-dom](https://reactrouter.com/en/main)
* [framer-motion](https://www.framer.com/motion/)
