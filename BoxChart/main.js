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

const createTarget = (scene) => {
  const target = BABYLON.MeshBuilder.CreateBox("target", { size: 0.5 }, scene);
  target.position.y = 11.5;
  target.visibility = 0;

  //press w and s to move the camera position up and down
  // Define variables to control the movement
  let isMovingUp = false;
  let isMovingDown = false;
  const moveSpeed = 1; // Adjust the speed as needed

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        if (kbInfo.event.key === "w") {
          isMovingUp = true;
        } else if (kbInfo.event.key === "s") {
          isMovingDown = true;
        }
        break;
      case BABYLON.KeyboardEventTypes.KEYUP:
        if (kbInfo.event.key === "w") {
          isMovingUp = false;
        } else if (kbInfo.event.key === "s") {
          isMovingDown = false;
        }
        break;
    }
  });

  // Create an animation loop to move the mesh with delta time
  scene.registerBeforeRender(() => {
    const deltaTime = scene.getEngine().getDeltaTime() / 1000; // Convert to seconds
    const speedFactor = moveSpeed * deltaTime;

    if (isMovingUp) {
      target.position.y += speedFactor;
    } else if (isMovingDown) {
      target.position.y -= speedFactor;
    }
  });

  return target;
};

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.FromHexString("#ffffff");
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const overlayAdvancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

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
  overlayAdvancedTexture.addControl(title);

  const target = createTarget(scene);

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 3, new BABYLON.Vector3(3, 10, 3), scene);
  camera.lowerAlphaLimit = -Math.PI / 4 + Math.PI / 2;
  camera.upperAlphaLimit = Math.PI / 4 + Math.PI / 2;
  // camera.lowerBetaLimit = -0.4;
  camera.upperBetaLimit = 2.6;
  camera.lowerRadiusLimit = 3;
  camera.upperRadiusLimit = 9;
  camera.attachControl(canvas, true);
  camera.setTarget(target.position);
  camera.wheelPrecision = 50;

  // if (camera) {
  //   // Calculate the ortho size based on current engine size
  //   camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  //   camera.orthoTop = engine.getRenderHeight() / 12 / 100;
  //   camera.orthoBottom = -(engine.getRenderHeight() / 12 / 100);
  //   camera.orthoLeft = -(engine.getRenderWidth() / 12 / 100);
  //   camera.orthoRight = engine.getRenderWidth() / 12 / 100;
  // }

  // // Create a basic light
  //  TODO: Add a directional light
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

  const maxValue = findLargestValue(data);
  // const position = getValuePosition(5, maxValue);
  console.log("max value", maxValue);

  const base = 0.1;
  const adjust = 5;

  let boxes = new BABYLON.Mesh("boxes", scene);

  const categories = Object.values(data.CategorySummary);
  for (let i = 0; i < categories.length; i++) {
    const scalerGreen = base + getValuePosition(categories[i].CreationCount, maxValue) * adjust;
    const created = boxGreen.clone("created" + i);
    created.position = new BABYLON.Vector3(boxGreen.position.x, scalerGreen / 2, -1.2 * i);
    created.scaling.y = scalerGreen;
    if (categories[i].CreationCount == 0) {
      created.material = matWhite;
    }

    const scalerRed = base + getValuePosition(categories[i].DeletionCount, maxValue) * adjust;
    const deleted = boxRed.clone("deleted" + i);
    deleted.position = new BABYLON.Vector3(boxRed.position.x, scalerRed / 2, -1.2 * i);
    deleted.scaling.y = scalerRed;
    if (categories[i].DeletionCount == 0) {
      deleted.material = matWhite;
    }

    const scalerBlue = base + getValuePosition(categories[i].ModificatonCount, maxValue) * adjust;
    const modified = boxBlue.clone("modified" + i);
    modified.position = new BABYLON.Vector3(boxBlue.position.x, scalerBlue / 2, -1.2 * i);
    modified.scaling.y = scalerBlue;
    if (categories[i].ModificatonCount == 0) {
      modified.material = matWhite;
    }

    const plane = BABYLON.MeshBuilder.CreatePlane("plane" + i, { width: 3, height: 1 }, scene);
    plane.position = new BABYLON.Vector3(-4, 0, -1.2 * i);
    plane.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    // GUI
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane, 1024 * 3, 1024 / 2, false);
    const text1 = new GUI.TextBlock();
    // get the json key for the category
    const category = Object.keys(data.CategorySummary)[i];
    text1.text = category;
    text1.color = "black";
    text1.fontSize = 196;
    text1.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
    text1.fontWeight = "bold";
    text1.textHorizontalAlignment = 1;
    advancedTexture.addControl(text1);
    // overlayAdvancedTexture.addControl(text1);
    // text1.linkWithMesh(plane);
    // text1.linkOffsetX = -1200;

    boxes.addChild(created);
    boxes.addChild(deleted);
    boxes.addChild(modified);
    boxes.addChild(plane);
  }

  boxes.position = new BABYLON.Vector3(0, 12, 0);
  boxes.rotation = new BABYLON.Vector3(Math.PI / -2, Math.PI / 2, Math.PI / 2);
  boxes.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
  // hide the default boxes
  boxGreen.isVisible = false;
  boxRed.isVisible = false;
  boxBlue.isVisible = false;

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
