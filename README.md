# Interactive-3D-Graphics-For-FileMaker

This repository contains several small projects that demonstrate ways to use 3D graphics in FileMaker. These demos were created using [Babylon JS](https://www.babylonjs.com/), a JavaScript library for 3D graphics.

Note: these demos were prepared on macOS. There may be some edge cases in Windows that I haven't accounted for yet.

## Instructions

- Open the ExampleWidgets file in FileMaker Pro 19 or later. Each widget record contains a production-ready version of the widget. Press the "Refresh" button to load the widget into the web viewer, then run the script related to the demo (see the scripts menu).
- To serve the demos yourself, navigate to one of the demo folders and run `npm install` to install the dependencies. Then, run `npm run start` to start the development server. You can then open the demo in a browser using the URL shown in the terminal.

## Demos

These demos are provided as a means to spark some ideas and build excitement for using 3D in FileMaker.

1. **FMPlayground** is a basic scene with a box and a text label, intended as a starting point.
2. **BoxChart** is a multi-series bar chart based on the Categories export from FMComparison.
3. **Timeline** is an orthographic scene with a timeline of events.
4. **Map3D** converts an SVG map to BabylonJS meshes and colors each segment to create a 3D choropleth.
5. **Layers3D** will convert layout objects (using clipboard data) into 3D meshes arranged in layers based on their containment and z-order.

These demos are not intended to be production-ready. While you are welcome to use them as-is, you will likely need to modify them to suit your needs.

---

## Resources & Notes

### Babylon JS

Babylon JS is a powerful library with many features. It's the best place to start for FileMaker devs learning to add 3D to their toolbox. Here are some resources to help you get started:

- [Babylon JS documentation](https://doc.babylonjs.com/) - Extensive documentation and tutorials
- [Babylon JS Playground](https://playground.babylonjs.com/) - Get started with your own scenes
- [Babylon JS Forum](https://forum.babylonjs.com/) Active community with many of the core team posting there daily. You can find me there as @vrhermit
- [Babylon JS Community Demos](https://www.babylonjs.com/community/) - Get inspired and see what others are doing with Babylon JS
  - [Xbox Design Lab](https://xboxdesignlab.xbox.com/en-us/)
  - [Target Room Planner](https://www.target.com/room-planner/college)
  - [Frame](https://learn.framevr.io/)
  - [Pi](https://www.pi2e.ch/scroll/)

### Other Frameworks and Tools

- [Three JS](https://threejs.org/) - Another popular 3D library
  - [A-Frame](https://aframe.io/) - A-Frame is a web framework for building virtual reality experiences. It is built on Three JS.
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) - A React renderer for Three JS with a vibrant and creative community.
- [PlayCanvas](https://playcanvas.com/) - A 3D game engine with a visual editor
- [Blender](https://www.blender.org/) - Free 3D modeling software

---

## Shameless Plugs

- Work with me [Radical App Dev](https://radicalappdev.com/#workwithme).
- [Canvatorium](https://vrhermit.com/canvatorium/) - An experimental design lab for spatial computing
- Where to find me [vrhermit.com/links](https://vrhermit.com/links/)
