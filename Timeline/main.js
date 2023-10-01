import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui/2D";
import projectData from "/data/project-timeline.json";

console.log("main.js loaded");

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.FromHexString("#1e293b");
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
  camera.position = new BABYLON.Vector3(0, 3, -5);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.setTarget(BABYLON.Vector3.Zero()); // Target the camera to scene origin. You could also target a mesh, or something else
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 20;

  // // Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  const dateStart = new Date(projectData[0].date);
  const dateEnd = new Date(projectData[projectData.length - 1].date);
  console.log(dateStart, dateEnd);

  // for each day, clone the tube mesh and move it along the x-axis
  const day = 24 * 60 * 60 * 1000;
  const dayCount = Math.round((dateEnd.getTime() - dateStart.getTime()) / day);
  console.log(dayCount);

  const timelineMat = new BABYLON.StandardMaterial("timeline-material", scene);
  timelineMat.diffuseColor = BABYLON.Color3.FromHexString("#e2e8f0");
  timelineMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const milestoneMat = new BABYLON.StandardMaterial("milestone-material", scene);
  milestoneMat.diffuseColor = BABYLON.Color3.FromHexString("#2d98da");
  milestoneMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const versionMat = new BABYLON.StandardMaterial("version-material", scene);
  versionMat.diffuseColor = BABYLON.Color3.FromHexString("#8854d0");
  versionMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const timelineScaler = 0.025;
  console.log("x pos", dayCount * timelineScaler);

  const timeline = BABYLON.MeshBuilder.CreateTube(
    "timeline",
    { path: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, -dayCount * timelineScaler, 0)], radius: 0.1, tessellation: 64 },
    scene
  );
  timeline.material = timelineMat;

  projectData.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemTime = itemDate.getTime();
    const itemPosition = Math.round((itemTime - dateStart.getTime()) / day);

    const sphere = BABYLON.MeshBuilder.CreateSphere(item.name, { diameter: 0.5, segments: 32 }, scene);
    timeline.addChild(sphere);
    sphere.position.y = -itemPosition * timelineScaler;
    sphere.material = item.type === "milestone" ? milestoneMat : versionMat;
  });

  // Create a GUI
  // First, create a fullscreen UI using the AdvancedDynamicTexture
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  // Then add a textblock to the overlay.
  const title = new GUI.TextBlock("gui-title");
  title.text = "Timeline";
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