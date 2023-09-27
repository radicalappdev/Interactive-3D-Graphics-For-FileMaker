import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
BABYLON.GUI = GUI; // assing GUI to BABYLON.GUI to match the usage in the playgrounds

console.log("main.js loaded");

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
  camera.position = new BABYLON.Vector3(0, 3, -5);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.setTarget(BABYLON.Vector3.Zero()); // Target the camera to scene origin. You could also target a mesh, or something else
  camera.useAutoRotationBehavior = true; // Remove this to stop the auto rotation

  // // Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // Create a material and a cube
  const material = new BABYLON.StandardMaterial(scene);
  material.alpha = 1;
  material.diffuseColor = new BABYLON.Color3.FromHexString("#f1f5f9");

  const cube = BABYLON.MeshBuilder.CreateBox("box", {
    height: 1,
    width: 1,
    depth: 1
  });
  cube.material = material;

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  // Then add a textblock to the overlay.
  const title = new BABYLON.GUI.TextBlock("gui-title");
  title.text = "FMPlayground";
  title.color = "white";
  title.fontSize = "32px";
  title.fontWeight = "bold";
  title.height = "100%";
  title.width = "100%";
  title.paddingTop = "20px";
  title.paddingBottom = "16px";
  title.paddingLeft = "16px";
  title.paddingRight = "16px";
  title.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  advancedTexture.addControl(title);

  return { scene, engine };
};

const resizeHelpers = (engine) => {
  engine.resize();
};

// When the DOM is ready, run the createScene function
window.addEventListener("DOMContentLoaded", async function () {
  // Start the render loop
  const { scene, engine } = await createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  // Resize the engine on window resize
  window.addEventListener("resize", resizeHelpers(engine));

  // Remove the event listener when the DOM is unloaded
  window.addEventListener("unload", function () {
    window.removeEventListener("resize", resizeHelpers(engine));
  });
});