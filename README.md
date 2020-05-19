# Citrus

This README outlines the details of the new User Interface


## Prerequisites

You will need the following things properly installed on your computer/VM.
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Vue-cli](https://cli.vuejs.org/guide/installation.html)
* [Google Chrome](https://google.com/chrome/)
* [Nginx] (https://www.nginx.com/) (version > 1.14)


## Installation

* git clone https://github.com/eubr-bigsea/citrus.git
* cd citrus

### Development environment configuration
In order to have Citrus running on a developer machine, you must follow these steps:

1. Install nodeenv Python package. Nodeenv allows you to create a virtual environment for NodeJS, 
similarly we create virtual environments for other Lemonade's components. 

```% sudo pip install nodeenv ```

2. Create the NodeJS virtual environment and activate it. If it works, something like `(venv)` will appear in your command prompt:
```
% nodenv --node=13.14.0 venv
% source venv/bin/activate
```

3. Install project dependencies 
```
% npm install
$ npm install -g @vue/cli-service-global
% npm install -g @vue/cli
% npm add core-js
```

4. We are serving the Citrus Vue application using VueJS internal server, but in order to use Thorn authentication, we 
need to start a Nginx instance. Nginx will act as a proxy to all backend APIs. It also integrates with Thorn to provide 
centralized authentication mechanism. Open the file custom_nginx.conf, in the root directory of project.

5. Locate this text:
```
    ######## LEMONADE DEVELOPERS ##############
    # Change URLs here in order to connect    #
    # to servers not running on your computer #
    ###########################################
    upstream caipirinha {
        server localhost:3324;
    }
    upstream limonero {
        server localhost:3321;
    }
    upstream stand {
        server localhost:3323;
    }
    upstream tahiti {
        server localhost:5000;
    }
    upstream thorn {
        server localhost:3319;
    }
```
Change all address from localhost:port to the correct address of the services, if they are not running in your machine.
For example:
```
    upstream caipirinha {
        server demo.lemonade.org.br;
    }
```

6. Finally you can start Vue internal server and the Nginx configured for the project:
```
% vue serve src/main.js &
% ./start-nginx.sh &
```

You can ignore the message `nginx: [alert] could not open error log file: open() "/var/log/nginx/error.log" failed (13: Permission denied)`.

Now access http://localhost:8000

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

You can use also vue to run server, after installed [Vue-cli](https://cli.vuejs.org/guide/installation.html)

```
vue serve src/main.js
```

Now access http://localhost:8080

### Troubleshooting

If during the execution of vue, an error similar to this occurs:
```
Module build failed (from ./node_modules/sass-loader/dist/cjs.js):
Error: Missing binding /scratch/walter/citrus/node_modules/node-sass/vendor/linux-x64-83/binding.node
Node Sass could not find a binding for your current environment: Linux 64-bit with Node.js 14.x

Found bindings for the following environments:
  - Linux 64-bit with Node.js 13.x
```
Execute the command:
 ```
   % npm rebuild node-sass 
n```