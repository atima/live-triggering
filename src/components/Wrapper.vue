<template>
  <q-btn v-if="isButton"
    class="wrapper" :class="{ 'visible': isVisible }"
    :color="bgColor" text-color="black"
    :style="{ 'border-color': colorHex }">
    <q-badge v-if="buttonId" :color="color" floating transparent>{{ buttonId }}</q-badge>

    <q-icon v-if="icon" :name="icon" class="status" style="color: #ccc;" />
    <div class="status" v-else-if="isVisible && getRamainingTime(id) > 0">{{ getRamainingTime(id) }}</div>
    <q-icon v-else-if="isVisible" name="check_circle" class="status" />

    <slot></slot>
  </q-btn>

  <div v-else-if="isActive && buttonId"
    class="wrapper shadow-3" :class="{ 'visible': isVisible, 'highlight': getRamainingTime(id) > 0 }"
    :style="{ 'border-color': colorHex }">
    <q-badge :color="color" floating transparent>{{ buttonId }}</q-badge>
    <slot></slot>
  </div>

  <div v-else class="wrapper"
    :class="{ 'visible': isVisible, 'fade': !isVisible, 'highlight': getRamainingTime(id) > 0 }">
    <slot></slot>
  </div>
</template>

<script>
import { timerfunc } from '../store/timers.js'

export default {
  name: 'wrapper',
  props: {
    'id': String,
    'color': String,
    'bgColor': String,
    'icon': String,
    'buttonId': [String, Number],
    'isButton': {
      type: Boolean,
      default: false
    },
    'isActive': {
      type: Boolean,
      default: false
    },
    'isVisible': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    colorHex: function () {
      switch (this.color) {
        case 'blue':
          return '#2196f3'
        case 'pink':
          return '#e91e63'
        case 'orange':
          return '#ff9800'
        default:
          return 'transparent'
      }
    }
  },
  methods: {
    getRamainingTime: timerfunc.getRamainingTime
  }
}
</script>

<style>
.wrapper {
  border: 2px dashed transparent;
}
.wrapper.visible {
  border-style: solid;
}
.wrapper.fade {
  opacity: 0.4;
}
.status {
  opacity: 0.3;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
}
.q-btn .q-icon {
  font-size: 40px;
}
.q-badge--floating {
  top: 0px;
  right: 0px;
}
</style>

<style lang="stylus">
.status
  color $green-4
.highlight
  border-color $red
</style>
