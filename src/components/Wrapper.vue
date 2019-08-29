<template>
  <q-btn v-if="isButton"
    class="wrapper" :class="{ 'visible': isVisible }"
    :color="bgColor" text-color="black"
    :style="{ 'border-color': colorHex }">
    <q-badge v-if="buttonId" :color="color" floating transparent>{{ buttonId }}</q-badge>
    <q-icon v-if="isVisible" name="check_circle" class="status" size="40px" color="green-4" />
    <slot></slot>
  </q-btn>

  <div v-else-if="isActive && buttonId"
    class="wrapper shadow-3" :class="{ 'visible': isVisible }"
    :style="{ 'border-color': colorHex }">
    <q-badge :color="color" floating transparent>{{ buttonId }}</q-badge>
    <slot></slot>
  </div>

  <div v-else class="wrapper"
    :class="{ 'visible': isVisible, 'fade': !isVisible }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'wrapper',
  props: {
    'color': String,
    'bgColor': String,
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
      default: true
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
  data: function () {
    return {
    }
  },
  methods: {
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
}
.q-badge--floating {
  top: 0px;
  right: 0px;
}
</style>
