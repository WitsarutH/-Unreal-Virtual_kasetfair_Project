import { 
    Scene, 
    Engine, 
    FreeCamera, 
    Vector3, 
    HemisphericLight, 
    SceneLoader,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";

export class FirstPerson{
    scene: Scene;
    engine: Engine;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateMap();
        this.CreateController();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
    
        const scene = new Scene(this.engine);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        light.intensity = 0.7;
    
        // gravity
        const fps = 60;
        const g = -9.8;
        scene.gravity = new Vector3(0, g/fps, 0);

        // lock mouse pointer
        scene.onPointerDown = (evt) => {
            // left click
            if(evt.button === 0) this.engine.enterPointerlock();
            // right click
            if(evt.button === 2) this.engine.exitPointerlock();
        }

        // enable collision 
        scene.collisionsEnabled = true;
    
        return scene;
    }

    async CreateMap(): Promise<void> {
        // only get the meshes from the glb scene files
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./assets/",
            "village.glb",
            this.scene
        );

        // enable collision for all meshes
        meshes.map((mesh) => {
            mesh.checkCollisions = true;
        });
    }

    CreateController(): void{
        // creates and positions a free camere(non-mesh)
        const camera = new FreeCamera("camera", new Vector3(0, 0.5, 0), this.scene);
        
        // attach the default controller to the camera
        camera.attachControl();

        // set camera linear speed, lower is slower
        camera.speed = 0.05;

        // set near clipping plane
        camera.minZ = 0.01;

        // set camera angular speed, higher is slower
        camera.angularSensibility = 5000;

        // apply gravity so the camere will not fly to the sky
        camera.applyGravity = true;
        
        // enable collision so the camera will not fall through the ground
        camera.checkCollisions = true;

        // set the size of the camere collision object (a sphere)
        camera.ellipsoid = new Vector3(0.1, 0.1, 0.1);

        // Add WASD keys to the controller
        // camera.keysX is an arreys so simply push a new value
        camera.keysUp.push(87); // W
        camera.keysDown.push(83); // S
        camera.keysLeft.push(65); // A
        camera.keysRight.push(68); // D
    }
}