import { FreeCamera, Scene, Vector3 } from "@babylonjs/core";


export function CreateFPController(scene: Scene){

    const camera = new FreeCamera("camera", new Vector3(-1, 2.25, 0), scene);

    // This attaches the camera to the canvas
        camera.attachControl();

    // set near clipping plane
    camera.minZ = 0.01;
    
    // set camera linear speed, lower is slower
    camera.speed = 0.25;

    // set camera angular speeed, higher is slower
    camera.angularSensibility = 5000;

    // apply gravity then the camera will not fly to the sky
    camera.applyGravity = true;

    // enable collision then the camera will not fall through the ground
    camera.checkCollisions = true;

    // set the size of the camera collision object (a sphere)
    camera.ellipsoid = new Vector3(.7, .7, .7);

    // add WASD keys controller
    camera.keysUp.push(87);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);
    camera.keysDown.push(83);
}