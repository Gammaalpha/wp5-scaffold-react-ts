# React template in Typescript with Webpack 5 Module Federation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and using [Webpack 5](https://webpack.js.org/).

A full working example with both shell and remote can be viewed at [wp5-react-host-remote-example](https://github.com/Gammaalpha/wp5-react-host-remote-example) repository.

## How to use this repository

You can use this repository to setup the module federation host or remote depending on what you are consuming or exposing.

After cloning the repository, modify the following files to your desired parameters:

1. package.json
1. webpack.config.js

> Use unique names for each project to easily distinguish them for module consumption.

### Setup Host

Clone the repository in a separate folder and name it accordingly to distinguish it as the main shell or host application.

#### Webpack configuration

Modify the 'Module Federation Plugin' settings inside webpack.config.js file to name it as the host/shell app.

In the host/shell app you will consume other components by adding them in the remotes:{...} section.

For Example:

```javascript:
    {
        ...,
        remote:
        {
            "externalComponent-mf":"{remote_module_name}@{URL:port}/{remote_module_filename}.js",
            ...
        }
    }
```

The **externalComponent-mf** is the custom name being given inside the host/shell app webpack configuration and it will be used to reference the components anywhere inside our host/shell app.

The **remote_module_name** is the name given to the remote module and its present inside the remotes webpack configuration. This is used to consume the file being exposed at the desired url:port/filename.js within the host webpack configuration.

### Use in application

Once the webpack configurations have been set, we can consume the component using React.lazy within our host/shell app as follows to lazy load the component.

```javascript:
    const CustomComponent = React.lazy(() => import("externalComponent-mf/CustomComponent"));
```

### Adding missing Typescript Type definitions

When you are adding the imports for the external remote components, Typescript will throw an error about the missing definitions. So to get rid of those errors, simply add those definitions to the types/definitions.d.ts file.

If the error doesn't get removed, either restart VSCode or restart Typescript server using the command pallet while having a Typescript file open.

For PC: Ctrl + P > Typescript: Restart TS Server

For Mac: Command + P > Typescript: Restart TS Server

### Setup Remote Module

Clone the repository in a separate folder and name it accordingly to distinguish it as a remote application to be consumed.

#### Webpack configuration

Modify the 'Module Federation Plugin' settings inside webpack.config.js file to name it as remote app for ease of use.

For Example:

```
    name: "component_remote",
    filename: "component_remoteEntry.js"
```

In the remote app you will expose its components by adding them in the exposes:{...} section.

For Example:

```javascript:
    {
        ...,
        exposes:
        {
             "./CustomComponent": "./src/components/CustomButton/CustomButton",
            ...
        }
    }
```

## Available Scripts

In the project directory, you can run:

### yarn dev

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### yarn prod

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### yarn clean

Cleans the build folder and all its contents.
