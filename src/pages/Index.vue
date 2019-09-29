<template>
  <q-page class="flex flex-center column q-gutter-sm">
    <div>
      This is an experimental tool for live broadcasting. Please watch this
      <a href="https://www.youtube.com/watch?v=VrbYwSsnuKo" target="_blank">a short introduction</a>.
    </div>
    <div>
      We would appriciate if you could help us improve this tool by providing us your <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=drd2NJDpck-5UGJImDFiPdy_BsD-D2tLtQLYkFJDRaZURFdJUlhTT1g5VkpFQjRLS1hDTThFUFJQRi4u" target="_blank">background</a> before testing and <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=drd2NJDpck-5UGJImDFiPdy_BsD-D2tLtQLYkFJDRaZUNUZFQVVJRkpCTVRBNjQ2RjZXUzkxVFJKQS4u" target="_blank">feedback</a> after the testing. Please use ID {{ id }} for both forms.
    </div>
    <div>-----</div>
    <div><input type="text" v-model="name" placeholder="Enter Key" /></div>
    <div>The key can be any unique text. It is used for pairing the application and the controller.</div>
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
    <div>This is a prototype, which may not work in your devices.</div>
    <div>Developed by Atima Tharatipyakul.</div>
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
