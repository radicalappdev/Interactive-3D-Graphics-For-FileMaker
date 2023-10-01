import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui/2D";
import sampleData from "/data/ohio-demo-01.json";

console.log("main.js loaded");

const createScene = async (data, svg) => {
  console.log("data", data);
  console.log("svg", svg);
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

  // Create a material and a cube
  const material = new BABYLON.StandardMaterial("box-mat", scene);
  material.alpha = 1;
  material.diffuseColor = BABYLON.Color3.FromHexString("#94a3b8");

  const cube = BABYLON.MeshBuilder.CreateBox("box", {
    height: 1,
    width: 1,
    depth: 1
  });
  cube.material = material;

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
