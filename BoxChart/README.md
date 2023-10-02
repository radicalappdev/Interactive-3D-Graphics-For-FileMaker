# BoxChart

Multi Series Bar Chart using 3D Boxes.

While not the most creative use of 3d, this demo shows how easy it is to use exising shapes to create a 3d chart. This chart will visualize data from FMComparson. To try it on your own, follow these steps:

1. Run a comparison using FMComparison.
2. Navigate to Export
3. Click on JSON Export
4. Select a file name and save the file
5. Uncheck all the options except for Categories and click Next
6. Click Export Results to File
7. Copy the contents of this file to Demo 02 record (see the data tab) in the ExampleWidgets file.

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
