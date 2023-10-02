# Map3D

Convert an SVG Map to 3D Objects

This project uses path data from an SVG map to extrude 3D shapes in a Babylon JS scene. This is a reproduction of an early prototype and is not suitable for production use.

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

## Licenses

- SVG Maps in `public/` are licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- I made the following change to the [Ohio map](https://mapsvg.com/maps/usa-oh) (`usa-oh.svg`) to make it work with the project:

Error: L command and subsequent coordinates. (This was a hackly workaround to get this SVG working with my wonky parser.)

```svg
m 10.883377,8.7409263 2.924,-0.496 2.885,1.0279998 -2.325,0.386 -1.47,0.217 -1.171,1.6780009 -0.261,0.486 -0.934,0.798 -0.279,0.036 -0.117,-0.942 L 9.7743771,8.9349261 10.883377,8.7409263
```

Fixed: removed the L command and updated the coordinates to be relative.

```svg
m 10.8834 8.7409 l 2.924 -0.496 l 2.885 1.028 l -2.325 0.386 l -1.47 0.217 l -1.171 1.678 l -0.261 0.486 l -0.934 0.798 l -0.279 0.036 l -0.117 -0.942 l -0.3734 -2.9239 l 1.1214 -0.2671
```
