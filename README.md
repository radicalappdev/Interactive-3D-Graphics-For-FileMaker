# Interactive-3D-Graphics-For-FileMaker

This repository contains several small projects that demonstrate ways to use 3D graphics in FileMaker. These demos were created using [Babylon JS](https://www.babylonjs.com/), a JavaScript library for 3D graphics.

## Instructions

- Open the ExampleWidgets file in FileMaker Pro 19 or later. Each widget record contains a production-ready version of the widget. Press the "Refresh" button to load the widget into the web viewer, then run the script related to the demo (see the scripts menu).
- To run the demos yourself, navigate to one of the demo folders and run `npm install` to install the dependencies. Then, run `npm run start` to start the development server. You can then open the demo in a browser using the URL shown in the terminal.

## Demos

1. FMPlayground is a basic scene with a box and a text label, intended as a starting point.
2. BoxChart is a multi-series bar chart based on the Categories export from FMComparison.
3. Timeline is an orthographic scene with a timeline of events.
4. Mab3D converts an SVG map to BabylonJS meshes and colors each segment to create a 3D choropleth.
5. Layers3D will convert layout objects (using clipboard data) into 3D meshes arranged in layers based on their containment and z-order.
