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

  const timelineMaterial = new BABYLON.StandardMaterial("timeline-material", scene);
  timelineMaterial.diffuseColor = BABYLON.Color3.FromHexString("#e2e8f0");
  timelineMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const monthMaterial = new BABYLON.StandardMaterial("month-material", scene);
  monthMaterial.diffuseColor = BABYLON.Color3.FromHexString("#94a3b8");
  monthMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const timeline = new BABYLON.Mesh("timeline", scene);
  const tube = BABYLON.MeshBuilder.CreateTube(
    "tube",
    { path: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0.05, 0, 0)], radius: 0.05, tessellation: 16, cap: BABYLON.Mesh.CAP_ALL, updatable: true },
    scene
  );
  tube.material = timelineMaterial;

  for (let i = 0; i < dayCount; i++) {
    const clone = tube.clone();
    timeline.addChild(clone);
    // set the clone name to the date it represents
    clone.name = new Date(dateStart.getTime() + i * day).toISOString().split("T")[0];
    clone.position.x = i * 0.05;
    // if the date is the first of the month, use the month mat
    if (clone.name.split("-")[2] === "01") {
      clone.material = monthMaterial;
    }
    clone.actionManager = new BABYLON.ActionManager(scene);
    clone.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPointerOverTrigger,
          parameter: clone
        },
        () => {
          console.log("date", clone.name);
          BABYLON.Animation.CreateAndStartAnimation("scale-up", clone, "scaling", 60, 6, clone.scaling, new BABYLON.Vector3(1, 2, 2), 0);
        }
      )
    );
    clone.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPointerOutTrigger,
          parameter: clone
        },
        () => {
          BABYLON.Animation.CreateAndStartAnimation("scale-down", clone, "scaling", 60, 6, clone.scaling, new BABYLON.Vector3(1, 1, 1), 0);
        }
      )
    );
  }

  timeline.position.x = -2;
  // position the timeline so it's centered on the x-axis
  timeline.position.x = -dayCount * 0.05 * 0.5;

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
