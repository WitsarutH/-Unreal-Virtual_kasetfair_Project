import { 
    Scene,
    AbstractMesh,
    MeshBuilder,
    Mesh,
    ActionManager,
    SetValueAction,
    Vector3
} from "@babylonjs/core"
import { 
    AdvancedDynamicTexture,
    Button,
} from "@babylonjs/gui";
import "@babylonjs/loaders";

export function Conversation(scene: Scene, mesh:AbstractMesh, text: string ): void{

    // set plane
    const meshPlane = MeshBuilder.CreatePlane(
        "meshPlane",
        { width: 1.25, height: 1},
        scene
    )
    meshPlane.parent = mesh;
    meshPlane.position.y = 100;
    meshPlane.rotate(new Vector3(0, 1, 0), 180*(Math.PI/180));
    meshPlane.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(meshPlane);

    // set button
    const buttonHide = Button.CreateSimpleButton("buttonHide", text);
    buttonHide.cornerRadius = 100;
    buttonHide.setPadding("10","10","10","10");
    buttonHide.rotation = 180*(Math.PI/180)
    buttonHide.color = "white";
    buttonHide.fontSize = 150
    buttonHide.background = "orange";
    buttonHide.onPointerUpObservable.add(function() {
        meshPlane.position.y = 100;
    })

    // set button to plae
    advancedTexture.addControl(buttonHide);

    // set action manager to mesh
    mesh.actionManager = new ActionManager(scene);
    // register action and set value action
    mesh.actionManager.registerAction(
            new SetValueAction(
                ActionManager.OnPickUpTrigger,
                meshPlane,
                "position.y",
                -1
            )
        )
        
        // setTimeout(() => {
        //     meshPlane.position.y = 10;
        // }, 5000)   
}