<template>
  <div class="bg-white">
    <div class="text-center q-pb-xs">Broadcasting Application</div>
    <div class="row">
      <slot name="gameMain"></slot>
      <div class="column">
        <slot name="gameOnly"></slot>
        <slot name="cameraOnly"></slot>
        <slot name="cameraMain"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'screen',
  props: ['mode']
}
</script>

<style>

</style>
