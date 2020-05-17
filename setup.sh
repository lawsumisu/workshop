#!/bin/bash

webpack()
{
  echo "Installing Webpack and related libaries..."
  npm i --save-dev webpack webpack-cli webpack-dev-server webpack-config-utils
  npm i --save-dev babel-loader file-loader html-webpack-plugin
  echo "Done"
}

typescript()
{
  echo "Installing Typescript and related libraries..."
  npm i --save-dev typescript tslint prettier tslint-consistent-codestyle tslint-eslint-rules tslint-plugin-prettier tslint-react
  npm i --save-dev @babel/core @babel/polyfill @babel/preset-env @babel/register @babel/preset-react @babel/preset-typescript babel-plugin-module-resolver @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
  echo "Done"
}

react()
{
 echo "Installing React and related libraries..."
 npm i --save-dev react react-dom
 npm i --save-dev @types/react @types/react-dom
 echo "Done"
}

utilities()
{
 echo "Installing utilities..."
 npm i --save-dev lodash @types/lodash classnames @types/classnames
 echo "Done"

}

webpack
typescript
react

echo "Setup completed successfully"
