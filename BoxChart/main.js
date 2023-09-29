import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui/2D";
// TODO Import this from FileMaker
import data from "/data/export_categories_starting.json";

console.log("main.js loaded");

console.log("data", data);

export function findLargestValue(data) {
  let largestValue = 0;

  for (const category in data.CategorySummary) {
    if (data.CategorySummary.hasOwnProperty(category)) {
      const categoryData = data.CategorySummary[category];
      const CreationCount = categoryData.CreationCount || 0;
      const DeletionCount = categoryData.DeletionCount || 0;
      const ModificatonCount = categoryData.ModificatonCount || 0;

      const maxCount = Math.max(CreationCount, DeletionCount, ModificatonCount);
      if (maxCount > largestValue) {
        largestValue = maxCount;
      }
    }
  }

  return largestValue;
}

// Function to determine where a value falls between 0 and the largest value
export function getValuePosition(value, largestValue) {
  if (value < 0) {
    return 0;
  } else if (value > largestValue) {
    return 1;
  } else {
    return value / largestValue;
  }
}

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.FromHexString("#ffffff");
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
  camera.position = new BABYLON.Vector3(0, 3, -5);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.setTarget(BABYLON.Vector3.Zero()); // Target the camera to scene origin. You could also target a mesh, or something else
  // camera.lowerRadiusLimit = 2;
  // camera.upperRadiusLimit = 10;

  // // Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // Materials
  const matRed = new BABYLON.StandardMaterial("matRed", scene);
  matRed.diffuseColor = BABYLON.Color3.FromHexString("#C7303E");
  matRed.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const matGreen = new BABYLON.StandardMaterial("matGreen", scene);
  matGreen.diffuseColor = BABYLON.Color3.FromHexString("#23923C");
  matGreen.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const matBlue = new BABYLON.StandardMaterial("matBlue", scene);
  matBlue.diffuseColor = BABYLON.Color3.FromHexString("#4374d1");
  matBlue.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const matWhite = new BABYLON.StandardMaterial("matWhite", scene);
  matWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);
  matWhite.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  // Default Boxes
  const boxGreen = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  boxGreen.position = new BABYLON.Vector3(0, 0.5, 0);
  boxGreen.material = matGreen;

  const boxRed = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  boxRed.position = new BABYLON.Vector3(-1.5, 0.5, 0);
  boxRed.material = matRed;

  const boxBlue = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  boxBlue.position = new BABYLON.Vector3(1.5, 0.5, 0);
  boxBlue.material = matBlue;

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  // Then add a textblock to the overlay.
  const title = new GUI.TextBlock("gui-title");
  title.text = "Box Chart";
  title.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
  title.color = "black";
  title.fontSize = "32px";
  title.fontWeight = "bold";
  title.height = "100%";
  title.width = "100%";
  title.paddingTop = "20px";
  title.paddingBottom = "16px";
  title.paddingLeft = "16px";
  title.paddingRight = "16px";
  title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  advancedTexture.addControl(title);

  return { scene, engine };
};

// When the DOM is ready, run the createScene function
window.addEventListener("DOMContentLoaded", async function () {
  const { scene, engine } = await createScene();
  // Start the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Resize the engine on window resize
  window.addEventListener("resize", function () {
    engine.resize();
  });

  // A simple function that can be called from FileMaker to make a change in the scene
  this.window.changeBoxColor = (data) => {
    const parsed = JSON.parse(data);
    console.log("changeBoxColor", parsed);
    //  get the box material by name
    const mat = scene.getMaterialByName("box-mat");
    // set the color
    mat.diffuseColor = BABYLON.Color3.FromHexString(parsed.color);
  };
});
