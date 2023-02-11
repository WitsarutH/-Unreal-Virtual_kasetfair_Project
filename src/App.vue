<template>
  <Babylon />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Babylon from './components/Babylon.vue';

export default defineComponent({
  name: 'App',
  components: {
    Babylon: Babylon
  }
});
</script>