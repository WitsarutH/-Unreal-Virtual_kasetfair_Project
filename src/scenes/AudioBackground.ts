import { Scene, Sound } from "@babylonjs/core";

export async function CreateBackgroundAudio(scene: Scene) {
    // init song to object
    const backgroundMusic = new Sound(
        "backgroundMusic",
        "./song/The_Witcher_Soundtrack.mp3",
        scene,
        null,
        {
            volume: 0,
            autoplay: true
        }
    );

    // set fade volume
    backgroundMusic.setVolume(.30, 10);
}