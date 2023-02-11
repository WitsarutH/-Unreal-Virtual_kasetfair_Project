import { ActionManager, Engine, ExecuteCodeAction, Mesh, Scene, SceneLoader, SetValueAction } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { Conversation } from "./Conversation";
import { MeshInteraction } from "./MeshInteract";
import{
    mainGUI,
    shopGUI
}from "./GUI";
// create map
export async function CreateMap(scene: Scene, engine:Engine,advancedTexture:AdvancedDynamicTexture): Promise<void> {
    // init loadingUI
    engine.displayLoadingUI();

    // import meshes from map.glb
    const { meshes } = await SceneLoader.ImportMeshAsync(
        "", 
        "./assets/", 
        "map.glb", 
        scene
    );
    
    //let i = 0
    meshes.map((mesh) => {
        mesh.checkCollisions = true;

        // check index of meshes
        // if(i < 700)
        //     console.log(mesh.name, i);
        //     i++;
    });

    const showShop0 = function(){shopGUI(advancedTexture,0,scene);}
    const showShop1 = function(){shopGUI(advancedTexture,1,scene);}
    const showShop2 = function(){shopGUI(advancedTexture,2,scene);}
    const showShop3 = function(){shopGUI(advancedTexture,3,scene);}
    const showShop4 = function(){shopGUI(advancedTexture,4,scene);}
    const showShop5 = function(){shopGUI(advancedTexture,5,scene);}

    const maleShopRed = meshes[640];
    maleShopRed.actionManager = new ActionManager();
    maleShopRed.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop0)
        )

    const maleShopVet = meshes[615];
    maleShopVet.actionManager = new ActionManager();
    maleShopVet.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop5)
        )

    const femaleShopMap = meshes[487];
    femaleShopMap.actionManager = new ActionManager();
    femaleShopMap.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop4)
        )

    const maleShopTea = meshes[620];
    maleShopTea.actionManager = new ActionManager();
    maleShopTea.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop3)
        )

    const femaleShopcake = meshes[499];
    femaleShopcake.actionManager = new ActionManager();
    femaleShopcake.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop1)
        )

    const femaleShopWater = meshes[457];
    femaleShopWater.actionManager = new ActionManager();
    femaleShopWater.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickUpTrigger,showShop2)
        )
    
    
    const female = meshes[490];
    const female2 = meshes[502];
    const female3 = meshes[466];
    const female4 = meshes[472];
    const man = meshes[633];
    const man1 = meshes[657];

    // set conversation to female hair
    Conversation(scene, female, "Hello!");
    Conversation(scene, female2, "Hi!")
    Conversation(scene, female3, "Look!")
    Conversation(scene, female4, "Too late!")

    Conversation(scene, man, "awesome!");
    Conversation(scene, man1, "Beautiful!");

    // set mesh interaction to mesh
    let j:number
    for(j=1880; j<= 1892; j++)
        MeshInteraction(meshes[j], scene);
    for(j=1895; j<= 1906; j++)
        MeshInteraction(meshes[j], scene);
    for(j=590; j<= 612; j++)
        MeshInteraction(meshes[j], scene);

    // when all meshes are loaded, hide loadingUI
    engine.hideLoadingUI();
}