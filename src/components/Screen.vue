<template>
  <div class="row fit">
    <div class="col-9">
      <slot name="gameMain"></slot>
    </div>
    <div class="col-3 column">
      <slot name="gameOnly"></slot>
      <slot name="cameraOnly"></slot>
      <slot name="cameraMain"></slot>
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
