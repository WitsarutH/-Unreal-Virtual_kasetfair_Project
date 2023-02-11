import{
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
  AbstractMesh
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF";
  
export class ThirdPerson{
  scene: Scene;
  engine: Engine;
  
  constructor(private canvas:HTMLCanvasElement){
    this.engine = new Engine(this.canvas, true);
      this.scene = this.CreateScene();
      this.CreateMap();
          
      this.engine.runRenderLoop(() => {
            this.scene.render();
      });
  }
  
  CreateScene(): Scene {
    const keys = {
      left: 0,
      right: 0,
      forward: 0,
      back: 0
    }
  
    const scene = new Scene(this.engine);
    scene.collisionsEnabled = true
  
    //ล็อคหน้าจอไปกับการหมุนเมาส์
    scene.onPointerDown = (evt) => {
      // left click เข้าสู่การล็อค
      if(evt.button === 0) this.engine.enterPointerlock();
      // right click ออกจากการล็อค
      if(evt.button === 2) this.engine.exitPointerlock();
    }
  
    // สร้าง camera และ setting ต่างๆ
    const camera = new ArcRotateCamera('arcCamera1', 0, 0, 0, Vector3.Zero(), scene)
    camera.attachControl()
    camera.setPosition(new Vector3(2, 5, 15));
    camera.speed = 0.05;
    camera.minZ = 0.01;
    //camera.checkCollisions = true;
    camera.lowerRadiusLimit = 3
    camera.upperRadiusLimit = 3

    //สร้าง light และ setting ต่างๆ
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    //import model ตัวละคร เข้าสู้ scene
    SceneLoader.ImportMesh("", "./assets/", "guy.glb", scene, (newMeshes) => {
      
      // เซ็ทให้ camera มองไปยัง model ตัวละคร
      camera.setTarget(newMeshes[1])
      
      // จัดทำแหน่งของตัวละคร
      newMeshes[0].position.y = 1;
      newMeshes[0].position.z = 2;

      // ความเร็วการเดินของตัวละคร
      let speed = 0.025
  
      // การเคลื่อนที่ของ camera ตามการเดินของตัวละคร
      function update() {
        const cameraForwardRayPosition = camera.getForwardRay().direction;
        const cameraForwardRayPositionWithoutY = new Vector3(cameraForwardRayPosition.x, 0, cameraForwardRayPosition.z)

        if (keys) {
          if (keys.left) {
              newMeshes[0].locallyTranslate(new Vector3(-speed, 0, 0))
          }
          if (keys.right) {
              newMeshes[0].locallyTranslate(new Vector3(speed, 0, 0))
          }
          if (keys.forward) {
              newMeshes[0].lookAt(newMeshes[0].position.add(cameraForwardRayPositionWithoutY), 0, 0, 0);
              newMeshes[0].position = newMeshes[0].position.add(new Vector3(cameraForwardRayPosition.x * speed, 0, cameraForwardRayPosition.z * speed));
            }
          if (keys.back) {
              newMeshes[0].lookAt(newMeshes[0].position.add(cameraForwardRayPositionWithoutY), 0, 0, 0);
              newMeshes[0].position = newMeshes[0].position.add(new Vector3(-cameraForwardRayPosition.x * speed, 0, -cameraForwardRayPosition.z * speed));
          }
        }
     }

      this.engine.runRenderLoop(() => {
        if (newMeshes[0] != null) {
        update()
        }
      })

      //การเดินซ้าย ขวา หน้า หลังและการวิ่ง
      window.addEventListener('keydown', handleKeyDown, false)
      window.addEventListener('keyup', handleKeyUp, false)

      let action = 16
      function handleKeyDown (evt: any) {
        if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 1 // A
        if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 1 // D
        if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 1 // W
        if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 1 // S
        if (evt.keyCode == 16) speed = 0.075; // shift

        if (action !== evt.keyCode) {
          action = evt.keyCode
        }
      }

      function handleKeyUp (evt: any) {
        if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 0
        if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 0
        if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 0
        if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 0
        if (evt.keyCode == 16) speed = 0.05
        action = evt.keyCode
      }
    });
      return scene;
  }
    
  //import สภาพแวดล้อม ร้านค้า ต้นไม้
  async CreateMap(): Promise<void> {
    // only get the meshes from the glb scene files
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "", 
      "./assets/", 
      "map.glb", 
      this.scene
    );
  
    // enable collision for all meshes
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
    });
  }
}
  