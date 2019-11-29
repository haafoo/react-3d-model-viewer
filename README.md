# react-3d-model-viewer [![](https://img.shields.io/npm/v/react-3d-model-viewer.svg)](https://www.npmjs.com/package/react-3d-model-viewer) 
A React component to view 3D models using three.js. [Demo](https://haafoo.github.io/react-3d-model-viewer/)

## Features
* React component
* Three.js WebGL renderer
* Three.js STL Loader
* Three.js 3MF Loader

  Note - Remains dependent on my fork of Three.js which has a branch to expose some orbit controls
  methods to provide a means of initial positioning (Three.js r104 incorporated a pull request to
  modularize STL Loader in Three's examples/jsm (which this fork also previously added).

## Usage
Install `react-3d-model-viewer` through npm
```bash
npm i react-3d-model-viewer
```
Use `ModelViewer` component
```bash
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
