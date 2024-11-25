<template>
  <div class="w-screen h-screen relative">
    <TresCanvas window-size>
      <TresPerspectiveCamera :position="[0, 0, 5]" />
      <OrbitControls :enable-pan="false" :enable-zoom="false" />
      <!-- :auto-rotate="true" :auto-rotate-speed="10" -->


      <TresMesh :rotation="getEular(gesture, 'XYZ')">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <!-- <TresMesh :rotation="getEular(gesture, 'XYZ')" :position="[-1, -1, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <TresMesh :rotation="getEular(gesture, 'XZY')" :position="[-1, 0, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <TresMesh :rotation="getEular(gesture, 'YXZ')" :position="[-1, 1, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <TresMesh :rotation="getEular(gesture, 'YZX')" :position="[0, -1, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <TresMesh :rotation="getEular(gesture, 'ZXY')" :position="[0, 0, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

      <TresMesh :rotation="getEular(gesture, 'ZYX')" :position="[0, 1, 0]" :scale="0.2">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh> -->





      <Suspense>
        <GLTFModel v-if="true" path="/tennis_racket/scene.gltf" :scale="0.005" :position-z="-0.5"
          :rotation-x="(gesture?.pitch ?? 0) + Math.PI / 2" :rotation-y="-(gesture?.roll ?? 0)"
          :rotation-z="-(gesture?.yaw ?? 0)" />
      </Suspense>

    </TresCanvas>

    <div class="text-lg m-2 absolute left-0 top-0">
      <ul class="flex gap-3 font-mono">

        <li>
          <span v-if="validatedURL">{{ rawURL }}</span>
          <span v-else class="text-red-600"> URL should look like
            <code class="bg-red-50 rounded-lg p-1 text-sm">.../#/[ws-server-ip]:[port]/ws</code>
            given
            <code class="bg-red-50 rounded-lg p-1 text-sm">{{ rawURL || "''" }}</code></span>
        </li>
        <li v-if="validatedURL">{{ status }}</li>

        <template v-if="gesture">
          <li>pitch={{ format(gesture.pitch) }}</li>
          <li>roll={{ format(gesture.roll) }}</li>
          <li>yaw={{ format(gesture.yaw) }}</li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWebSocket } from '@vueuse/core';
import { TresCanvas } from '@tresjs/core'
import { useRoute } from 'vue-router'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
import { Euler, EulerOrder } from 'three';

const route = useRoute()
const rawURL = computed(() => route.params.catchAll as string | undefined)
const validatedURL = computed(() => {
  const url = rawURL.value;
  if (!url) return;
  if (!url.match(/^(\d+\.){3}\d+(:\d+)?[a-z\/]*$/)) return;
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${url}`
})
const { status, data } = useWebSocket(validatedURL)

interface Gesture {
  pitch: number;
  roll: number;
  yaw: number;
}

const getEular = (g?: Gesture, order?: EulerOrder) => {
  if (!g) return new Euler(0, 0, 0, 'XYZ');
  return new Euler(g.roll, g.pitch, g.yaw, order);
}

const gesture = computed<Gesture | undefined>(() => {
  return JSON.parse(data.value)
})

const format = (n: number | undefined) => {
  if (!n) return n;
  return n.toFixed(2)
}

// const size = ref([64, 7.5, 131])
const size = ref([64, 131, 7.5])
const factor = ref(0.02)
const scaledSize = computed(() => size.value.map(v => v * factor.value) as [number, number, number])
</script>
