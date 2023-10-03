# Citrus
Citrus is the user web interface for [Lemonade Project](https://github.com/eubr-bigsea/lemonade).
In general, you would install Lemonade using Docker Compose (instructions at https://github.com/eubr-bigsea/docker-lemonade) or Kubernetes (instructions at https://github.com/eubr-atmosphere/lemonade-on-k8s). 

But if you are extending Lemonade user interface, you may install Citrus separately. 
This README.md explains how to do it.

## Prerequisites

You will need the following things properly installed on your computer/VM.
* [Git](https://git-scm.com/)
* Python (used to create the NodeJS virtual env)
* [Node.js](https://nodejs.org/) (version >= 16)
* [Vite](https://vitejs.dev/)


## Installation
```
$ git clone https://github.com/eubr-bigsea/citrus.git
$ cd citrus
$ git checkout <branch>
```
If you are creating a new feature, you must checkout the `develop` branch. Otherwise, if it is a hotfix,
you must checkout the `master` one. After checkout, you must create a new hotfix or feature branch:

```
$ git checkout -b <new_branch_name>
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

    $ source env/bin/activate
```

3. Install project dependencies

* Downloading and installing Node.js and npm:
```
$ npm install
$ npm install -g npm

```
* Checking your version of npm and Node.js
```
$ node -v
$ npm -v
```

4. Open the file "env.development", copy and paste the following text, replacing
`<server>` by the Lemonade's API server used and `<base-path>` by the base path used:

``` 
VITE_LIMONERO_URL=https://<server>/<base-path>/limonero
VITE_STAND_URL=https://<server>/<base-path>/stand
VITE_TAHITI_URL=https://<server>/<base-path>/tahiti
VITE_THORN_URL=https://<server>/<base-path>/thorn
VITE_CAIPIRINHA_URL=https://<server>/<base-path>/caipirinha
VITE_SEED_URL=https://<server>/<base-path>/seed

VITE_STAND_NAMESPACE="/stand"
VITE_STAND_SOCKET_IO_PATH="/socket.io"
VITE_STAND_SOCKET_IO_SERVER=""
VITE_REFERENCE_BASE_URL=https://www.lemonade.org.br/reference
```

### To start developing in the LEMONADE environment
$ npm run dev

--> Make sure the port allocated to LEMONADE is free to use <--


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
