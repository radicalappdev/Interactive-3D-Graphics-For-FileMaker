// Core
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";

// GUI
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Control } from "@babylonjs/gui/2D/controls/control";

console.log("main.js loaded");

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a camera
  const camera = new ArcRotateCamera("Camera", 0, 0, 0, Vector3.Zero(), scene);
  camera.position = new Vector3(0, 3, -5);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.setTarget(Vector3.Zero()); // Target the camera to scene origin. You could also target a mesh, or something else
  camera.useAutoRotationBehavior = true; // Remove this to stop the auto rotation

  // // Create a basic light
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // Create a material and a cube
  const material = new StandardMaterial(scene);
  material.alpha = 1;
  material.diffuseColor = Color3.FromHexString("#f1f5f9");

  const cube = CreateBox("box", {
    height: 1,
    width: 1,
    depth: 1
  });
  cube.material = material;

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  // Then add a textblock to the overlay.
  const title = new TextBlock("gui-title");
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
  title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
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
