<template>
  <wrapper
    :color="color"
    :button-id="buttonId"
    :is-active="isActive"
    :is-visible="isVisible"
    :style="(customStyle) ? customStyle : 'width: 30%; height: 40%; position: absolute;top: 30%; right: 1%;'">
    <div v-chat-scroll="{always: true, scrollonremoved:true}" class="commentBox">
      <wrapper v-for="item in comments" :key="item.objIndex"
        :color="commentProps.color"
        :button-id="item.btnIndex"
        :is-active="commentProps.isActive"
        :is-visible="item.isVisible"
        class="relative-position q-ma-xs">
        <strong>{{ item.name }}</strong>: {{ item.message }}
      </wrapper>
    </div>
  </wrapper>
</template>

<script>
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import Wrapper from 'components/Wrapper'

export default {
  name: 'VideoWrapper',
  components: {
    Wrapper
  },
  props: ['color', 'buttonId', 'isActive', 'isVisible', 'customStyle', 'comments', 'commentProps'],
  computed: {
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
.commentBox {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-x: hidden;
  overflow-y: scroll;
}
.commentBox::-webkit-scrollbar {
  width: 5px;
}
.commentBox::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.commentBox::-webkit-scrollbar-thumb {
  background: #888;
}
.commentBox::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
