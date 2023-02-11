import { 
    VirtualJoysticksCamera, 
    Vector3, 
    Scene,
} from "@babylonjs/core";

export function CreateJoystickController(scene: Scene){
    const joystickCamera = new VirtualJoysticksCamera("VJC", new Vector3(-1.5, 1.5, 0), scene);
    
    joystickCamera.attachControl();
    
    // set near clipping plane
    joystickCamera.minZ = 0.1;
    // set camera linear speed, lower is slower
    joystickCamera.speed = 0.2;

    joystickCamera.inverseRotationSpeed = 0.25;

    // set camera angular speeed, higher is slower
    joystickCamera.angularSensibility = 10000;

    // enable collision then the camera will not fall through the ground
    joystickCamera.checkCollisions = true;

    // apply gravity then the camera will not fly to the sky
    joystickCamera.applyGravity = true;

    // set the size of the camera collision object (a sphere)
    joystickCamera.ellipsoid = new Vector3(.7, .7, .7);
}