<template>
  <q-page class="fit row bg-grey-10">
    <div class="row fit">
      <div class="col-9">
        <video-wrapper ref="gameMain" class="relative-position q-ma-xs"
          id="fixedlayout"
          color="pink"
          button-id="9"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameMain'"
          :child-image="childImageConfig"
          :child-video="childVideoConfig">

          <comment-wrapper v-if="status.fixed.commentBoxObj"
            id="fixedcommentBoxObj"
            color="pink"
            button-id="3"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.commentBoxObj"
            :comments="feedObj" :comment-props="commentConfig">
          </comment-wrapper>
        </video-wrapper>
      </div>

      <div class="col-3 column">
        <video-wrapper ref="gameOnly" class="relative-position q-ma-xs"
          color="pink"
          button-id="10"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameOnly'"
          :child-image="childImageConfig">
        </video-wrapper>

        <video-wrapper ref="cameraOnly" class="relative-position q-ma-xs"
          color="pink"
          button-id="11"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraOnly'"
          :child-image="childImageConfig">
        </video-wrapper>

        <video-wrapper ref="cameraMain" class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraMain'"
          :child-image="childImageConfig"
          :child-video="childVideoConfig">
        </video-wrapper>
      </div>
    </div>
  </q-page>
</template>

<script>
/**
 * Limitations:
 * All event objects are comments.
 */

import io from 'socket.io-client'
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import VideoWrapper from 'components/VideoWrapper'
import CommentWrapper from 'components/CommentWrapper'

export default {
  name: 'PageIndex',
  components: {
    VideoWrapper,
    CommentWrapper
  },
  data () {
    return {
      socket: {},
      gameStream: null,
      cameraStream: null,
      feedDataIndex: 0,
      feedData: [
        { name: 'Admin', message: 'Thank you for participating in this study.' },
        { name: 'Admin', message: 'Try following the order in this comment box.' },
        { name: 'A', message: 'Click \'Event\' button to change category.' },
        { name: 'A', message: 'Click a button to remove this comment.' },
        { name: 'B', message: 'Click \'Fixed\' button to change category.' },
        { name: 'C', message: 'Click a button to hide camera from viewers.' },
        { name: 'C', message: 'Hidden objects have a dashed border.' },
        { name: 'D', message: 'Click \'Misc\' button to change category.' },
        { name: 'E', message: 'Disable \'Auto show comment\'.' },
        { name: 'E', message: 'Now new comment will not be automatically shown.' },
        { name: 'F', message: 'Go back to \'Event\'.' },
        { name: 'G', message: 'Click a button twice to show and remove this comment.' },
        { name: 'H', message: 'End.' }
      ],
      feedObj: {},
      feedBtnMapping: {
        // buttonId: objectId
      },
      status: {
        'mode': {
          'behavior': 'misc'
        },
        'event': {
          // buttonId: visibility
        },
        'fixed': {
          'logoObj': true,
          'cameraObj': true,
          'commentBoxObj': true,
          'layout': 'gameMain'
        },
        'misc': {
          'feeding': false,
          'autoShowComment': true
        }
      }
    }
  },
  computed: {
    childImageConfig: function () {
      return {
        'id': 'fixedlogoObj',
        'color': 'pink',
        'buttonId': '1',
        'src': 'statics/logo.svg',
        'isActive': this.status.mode.behavior === 'fixed',
        'isVisible': this.status.fixed.logoObj
      }
    },
    childVideoConfig: function () {
      return {
        'id': 'fixedcameraObj',
        'color': 'pink',
        'buttonId': '2',
        'isActive': this.status.mode.behavior === 'fixed',
        'isVisible': this.status.fixed.cameraObj
      }
    },
    commentConfig: function () {
      return {
        'color': 'blue',
        'isActive': this.status.mode.behavior === 'event',
        'visible': this.status.event
      }
    }
  },
  methods: {
    async initVideo () {
      if (!this.cameraStream || !this.gameStream) {
        this.cameraStream = 'statics/camera.mp4'
        this.gameStream = 'statics/game.mp4'

        if (!process.env.DEV) {
          this.cameraStream = await navigator.mediaDevices.getUserMedia({
            'video': { 'width': 320, 'height': 180 }
          })
          this.gameStream = await navigator.mediaDevices.getDisplayMedia({
            'video': { 'width': 640, 'height': 360 }
          })
        }
      }

      this.loadVideo()
    },
    loadVideo: function () {
      this.$refs.gameMain.load(this.gameStream, this.cameraStream)
      this.$refs.gameOnly.load(this.gameStream)
      this.$refs.cameraOnly.load(this.cameraStream)
      this.$refs.cameraMain.load(this.cameraStream, this.gameStream)
    },
    feeding: function (value) {
      if (value) {
        this.$refs.gameMain.play()
        this.$refs.gameOnly.play()
        this.$refs.cameraOnly.play()
        this.$refs.cameraMain.play()
      } else {
        this.$refs.gameMain.pause()
        this.$refs.gameOnly.pause()
        this.$refs.cameraOnly.pause()
        this.$refs.cameraMain.pause()
      }
    },
    trigger: function (message) {
      var data, objIndex
      var status = this.status

      var value = (message.value === 'true') ? true : (message.value === 'false') ? false : message.value
      if (status[message.type]) this.$set(status[message.type], message.id, value)

      if (message.type === 'create-event') {
        data = JSON.parse(JSON.stringify(this.feedData[message.feedDataIndex])) // clone object
        data.btnIndex = message.feedBtnIndex
        data.objIndex = message.id

        // Reuse the button. Clear the number from the existing object.
        if (typeof this.feedBtnMapping[message.feedBtnIndex] !== 'undefined') {
          var removeBtnIndexFrom = this.feedBtnMapping[message.feedBtnIndex]
          this.$delete(this.feedObj[removeBtnIndexFrom], 'btnIndex')
        }

        this.$set(this.feedBtnMapping, message.feedBtnIndex, message.id)
        this.$set(this.feedObj, message.id, data)
      } else if (message.type === 'event') {

      } else if (message.type === 'delete-event') {
        objIndex = this.feedBtnMapping[message.id]
        this.$delete(status['event'], message.id)
        this.$delete(this.feedBtnMapping, message.id)
        this.$delete(this.feedObj, objIndex)
      } else if (message.type === 'misc' && message.id === 'feeding') {
        this.feeding(value)
      }
    },
    joinRoom: function () {
      var room = (this.$route.params.room) ? this.$route.params.room : 'default'
      this.socket.emit('room', room)
    }
  },
  created () {
    if (process.env.DEV) {
      this.socket = io('http://localhost:3000')
    } else {
      this.socket = io()
    }
    this.socket.on('connect', this.joinRoom)
  },
  mounted () {
    this.initVideo()
    this.socket.on('message', this.trigger)
  }
}
</script>

<style>
</style>
