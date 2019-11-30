<template>
  <q-page class="flex flex-center column q-gutter-sm">
    <div><input type="text" v-model="name" placeholder="Enter Key" /></div>
    <div>Any unique text for pairing the application and the controller.</div>
    <div class="q-mt-md">Design A</div>
    <div>
      <q-btn @click="open('app/A')">Application</q-btn>
      <q-btn @click="open('control/A')">Controller</q-btn>
    </div>
    <div class="q-mt-md">Design B</div>
    <div>
      <q-btn @click="open('app/B')">Application</q-btn>
      <q-btn @click="open('control/B')">Controller</q-btn>
    </div>
    <div>-----</div>
    <div>This is an experimental tool for live broadcasting.</div>
    <div>
      I would appreciate if you could contact me at atima_tharatipyakul
      <img src="statics/sutd.png" style="height: 1em" /> before trying it.
    </div>
    <div>This way, you could provide us useful insights, which will influence R&D of broadcasting tools of the future.</div>
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
      'name': null
    }
  },
  computed: {
    id: function () {
      return Math.random().toString(36).substring(2, 10)
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
