import { Scene, Vector3, HemisphericLight } from "@babylonjs/core";

export function ConfigScene(scene: Scene): void{
   
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // set value gravity
    const g = -9.8;

    // set frame rate
    const fps = 60;

    scene.gravity = new Vector3(0, g / fps, 0);

    // set collision on scene
    scene.collisionsEnabled = true;

    // make scene support XR
    scene.createDefaultXRExperienceAsync();
}