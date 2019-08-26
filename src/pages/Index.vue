<template>
  <q-page class="flex flex-center column q-gutter-sm">
    <div><q-input type="text" v-model="name" label="Enter Name" filled /></div>
    <div><q-btn @click="open('app')">Broadcasting Application</q-btn></div>
    <div><q-btn @click="open('control')">Controller</q-btn></div>
  </q-page>
</template>

<script>
/**
 * Limitations:
 * All event objects are comments.
 */

export default {
  name: 'PageIndex',
  data () {
    return {
    }
  },
  methods: {
    open: function (type) {
      window.open(type + '/' + this.name)
    }
  }
}
</script>

<style>
</style>
