<template>
  <div id = Babylon> 
    <h1>KasetFair</h1>
    <canvas> </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Playground } from '@/scenes/Playground'
import { Engine, Scene } from '@babylonjs/core';
import { ThirdPerson } from '@/scenes/ThirdPerson';

export default defineComponent({
  name: 'BabylonJS',
  mounted() {
      const canvas = document.querySelector("canvas");
      if(canvas){
        // init engine and scene
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        // scene class
        new Playground(engine, scene, canvas);

        //new ThirdPerson(canvas);

        // render loop
        engine.runRenderLoop(() => {
          scene.render();
        })

        window.addEventListener("resize", function() {
          engine.resize();
        })
      }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #Babylon{
    text-align: center;
  }

  canvas{
    width: 85vw;
    margin: auto;
  }

</style>