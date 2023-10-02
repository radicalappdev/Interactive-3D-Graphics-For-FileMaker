# Layers 3D

Proof of concept: FileMaker Layout (from clipboard) to 3D layers.

NOTE: BaseElements is required to use the live demo for this scene.

## Getting Started

- clone the repo or download the project
- cd into the project directory (or, in VS Code, right click on the project folder and select "Open in Integrated Terminal")
- run `npm install`
- run `npm run dev` to start the dev server
- run `npm run build` to build the project
  - copy the content of the index.html file into the bundle field in the FileMaker file

## Files

- index.html - the main html file
- style.css - the main css file - just a class for the canvas
- main.js - This file will import Babylon JS and GUI, then create a scene.
- ExampleWidgets (parent folder) is a FileMaker file with a few examples of how to use the widgets.

## Build Notes

- This project uses vite-plugin-singlefile: It has some limitations that you should be aware of. https://github.com/richardtallent/vite-plugin-singlefile#limitations
