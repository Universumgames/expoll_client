# Expoll webclient

This project is one of the three repositories for the expoll project.
The project contains:

-   this, the webclient
-   [the backend](https://git.mt32.net/universum/expoll_server) (or on [Github](https://github.com/Universumgames/expoll_server))
-   [the library](https://git.mt32.net/universum/expoll_lib) (or on [Github](https://github.com/Universumgames/expoll_lib))

Detailed information on the expoll project and how to deploy the cluster, please see the [README](https://git.mt32.net/universum/expoll_server/-/blob/main/Readme.md) or [README on Github](https://github.com/Universumgames/expoll_server/blob/main/Readme.md).

## Running the webclient on your computer

This project is created with [vuejs3](https://vuejs.org/) and can easily be run via

```sh
npm run serve
```

please keep in mind, that the backend server has to be accessible, for changing the development backend server, please edit the [`vue.config.js`](./vue.config.js) file.
