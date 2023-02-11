import { 
    Scene,
    Engine,
} from "@babylonjs/core";


import "@babylonjs/loaders/";
import "@babylonjs/gui"
import { CreateMap } from "./CreateMap";
import { CreateFPController } from "./CreateFirstPerson";
import{
    mainGUI
}from "./GUI";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { ConfigScene } from "./ConfigScene";
import { CreateBackgroundAudio } from "./AudioBackground";


export class Playground{

    advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    constructor(private engine: Engine, private scene: Scene, private canvas:HTMLCanvasElement){

        CreateFPController(scene);
        //CreateJoystickController(this.scene);
        this.CreateGUI(scene);
        CreateMap(scene, engine,this.advancedTexture);
        CreateBackgroundAudio(scene)
        ConfigScene(scene);
    }

    async CreateGUI(scene:Scene): Promise<void>{
        this.advancedTexture.idealHeight = 800;
        this.advancedTexture.idealWidth = 1600;
        this.advancedTexture.renderAtIdealSize = true;

        const showMainGUI = () =>{mainGUI(this.advancedTexture,scene);}
        showMainGUI();
    }
    


}

