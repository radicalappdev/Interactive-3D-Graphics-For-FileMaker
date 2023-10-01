import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui/2D";
import sampleData from "/data/ohio-demo-01.json";

console.log("main.js loaded");

class ChoroplethSegmenter {
  constructor(data, segments) {
    this.data = data;
    this.segments = segments;
    this.min_value = Math.min(...data.map((entry) => entry.value));
    this.max_value = Math.max(...data.map((entry) => entry.value));
    this.segment_width = (this.max_value - this.min_value) / segments;
  }

  getSegment(value) {
    if (value < this.min_value || value > this.max_value) {
      return null; // Value is outside the data range
    }

    // Calculate the segment index
    const segment_index = Math.floor((value - this.min_value) / this.segment_width);

    // Adjust for the last segment to include the maximum value
    if (segment_index === this.segments) {
      return this.segments;
    }

    return segment_index + 1; // Return 1-indexed segment number
  }
}

export const extractSVG_babylon = (svg) => {
  // Function to parse path data and convert it into an array of points
  function parsePathData(pathData) {
    // Regular expression pattern to find all commands and their coordinates
    const regex = /([mlhvcsqtaz])([^mlhvcsqtaz]*)/gi;

    // Array to store the points
    const points = [];

    // Helper function to update the current point based on the command and its parameters
    function updateCurrentPoint(command, parameters) {
      const coordinates = parameters.split(/[ ,]/).map(parseFloat);

      let index = 0;
      while (index < coordinates.length) {
        const dx = coordinates[index];
        const dy = coordinates[index + 1];
        currentPoint.x += dx;
        currentPoint.y += dy;
        points.push(new BABYLON.Vector3(currentPoint.x, currentPoint.y, 0));
        index += 2; // Move to the next set of coordinates (x, y)
      }
    }

    let currentPoint = new BABYLON.Vector3(0, 0, 0); // Starting point

    let match;
    while ((match = regex.exec(pathData)) !== null) {
      const command = match[1];
      const parameters = match[2].trim();
      updateCurrentPoint(command, parameters);
    }

    return points;
  }

  // Create an array to store the objects
  const pathsArray = [];

  // Parse the SVG data to extract the path elements
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svg, "image/svg+xml");
  const pathElements = svgDocument.querySelectorAll("path");

  // Iterate through each path and convert it to an object
  pathElements.forEach((pathElement) => {
    // Get the 'id' attribute of the path
    const id = pathElement.getAttribute("id");

    // Get the 'd' attribute of the path, which contains the path data
    const pathData = pathElement.getAttribute("d");
    const points = parsePathData(pathData);
    const pathObject = {
      id,
      points
    };

    pathsArray.push(pathObject);
  });

  return pathsArray;
};

const createScene = async (data, svg) => {
  // console.log("data", data);
  // console.log("svg", svg);
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.FromHexString("#ffffff");
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
  camera.position = new BABYLON.Vector3(0, 3, -5);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 10;

  // // Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // Config for the map
  const colors = ["#ffffff", "#e1f5ff", "#c8ecff", "#a4dcff", "#8fd4ff", "#68b6eb", "#40a8e0", "#1168a7", "#1b75bc", "#2d90d1"];
  const numberOfSegments = colors.length;
  const heightFactor = 1;

  // Create an instance of the ChoroplethSegmenter class
  const choroplethSegmenter = new ChoroplethSegmenter(sampleData, numberOfSegments);

  function extrudePath(node) {
    const id = node.id;

    // get the object from the sample data where countyName matches the id
    const entry = data.find((entry) => entry.countyName === id);

    const value = entry.value;

    // get the value from the entry
    const num = choroplethSegmenter.getSegment(value);
    console.log(id, entry, num);

    // Use the number to pick a color from the array
    const color = colors[num - 1];
    console.log(node.id, num, color);

    // Use the number to pick a depth
    const depth = num / heightFactor + 1;
    const myPath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(0, depth, 0)];
    const options = {
      shape: node.points,
      path: myPath,
      updatable: true,
      cap: BABYLON.Mesh.CAP_ALL,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    let extrudedMesh = BABYLON.MeshBuilder.ExtrudeShape("ext", options, scene);

    // Create a material for the mesh
    const material = new BABYLON.StandardMaterial("material", scene);

    material.diffuseColor = BABYLON.Color3.FromHexString(color);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    material.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // material.emissiveIntensity = 0.01;

    extrudedMesh.material = material;
    extrudedMesh.convertToFlatShadedMesh();
    extrudedMesh.scalingDeterminant = 0.1;

    // Generate a line mesh from the path points and place it on top of the extruded mesh
    // map the data points from XZ to XY
    node.points = node.points.map((point) => new BABYLON.Vector3(point.x, 0, point.y));
    const lineMesh = BABYLON.MeshBuilder.CreateLines("lines", { points: node.points }, scene);
    lineMesh.color = BABYLON.Color3.FromHexString("#475569");
    // Rotate the line mesh so it's parallel to the extruded mesh
    lineMesh.parent = extrudedMesh;
    lineMesh.rotation.z = Math.PI;
    lineMesh.rotation.y = -Math.PI / 2;
    lineMesh.position.y = depth + 0.01;

    // add a console log when the user clicks on a extruded mesh
    const am = new BABYLON.ActionManager(scene);
    extrudedMesh.actionManager = am;
    extrudedMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
        console.log("Clicked on", id, value);
        // Get the picked position in the scene
        const pickedPosition = scene.pick(scene.pointerX, scene.pointerY);
        console.log("Picked Position", pickedPosition);

        // Define animation parameters
        const animationDuration = 15; // in milliseconds
        const easingFunction = new BABYLON.QuadraticEase(); // You can choose a different easing function if needed
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        // Create an animation to smoothly transition the camera's target position
        const animation = new BABYLON.Animation(
          "LookAtAnimation", // Animation name
          "target", // Property to animate
          30, // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Create keyframes for the animation
        const keyFrames = [
          {
            frame: 0,
            value: cam.target.clone() // Initial position of the camera's target
          },
          {
            frame: animationDuration,
            value: pickedPosition.pickedPoint // Desired target position
          }
        ];

        // Assign the keyframes to the animation
        animation.setKeys(keyFrames);
        animation.setEasingFunction(easingFunction);

        // Attach the animation to the camera
        cam.animations.push(animation);

        // Start the animation
        scene.beginAnimation(cam, 0, animationDuration, false);
      })
    );

    //  on mouse over
    extrudedMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (evt) => {
        console.log("Mouse over", id, value);
        extrudedMesh.position.y = +0.1;
      })
    );

    //  on mouse out
    extrudedMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (evt) => {
        console.log("Mouse out", id, value);
        extrudedMesh.position.y = 0;
      })
    );

    return extrudedMesh;
  }

  const pathsArray = extractSVG_babylon(svg);

  // Create a group to hold all the extruded paths
  const extrudedPathsGroup = new BABYLON.Mesh("extrudedPathsGroup", scene);

  // loop through the paths array and extrude each path
  pathsArray.forEach((path) => {
    extrudedPathsGroup.addChild(extrudePath(path));
  });

  return { scene, engine };
};

// When the DOM is ready, run the createScene function
window.addEventListener("DOMContentLoaded", async function () {
  let engine;
  let scene;

  // Resize the engine on window resize
  window.addEventListener("resize", function () {
    engine.resize();
  });

  // Call this from FileMaker to populate the boxes with data OR call it if we are not in FileMaker to use the sample data
  this.window.populateMap = async (data, svg) => {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const { scene: newScene, engine: newEnging } = await createScene(data, svg);
    engine = newEnging;
    scene = newScene;
    // Start the render loop
    engine.runRenderLoop(function () {
      scene.render();
    });
  };

  // Wait 1 second, then populate the timeline with sample data
  // This should give FileMaker time to inject the FileMaker object
  setTimeout(async () => {
    if (!this.window.FileMaker) {
      // If we are not in FileMaker, populate the scene with sample data
      // Also use the svg file from the public folder
      const svg = await fetch("/usa-oh.svg").then((res) => res.text());
      this.window.populateMap(sampleData, svg);
    }
  }, 1000);
});
