# Layers 3D

Proof of concept: FileMaker Layout (from clipboard) to 3D layers.

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
- main-tree-shaking.js - This alternative file does the same thing as main.js It is written to import for tree shaking. See build notes
- ExampleWidgets (parent folder) is a FileMaker file with a few examples of how to use the widgets.

## Build Notes

- This project uses vite-plugin-singlefile: It has some limitations that you should be aware of. https://github.com/richardtallent/vite-plugin-singlefile#limitations
- BabylonJS is HUGE. The main.js version of the scene code does not import for tree shaking. There is an alternate version of the scene code in the main-tree-shakng.js file that does import for tree shaking. You can switch between the two by changing the script tag in the index.html file.
