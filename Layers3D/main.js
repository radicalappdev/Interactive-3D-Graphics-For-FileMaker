import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui/2D";
import { GridMaterial } from "@babylonjs/materials";

console.log("main.js loaded");

const createScene = async () => {
  // get the canvas from the DOM
  const canvas = document.getElementById("bjsCanvas");

  let focusedMesh = null; // just a hack to keep track of the focused mesh

  // Create the enging and scene
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio); // used to fix the scaling issue on high DPI screens, maily mainly applies to GUI
  scene.clearColor = BABYLON.Color3.FromHexString("#1e293b");
  const boundingBoxRenderer = scene.getBoundingBoxRenderer();
  if (boundingBoxRenderer) {
    boundingBoxRenderer.frontColor.set(0.1, 1, 0.1);
    boundingBoxRenderer.backColor.set(0.1, 1, 0.1);
  }

  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("overlay", true, scene);

  const inspector = new GUI.StackPanel("gui-inspector");
  inspector.width = "25%";
  inspector.height = "100%";
  inspector.background = "#334155";
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
  title.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
  title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  inspector.addControl(title);

  // add a button to the inspector to toggle the size
  const toggleSize = GUI.Button.CreateSimpleButton("gui-size", "Toggle Size");
  toggleSize.textBlock.fontSize = "24px";
  toggleSize.width = "200px";
  toggleSize.height = "80px";
  toggleSize.color = "white";
  toggleSize.background = "#3e4a5d";
  toggleSize.cornerRadius = 0;
  toggleSize.thickness = 0;
  toggleSize.right = "25%";
  toggleSize.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  toggleSize.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  toggleSize.onPointerUpObservable.add(() => {
    if (inspector.width == "25%") {
      inspector.width = "75%";
      advancedTexture.markAsDirty();
    } else {
      inspector.width = "25%";
      advancedTexture.markAsDirty();
    }
  });
  advancedTexture.addControl(toggleSize);

  const scroll = new GUI.ScrollViewer("gui-scroll");
  scroll.thickness = 10;
  scroll.color = "#3e4a5d";
  scroll.background = "#3e4a5d";
  scroll.width = "100%";
  scroll.height = `${engine.getRenderHeight() - 80}px`; // a hack to size the scroll viewer to the window while not using percentages in the stack panel
  scroll.barSize = 20;
  scroll.barColor = "#53637b";
  scroll.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scroll.wheelPrecision = 0.005;
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
  description.textWrapping = false;
  description.width = 1;
  description.height = 5;
  description.paddingTop = "1%";
  description.paddingLeft = "30px";
  description.paddingRight = "20px";
  description.paddingBottom = "5%";
  description.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
  description.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  description.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  scroll.addControl(description);

  // Add a button called mode to the top left corner of the advancedTexture
  const mode = GUI.Button.CreateSimpleButton("gui-mode", "Perspective");
  mode.textBlock.fontSize = "24px";
  mode.width = "200px";
  mode.height = "80px";
  mode.color = "white";
  mode.background = "#3e4a5d";
  mode.cornerRadius = 0;
  mode.thickness = 0;
  mode.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  mode.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  mode.onPointerUpObservable.add(() => {
    if (cam.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
      cam.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
      mode.textBlock.text = "Perspective";
    } else {
      cam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
      mode.textBlock.text = "Orthographic";
    }
  });
  advancedTexture.addControl(mode);

  // Add a button to toggle the inspector
  const toggleInspector = GUI.Button.CreateSimpleButton("gui-inspector", "Inspector");
  toggleInspector.textBlock.fontSize = "24px";
  toggleInspector.width = "200px";
  toggleInspector.height = "80px";
  toggleInspector.color = "white";
  toggleInspector.background = "#3e4a5d";
  toggleInspector.cornerRadius = 0;
  toggleInspector.thickness = 0;
  toggleInspector.top = "82px";
  toggleInspector.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  toggleInspector.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  toggleInspector.onPointerUpObservable.add(() => {
    if (inspector.isVisible) {
      inspector.isVisible = false;
      toggleSize.isVisible = false;
    } else {
      inspector.isVisible = true;
      toggleSize.isVisible = true;
    }
  });
  advancedTexture.addControl(toggleInspector);

  const toolbar = new GUI.StackPanel("gui-inspector");
  toolbar.width = "25%";
  toolbar.height = "80px";
  toolbar.zIndex = -1;
  toolbar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  advancedTexture.addControl(toolbar);

  // Add a text block called focus that can show the name of the object we are hovering over
  const focus = new GUI.TextBlock("gui-focus");
  focus.text = "";
  focus.color = "white";
  focus.fontSize = "32px";
  focus.fontWeight = "bold";
  focus.textWrapping = true;
  focus.height = "80px";
  focus.paddingTop = "20px";
  focus.paddingBottom = "16px";
  focus.paddingLeft = "16px";
  focus.paddingRight = "16px";
  focus.fontFamily = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
  focus.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  focus.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  toolbar.addControl(focus);

  // Create a camera
  const cam = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 15, new BABYLON.Vector3(-5, -3, 0), scene);
  cam.attachControl(scene.getEngine().getRenderingCanvas(), true);
  cam.wheelDeltaPercentage = 0.01;
  cam.lowerRadiusLimit = 1;
  cam.upperRadiusLimit = 100;
  if (cam) {
    // Calculate the ortho size based on current engine size
    cam.orthoTop = engine.getRenderHeight() / 4 / 100;
    cam.orthoBottom = -(engine.getRenderHeight() / 4 / 100);
    cam.orthoLeft = -(engine.getRenderWidth() / 4 / 100);
    cam.orthoRight = engine.getRenderWidth() / 4 / 100;
  }

  //Create a basic light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  // Create the grid material
  const gridMap = new GridMaterial("grid-mat", scene);
  gridMap.majorUnitFrequency = 0.1;
  gridMap.gridRatio = 1;
  gridMap.backFaceCulling = false;
  gridMap.opacity = 0.5;
  gridMap.lineColor = BABYLON.Color3.FromHexString("#e2e8f0");
  gridMap.mainColor = BABYLON.Color3.FromHexString("#f1f5f9");

  let background;
  const grid = BABYLON.MeshBuilder.CreateGround("grid", { width: 100, height: 100 }, scene);
  grid.rotation.x = Math.PI / 2;
  grid.position = new BABYLON.Vector3(-5, -3, -2);
  grid.material = gridMap;
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
        // Hide the bounding box on the previously focused mesh
        if (focusedMesh) {
          focusedMesh.showBoundingBox = false;
        }
        layerBox.showBoundingBox = true;
        focusedMesh = layerBox;

        if (node.getAttribute("type")) {
          if (title) {
            title.text = node.getAttribute("type");
            description.text = new XMLSerializer().serializeToString(node);
          }
        } else {
          title.text = "Layout";
          description.text = layersData;
        }
        // scroll to the top of the scroll viewer
        description.resizeToFit = true;
        scroll.verticalBar.value = 0;
        scroll.horizontalBar.value = 0;
        advancedTexture.markAsDirty();
      })
    );
    // add a hover action
    layerBox.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (evt) => {
        focus.text = node.getAttribute("type") ?? "";
      })
    );
    // on mouse out, reset the focus text
    layerBox.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (evt) => {
        focus.text = "";
      })
    );
  };

  // Function to log object type and count of ancestor Object nodes
  function processNodes(node) {
    if (node.nodeName === "Object") {
      let bounds = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        posX: 0,
        posY: 0
      };

      //remove the FullCSS node from the object. It may be a couple of levels down
      const fullCSSNode = node.querySelector("FullCSS");
      if (fullCSSNode) {
        fullCSSNode.remove();
      }

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

      // console.log("Object Type:", node.getAttribute("type"), "Deep:", ancestorCount, "Bounds:", bounds);
      createLayerBox(ancestorCount, bounds, node, scene, baselayer);
    }
  }

  // Find and process Object nodes
  const objectNodes = layersDoc.querySelectorAll("Object");
  objectNodes.forEach(processNodes);

  // Create the layout layer - FileMaker calculates the bounds of the layout objects, not the layout itself
  let layoutNode = layersDoc.querySelector("Layout");
  // Append a type to the layout node so we can use it in the inspector and focus displays
  layoutNode.setAttribute("type", "Layout");
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
            mode.textBlock.text = "Perspective";
            cam.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
          } else {
            mode.textBlock.text = "Orthographic";
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
            toggleSize.isVisible = false;
          } else {
            inspector.isVisible = true;
            toggleSize.isVisible = true;
          }
        }
        if (kbInfo.event.key === "o") {
          inspector.isVisible = true;
          toggleSize.isVisible = true;
          if (inspector.width == "25%") {
            inspector.width = "75%";
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
    const scene = engine.scenes[0];
    const cam = scene.cameras[0];
    cam.orthoTop = engine.getRenderHeight() / 4 / 100;
    cam.orthoBottom = -(engine.getRenderHeight() / 4 / 100);
    cam.orthoLeft = -(engine.getRenderWidth() / 4 / 100);
    cam.orthoRight = engine.getRenderWidth() / 4 / 100;
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
