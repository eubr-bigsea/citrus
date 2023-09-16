# citrus
This README outlines the details of the new User Interface

## Prerequisites

You will need the following things properly installed on your computer/VM.
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (version >= 16)
* [Yarn](https://yarnpkg.com/)
* [Vue-cli](https://cli.vuejs.org/guide/installation.html)
* [Vite](https://vitejs.dev/)
* [Google Chrome](https://google.com/chrome/)


## Installation
```
* git clone https://github.com/eubr-bigsea/citrus.git
* cd citrus
* git checkout develop
```

## Development environment configuration
In order to have Citrus running on a developer machine, you must follow these steps:

1. Install nodeenv Python package. Nodeenv allows you to create a virtual environment for NodeJS, similarly we create virtual environments for other Lemonade's components. 

```$ sudo pip install nodeenv ```

or

```$ sudo apt-get update (update packages) ```
```$ sudo apt-get install nodeenv ```

2. (Optional) Create the NodeJS virtual environment and activate it. If it works, something like `(venv)` will appear in your command prompt:
```
* Create new environment:

    $ nodeenv env

* Activate new environment:

    $ . env/bin/activate
```

3. Install project dependencies

* Downloading and installing Node.js and npm:
```
npm install
npm install -g npm
npm add core-js
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

### Open the file "env.development", copy and paste the following text:
``` VITE_LIMONERO_URL=http://www.lemonade.org.br/limonero
VITE_STAND_URL=http://www.lemonade.org.br/stand
VITE_TAHITI_URL=http://www.lemonade.org.br/tahiti
VITE_THORN_URL=http://www.lemonade.org.br/thorn
VITE_CAIPIRINHA_URL=http://www.lemonade.org.br/caipirinha
VITE_SEED_URL=http://www.lemonade.org.br/seed

VITE_STAND_NAMESPACE="/stand"
VITE_STAND_SOCKET_IO_PATH="/socket.io"
VITE_STAND_SOCKET_IO_SERVER=""
VITE_REFERENCE_BASE_URL=http://www.lemonade.org.br/reference
```

### To start developing in the LEMONADE environment
> npm run dev

--> Make sure the port allocated to LEMONADE is free to use <--


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
