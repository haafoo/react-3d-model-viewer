# react-3d-model-viewer [![](https://img.shields.io/npm/v/react-3d-model-viewer.svg)](https://www.npmjs.com/package/react-3d-model-viewer) 
A React component to view 3D models using three.js. Demo located at https://haafoo.github.io/react-3d-model-viewer/

## Features
* React component
* Three.js WebGL renderer
* Three.js STL Loader

  Note - Dependent on my fork of Three.js but will migrate once STL Loader is modularized in Three's examples/jsm (which the fork currently add's).

## Usage
Install `react-3d-model-viewer` through npm
```js
npm i react-3d-model-viewer
```
Use `ModelViewer` component
```js
import ModelViewer from 'react-3d-model-viewer'
```

## Properties
Property | Type | Default | Description
:-----------------------|:--------------|:--------------|:--------------------------------
url | string  | './test_model.stl'  | The url of the STL file
width | string | '100%' | The width of the canvas    
aspectgRatio | string | '56.125%' | The aspect ratio of the canvas
color | string | '#fdd017' | The model display color
backgroundColor | string | '#eaeaea' | The canvas color
rotate | boolean | true | Animate the rotation of the model
rotationSpeeds | number list | [0.01, 0.01, 0] | A vector of rotation speeds
initControlPosition | number list | [0, 0, 1.0] | radians up, radians left, dolly out 
