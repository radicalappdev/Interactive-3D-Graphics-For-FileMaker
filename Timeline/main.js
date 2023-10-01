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
  scene.clearColor = BABYLON.Color3.FromHexString("#ffffff");
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

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

  // Create a camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
  camera.position = new BABYLON.Vector3(0, 0, -22);
  camera.attachControl(canvas, true); // Attach the camera controls to the canvas
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 30;

  // // Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.8;
  const light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, -1, 0), scene);
  light2.intensity = 0.8;

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

  const timeline = BABYLON.MeshBuilder.CreateTube(
    "timeline",
    { path: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, -dayCount * timelineScaler, 0)], radius: 0.1, tessellation: 64 },
    scene
  );
  timeline.material = timelineMat;
  timeline.position.y = (dayCount * timelineScaler) / 2;

  projectData.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemTime = itemDate.getTime();
    const itemPosition = Math.round((itemTime - dateStart.getTime()) / day);

    const eventMesh = BABYLON.MeshBuilder.CreateSphere(item.name, { diameter: 0.5, segments: 32 }, scene);
    timeline.addChild(eventMesh);
    eventMesh.position.y = -itemPosition * timelineScaler;
    eventMesh.material = item.type === "milestone" ? milestoneMat : versionMat;

    // Create a textblock for the date
    const date = new GUI.TextBlock(item.name + "-date");
    date.text = item.date;
    date.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
    date.color = "black";
    date.fontSize = "24px";
    date.fontWeight = "bold";
    date.height = "100%";
    date.width = "100%";
    advancedTexture.addControl(date);
    date.linkWithMesh(eventMesh);
    date.linkOffsetX = -120;

    // Create a card that we can show on the right side
    const card = new GUI.Rectangle("card");
    card.width = "600px";
    card.height = "130px";
    card.cornerRadius = 20;
    card.color = "#1e293b";
    card.thickness = 1;
    card.background = "#e2e8f0";

    advancedTexture.addControl(card);
    card.linkWithMesh(eventMesh);
    card.linkOffsetX = card.widthInPixels / 2 + 40;
    // card.linkOffsetY = card.heightInPixels / 2 - 40;

    // In the card, add text blocks for title and type
    const cardTitle = new GUI.TextBlock(item.title + "-title");
    cardTitle.text = item.title;
    cardTitle.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
    cardTitle.color = "black";
    cardTitle.fontSize = "40px";
    cardTitle.height = "100%";
    cardTitle.width = "100%";
    cardTitle.paddingTop = "20px";
    cardTitle.paddingBottom = "16px";
    cardTitle.paddingLeft = "16px";
    cardTitle.paddingRight = "16px";
    cardTitle.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    cardTitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    card.addControl(cardTitle);

    const cardType = new GUI.TextBlock(item.type + "-type");
    cardType.text = "#" + item.type;
    cardType.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
    cardType.color = "black";
    cardType.fontSize = "32px";
    cardType.height = "100%";
    cardType.width = "100%";
    cardType.paddingTop = "20px";
    cardType.paddingBottom = "16px";
    cardType.paddingLeft = "16px";
    cardType.paddingRight = "16px";
    cardType.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    cardType.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    card.addControl(cardType);

    if (item.date != "2020-08-01") {
      card.isVisible = false;
    }
  });

  // Calculate ortho bounds to fit the timeline
  const desiredTimelineHeight = (dayCount + 100) * timelineScaler; // The height you want to show in orthographic mode
  const orthoScaler = desiredTimelineHeight / 2; // You can adjust this factor based on your preference

  if (camera) {
    // Calculate the ortho size based on the desired timeline height
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoTop = orthoScaler;
    camera.orthoBottom = -orthoScaler;
    camera.orthoLeft = -(orthoScaler * (canvas.width / canvas.height));
    camera.orthoRight = orthoScaler * (canvas.width / canvas.height);
  }

  return { scene, engine, orthoScaler };
};

// When the DOM is ready, run the createScene function
window.addEventListener("DOMContentLoaded", async function () {
  const { scene, engine, orthoScaler } = await createScene();
  // Start the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Resize the engine on window resize
  window.addEventListener("resize", function () {
    engine.resize();
    const scene = engine.scenes[0];
    const camera = scene.cameras[0];
    // use the ortho scaler to adjust the ortho size on resize
    camera.orthoTop = orthoScaler;
    camera.orthoBottom = -orthoScaler;
    camera.orthoLeft = -(orthoScaler * (engine.getRenderWidth() / engine.getRenderHeight()));
    camera.orthoRight = orthoScaler * (engine.getRenderWidth() / engine.getRenderHeight());
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
