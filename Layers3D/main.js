import * as BABYLON from "@babylonjs/core";

import * as GUI from "@babylonjs/gui/2D";
// BABYLON.GUI = GUI; // assing GUI to BABYLON.GUI to match the usage in the playgrounds

console.log("main.js loaded");

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI

  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  const inspector = new GUI.StackPanel("gui-inspector");
  inspector.width = "25%";
  inspector.height = "100%";
  inspector.background = BABYLON.Color3.FromHexString("#1e293b");
  inspector.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  inspector.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  advancedTexture.addControl(inspector);

  const title = new GUI.TextBlock("gui-title");
  title.text = "Select an object";
  title.color = "white";
  title.fontSize = "32px";
  title.fontWeight = "bold";
  title.textWrapping = true;
  title.height = "80px";
  title.paddingTop = "20px";
  title.paddingBottom = "16px";
  title.paddingLeft = "16px";
  title.paddingRight = "16px";
  title.fontFamily = "NotoSans-Bold";
  title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  inspector.addControl(title);

  const scroll = new GUI.ScrollViewer("gui-scroll");
  scroll.thickness = 10;
  scroll.color = "#3e4a5d";
  scroll.background = "#3e4a5d";
  scroll.width = "100%";
  scroll.barSize = 20;
  scroll.barColor = "#53637b";
  scroll.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scroll.wheelPrecision = 0.05;
  scroll.onPointerEnterObservable.add((ev) => {
    cam.inputs.removeByType("ArcRotateCameraMouseWheelInput");
  });
  scroll.onPointerOutObservable.add((ev) => {
    cam.inputs.addMouseWheel();
  });
  inspector.addControl(scroll);

  // add a description
  const description = new GUI.TextBlock("gui-description");
  description.text = "";
  description.color = "white";
  description.fontSize = "24px";
  description.fontWeight = "normal";
  description.textWrapping = true;
  description.width = 1;
  description.height = 5;
  description.paddingTop = "1%";
  description.paddingLeft = "30px";
  description.paddingRight = "20px";
  description.paddingBottom = "5%";
  description.fontFamily = "NotoSans-Medium";
  description.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  description.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  scroll.addControl(description);

  // Create a camera
  const cam = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 15, new BABYLON.Vector3(-5, -3, 0), scene);
  cam.attachControl(scene.getEngine().getRenderingCanvas(), true);
  if (cam) {
    cam.orthoTop = 6;
    cam.orthoBottom = -6;
    cam.orthoLeft = -6;
    cam.orthoRight = 6;
  }

  //Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // TODO: Import materials and set up the grid
  // Create the grid material
  // const gridMap = new BABYLON.GridMaterial("grid-mat", scene);
  // gridMap.majorUnitFrequency = 0.1;
  // gridMap.gridRatio = 1;
  // gridMap.backFaceCulling = false;
  // gridMap.opacity = 0.5;
  // gridMap.lineColor = Color3.FromHexString(labColors.slate8);
  // gridMap.mainColor = Color3.FromHexString(labColors.slate7);

  let background;
  const grid = BABYLON.MeshBuilder.CreateGround("grid", { width: 10, height: 6 }, scene);
  grid.rotation.x = Math.PI / 2;
  grid.position = new BABYLON.Vector3(-5, -3, -2);
  // grid.material = gridMap;
  cam.setTarget(grid);

  const layoutMat = new BABYLON.StandardMaterial("timeline-material", scene);
  layoutMat.diffuseColor = BABYLON.Color3.FromHexString("#f1f5f9");
  layoutMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  layoutMat.alpha = 0.5;

  const baselayer = new BABYLON.StandardMaterial("timeline-material", scene);
  baselayer.diffuseColor = BABYLON.Color3.FromHexString("#f1f5f9");
  baselayer.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  baselayer.alpha = 0.5;

  // TODO: Replace this with incoming data from FileMaker
  // fetch the XML data from the sample-data folder
  const layersData = await fetch("../sample-data/project-layers.xml").then((res) => res.text());

  // parse the XML data into an XMLDocument
  const parser = new DOMParser();
  const layersDoc = parser.parseFromString(layersData, "text/xml");

  const createLayerBox = (deep, bounds, node, scene, material) => {
    const offset = 100;
    const width = (bounds.right - bounds.left) / offset;
    const height = (bounds.bottom - bounds.top) / offset;
    const posX = bounds.posX / offset + width / 2;
    const posY = bounds.posY / offset + height / 2;

    const layerBox = BABYLON.MeshBuilder.CreateBox("layer-box", { width: width, height: height, depth: 0.05 }, scene);
    layerBox.position.x = -posX;
    layerBox.position.y = -posY;
    layerBox.position.z = deep;
    layerBox.material = material;

    const am = new BABYLON.ActionManager(scene);
    layerBox.actionManager = am;
    layerBox.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
        console.log("Clicked on", node.getAttribute("type"), deep, bounds);
        cam.setTarget(layerBox);
        if (node.getAttribute("type")) {
          if (title) {
            title.text = node.getAttribute("type");
            description.text = new XMLSerializer().serializeToString(node);
          }
        } else {
          title.text = "Root Object";
          description.text = "";
        }
      })
    );
  };

  // TODO: Rename this
  // Function to log object type and count of ancestor Object nodes
  function logObjectTypeAndAncestors(node) {
    if (node.nodeName === "Object") {
      let bounds = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        posX: 0,
        posY: 0
      };

      // get the first Bounds child node
      const boundsNode = node.querySelector("Bounds");
      if (boundsNode) {
        bounds.posY = Number(boundsNode.getAttribute("top") ?? 0);
        bounds.posX = Number(boundsNode.getAttribute("left") ?? 0);
        bounds.top = Number(boundsNode.getAttribute("top") ?? 0);
        bounds.left = Number(boundsNode.getAttribute("left") ?? 0);
        bounds.right = Number(boundsNode.getAttribute("right") ?? 0);
        bounds.bottom = Number(boundsNode.getAttribute("bottom") ?? 0);
      }

      let ancestorCount = 0;
      let parentNode = node.parentNode;
      while (parentNode) {
        if (parentNode.nodeName === "Object") {
          // Accumulate the count of ancestor Object nodes - used for the z order of layers, containment, etc.
          ancestorCount++;
          // Add the parent's bounds to the current bounds to get the position
          const parentBoundsNode = parentNode.querySelector("Bounds");
          if (parentBoundsNode) {
            bounds.posX += Number(parentBoundsNode.getAttribute("left") ?? 0);
            bounds.posY += Number(parentBoundsNode.getAttribute("top") ?? 0);
          }
        }
        parentNode = parentNode.parentNode;
      }

      const previousSiblings = node.parentNode?.querySelectorAll("Object");

      if (previousSiblings) {
        let previousSiblingCount = 0;

        for (let i = 0; i < previousSiblings.length; i++) {
          const sibling = previousSiblings[i];

          // Check if the sibling is before the current node
          if (sibling === node) {
            break; // Stop counting when we reach the current node
          }

          // Calculate the offset for each sibling by using half of the space between major layers
          const offZ = 0.9 / previousSiblings.length;
          // Increment the count for each valid sibling
          previousSiblingCount += offZ;
        }

        ancestorCount += previousSiblingCount;
      }

      console.log("Object Type:", node.getAttribute("type"), "Deep:", ancestorCount, "Bounds:", bounds);
      createLayerBox(ancestorCount, bounds, node, scene, baselayer);
    }
  }

  // Find and process Object nodes
  const objectNodes = layersDoc.querySelectorAll("Object");
  objectNodes.forEach(logObjectTypeAndAncestors);

  // Create the layout layer - FileMaker calculates the bounds of the layout objects, not the layout itself
  const layoutNode = layersDoc.querySelector("Layout");
  if (layoutNode) {
    const layoutTop = Number(layoutNode.getAttribute("enclosingRectTop") ?? 0);
    const layoutLeft = Number(layoutNode.getAttribute("enclosingRectLeft") ?? 0);
    const layoutRight = Number(layoutNode.getAttribute("enclosingRectRight") ?? 0);
    const layoutBottom = Number(layoutNode.getAttribute("enclosingRectBottom") ?? 0);

    let layoutBounds = {
      top: layoutTop,
      left: layoutLeft,
      right: layoutRight,
      bottom: layoutBottom,
      posX: 0,
      posY: 0
    };

    createLayerBox(-1, layoutBounds, layoutNode, scene, layoutMat);
  }

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        if (kbInfo.event.key === "m") {
          if (cam.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
            cam.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
          } else {
            cam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
          }
        }
        if (kbInfo.event.key === "g") {
          if (grid.visibility == 1) {
            grid.visibility = 0;
          } else {
            grid.visibility = 1;
          }
        }
        if (kbInfo.event.key === "i") {
          if (inspector.isVisible) {
            inspector.isVisible = false;
          } else {
            inspector.isVisible = true;
          }
        }
        if (kbInfo.event.key === "o") {
          if (inspector.width == "25%") {
            inspector.width = "50%";
            advancedTexture.markAsDirty();
          } else {
            inspector.width = "25%";
            advancedTexture.markAsDirty();
          }
        }
        if (kbInfo.event.key === "Escape") {
          cam.setTarget(grid);
          title.text = "Select an object";
          description.text = "";
          advancedTexture.markAsDirty();
        }
        break;
    }
  });

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
