import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
BABYLON.GUI = GUI; // assing GUI to BABYLON.GUI to match the usage in the playgrounds

console.log("main.js loaded");

window.addEventListener("DOMContentLoaded", async function () {
  // get the canvas with id "bjsCanvas"
  var canvas = document.getElementById("bjsCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = async function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.attachControl(canvas, true);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    var material = new BABYLON.StandardMaterial(scene);
    material.alpha = 1;
    material.diffuseColor = new BABYLON.Color3.FromHexString("#9ba8b8");

    var cube = BABYLON.MeshBuilder.CreateBox("box", {
      height: 1,
      width: 1,
      depth: 1
    });

    return scene;
  };

  // Start the render loop
  var scene = await createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
});
