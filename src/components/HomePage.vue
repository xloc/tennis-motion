<template>
  <div class="w-screen h-screen relative">
    <TresCanvas window-size>
      <TresPerspectiveCamera :position="[0, 5, 0]" />
      <OrbitControls :enable-pan="false" :enable-zoom="false" />
      <!-- :auto-rotate="true" :auto-rotate-speed="10" -->

      <!-- <TresMesh> -->
      <TresMesh :rotation-x="gesture?.pitch ?? 0" :rotation-y="gesture?.yaw ?? 0" :rotation-z="gesture?.roll ?? 0">
        <TresBoxGeometry :args="scaledSize" />
        <TresMeshMatcapMaterial color="tomato" />
      </TresMesh>

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
import { OrbitControls } from '@tresjs/cientos'

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

const gesture = computed<Gesture | null>(() => {
  return JSON.parse(data.value)
})

const format = (n: number | undefined) => {
  if (!n) return n;
  return n.toFixed(2)
}

const size = ref([64, 7.5, 131])
const factor = ref(0.02)
const scaledSize = computed(() => size.value.map(v => v * factor.value) as [number, number, number])
</script>
