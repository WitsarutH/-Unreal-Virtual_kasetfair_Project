import { AbstractMesh, ActionManager, InterpolateValueAction, Scene} from "@babylonjs/core";

export function MeshInteraction(mesh: AbstractMesh, scene: Scene): void{
    // set actionmanager
    mesh.actionManager = new ActionManager(scene);

    // set start position
    const meshY = mesh.position.y
    // register action => interpolateValue
    // final position = position y + 0.15
    mesh.actionManager
        .registerAction(
            // check out other types of actions in the API document
            new InterpolateValueAction(
                // the most common trigger
                ActionManager.OnPickUpTrigger,
                mesh,
                "position.y",
                mesh.position.y + 0.15, // final position
                1000 // time in ms
            )
        )!
        // if mesh is alreadt moved up, then move it down
        // final position = old position ( meshY )
        .then(
            // check out other types of actions in the API document
            new InterpolateValueAction(
                // the most common trigger
                ActionManager.OnPickUpTrigger,
                mesh,
                "position.y",
                meshY, // final position
                500 // time in ms
            )
        );
}