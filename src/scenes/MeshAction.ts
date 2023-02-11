import { 
    Scene, 
    Engine, 
    FreeCamera, 
    Vector3, 
    SceneLoader,
    MeshBuilder,
    Color3,
    DirectionalLight,
    ActionManager,
    InterpolateValueAction,
    IncrementValueAction,
    Mesh,
    SetValueAction,
    ShadowGenerator,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

import { Conversation } from "./Conversation";

export class MeshAction{
    scene: Scene;
    engine: Engine;

    lightKey: DirectionalLight;
    lightFill: DirectionalLight;
    shadowKey: ShadowGenerator;

    constructor(private canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();

        // key light
        this.lightKey = new DirectionalLight(
            "lightKey",
            new Vector3(4, -4, 4),
            this.scene
        );
        this.lightKey.intensity = 0.5;

        // fill light
        this.lightFill = new DirectionalLight(
            "lightFill",
            new Vector3(4, -4, 2),
            this.scene
        );
        this.lightFill.intensity = 0.5;
        this.lightFill.specular = new Color3(0, 0, 0);

        this.shadowKey = new ShadowGenerator(1024, this.lightKey);
        this.shadowKey.useExponentialShadowMap = true;

        //this.CreateMap();

        this.CreateController();

        this.CreateCapsule(0.25, new Vector3(0, 0.125, 0));
        this.CreateSphere(0.25, new Vector3(-0.25, 0.125, 0));
        this.CreateTorus(0.167, new Vector3(0.25, 0.125, 0));

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    CreateScene(): Scene {
    
        const scene = new Scene(this.engine);
    
        // gravity
        const fps = 60;
        const g = -9.8;
        scene.gravity = new Vector3(0, g/fps, 0);

        // enable collision 
        scene.collisionsEnabled = true;

        scene.shadowsEnabled = true;

        const ground = MeshBuilder.CreateGround("ground", {
            width: 6,
            height: 6
        });
        ground.checkCollisions = true;
        ground.receiveShadows = true;
    
        return scene;
    }

    CreateCapsule(size: number, location: Vector3): void {
        const meshCapsule = MeshBuilder.CreateCapsule(
            "meshCapsule",
            {},
            this.scene
        );
        meshCapsule.scaling = new Vector3(size, size, size);
        meshCapsule.position = location;

        this.shadowKey.addShadowCaster(meshCapsule);

        const meshPlane = MeshBuilder.CreatePlane(
            "meshPlane",
            {width: 1.25, height: 1},
            this.scene
        );
        meshPlane.position.y = -10;
        meshPlane.parent = meshCapsule;

        meshPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const advancedTexture = AdvancedDynamicTexture.CreateForMesh(meshPlane);

        const buttonHide = Button.CreateSimpleButton("buttonHide", "Click to hide");
        buttonHide.cornerRadius = 100;
        buttonHide.color = "white";
        buttonHide.fontSize = 150;
        buttonHide.background = "green";
        buttonHide.onPointerUpObservable.add(function () {
            meshPlane.position.y = -10;
        });
        advancedTexture.addControl(buttonHide);

        // add actionManager
        meshCapsule.actionManager = new ActionManager(this.scene);
        meshCapsule.actionManager.registerAction(
            // check out other types of actions in the API document
            new SetValueAction(
                // the most common trigger
                ActionManager.OnPickUpTrigger,
                meshPlane,
                "position.y",
                5 // final position
            )
        );
    }

    CreateSphere(size: number, location: Vector3): void {
        const meshSphere = MeshBuilder.CreateSphere(
            "meshSphere",
            {diameter: size},
            this.scene
        );
        meshSphere.position = location;

        this.shadowKey.addShadowCaster(meshSphere);

        // add actionManager
        meshSphere.actionManager = new ActionManager(this.scene);
        meshSphere.actionManager
        .registerAction(
            // check out other types of actions in the API document
            new InterpolateValueAction(
                // the most common trigger
                ActionManager.OnPickUpTrigger,
                meshSphere,
                "position.y",
                0.25, // final position
                1000 // time in ms
            )
        )!
        // if mesh is alreadt moved up, then move it down
        .then(
            // check out other types of actions in the API document
            new InterpolateValueAction(
                // the most common trigger
                ActionManager.OnPickUpTrigger,
                meshSphere,
                "position.y",
                0.125, // final position
                200 // time in ms
            )
        );
    }

    CreateTorus(size: number, location: Vector3): void {
        const meshTorus = MeshBuilder.CreateTorus(
            "meshTorus",
            {},
            this.scene
        );
        meshTorus.scaling = new Vector3(size, size, size);
        meshTorus.position = location;

        this.shadowKey.addShadowCaster(meshTorus);

        // add actionManager
        this.scene.actionManager = new ActionManager(this.scene);
        this.scene.actionManager.registerAction(
            // check out other types of actions in the API document
            new IncrementValueAction(
                // the most common trigger
                ActionManager.OnEveryFrameTrigger,
                meshTorus,
                "rotation.x",
                0.01, // final position
            )
        );
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
        const camHeight = 0.3;
        const camera = new FreeCamera(
            "camera",
            new Vector3(0, camHeight, -1),
            this.scene
        );

        camera.setTarget(new Vector3(0, camHeight, 0));
       
        // attach the default controller to the camera
        camera.attachControl();

        // set camera linear speed, lower is slower
        camera.speed = 0.05;

        // set near clipping plane
        camera.minZ = 0.01;

        // set camera angular speed, higher is slower
        camera.angularSensibility = 2500;

        // apply gravity so the camere will not fly to the sky
        camera.applyGravity = true;
        
        // enable collision so the camera will not fall through the ground
        camera.checkCollisions = true;

        // set the size of the camere collision object (a sphere)
        camera.ellipsoid = new Vector3(0.1, camHeight/2, 0.1);

        // Add WASD keys to the controller
        // camera.keysX is an arreys so simply push a new value
        camera.keysUp.push(87); // W
        camera.keysDown.push(83); // S
        camera.keysLeft.push(65); // A
        camera.keysRight.push(68); // D
    }
}