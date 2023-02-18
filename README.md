# citrus

## Prerequisites

You will need the following things properly installed on your computer/VM.
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (version >= 16)
* [Yarn](https://yarnpkg.com/)
* [Vue-cli](https://cli.vuejs.org/guide/installation.html)
* [Google Chrome](https://google.com/chrome/)


## Installation
```
* git clone https://github.com/eubr-bigsea/citrus.git
* cd citrus
```

## Development environment configuration
In order to have Citrus running on a developer machine, you must follow these steps:

1. Install nodeenv Python package. Nodeenv allows you to create a virtual environment for NodeJS, similarly we create virtual environments for other Lemonade's components. 

```$ sudo pip install nodeenv ```

2. Create the NodeJS virtual environment and activate it. If it works, something like `(venv)` will appear in your command prompt:
```
* Create new environment:

    $ nodeenv env

* Activate new environment:

    $ . env/bin/activate
```

3. Install project dependencies


## Project setup

* Downloading and installing Node.js and npm:
```

npm install
npm install -g npm
```
* Checking your version of npm and Node.js
```
node -v
npm -v
```
* Downloading and installing vite

```
With NPM:
npm create vite@latest
or 
With Yarn:
yarn add vite

```

### Compiles and minifies for production
```
npm run dev
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
