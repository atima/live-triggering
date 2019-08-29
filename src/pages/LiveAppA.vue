<template>
  <q-page class="column bg-grey-10">
    <div class="row" style="border: 1px solid red">
      <div class="col" style="border: 1px solid blue">
        <video-wrapper ref="preview"
          :child-image="{ 'src': 'statics/logo.svg' }">
          <comment-wrapper :comments="feedObj" :comment-props="{'isActive': true}">
          </comment-wrapper>
        </video-wrapper>

        <div v-if="!gameStream || !cameraStream">Loading</div>
        <div v-else>{{ gameStream }}</div>
      </div>
      <div class="col" style="border: 1px solid blue">

      </div>
    </div>
    <div class="col" style="border: 1px solid red">

      *****
    </div>
  </q-page>
</template>

<script>
/**
 * Limitations:
 * All event objects are comments.
 */

import io from 'socket.io-client'
import VideoWrapper from 'components/VideoWrapper'
import CommentWrapper from 'components/CommentWrapper'
// import Wrapper from 'components/Wrapper'
// import Screen from 'components/Screen'

export default {
  name: 'PageIndex',
  components: {
    VideoWrapper,
    CommentWrapper
    // Wrapper,
    // Screen
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
  methods: {
    async loadVideo () {
      if (!this.cameraStream || !this.gameStream) {
        this.cameraStream = 'statics/camera.mp4'
        this.gameStream = 'statics/game.mp4'
        // if (process.env.DEV) return

        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          'video': { 'width': 320, 'height': 180 }
        })
        this.gameStream = await navigator.mediaDevices.getDisplayMedia({
          'video': { 'width': 640, 'height': 360 }
        })
      }

      switch (this.status.fixed.layout) {
        case 'gameMain':
          this.$refs.preview.loadMainVideo(this.gameStream)
          this.$refs.preview.loadChildVideo({ 'source': this.cameraStream })
          break
        case 'gameOnly':
          this.$refs.preview.loadMainVideo(this.gameStream)
          this.$refs.preview.loadChildVideo(null)
          break
        case 'cameraOnly':
          this.$refs.preview.loadMainVideo(this.cameraStream)
          this.$refs.preview.loadChildVideo(null)
          break
        default:
          this.$refs.preview.loadMainVideo(this.cameraStream)
          this.$refs.preview.loadChildVideo({ 'source': this.gameStream })
      }
    },
    loadFeed: function (feedDataIndex, feedBtnIndex, feedObjIndex) {
      var data = JSON.parse(JSON.stringify(this.feedData[feedDataIndex])) // clone object
      data.btnIndex = feedBtnIndex
      data.objIndex = feedObjIndex

      // Reuse the button. Clear the number from the existing object.
      if (typeof this.feedBtnMapping[feedBtnIndex] !== 'undefined') {
        var removeBtnIndexFrom = this.feedBtnMapping[feedBtnIndex]
        this.$delete(this.feedObj[removeBtnIndexFrom], 'btnIndex')
      }

      this.$set(this.feedBtnMapping, feedBtnIndex, feedObjIndex)
      this.$set(this.feedObj, feedObjIndex, data)
      this.$set(this.status['event'], feedBtnIndex, this.status.misc.autoShowComment)
    },
    setFeeding: function (feeding) {
      if (feeding) {
        this.$refs.preview.play()
      } else {
        this.$refs.preview.pause()
      }
    },
    trigger: function (message) {
      if (message.type === 'create-event') {
        this.loadFeed(message.feedDataIndex, message.feedBtnIndex, message.feedObjIndex)
        return
      } else if (message.type === 'delete-event') {
        var objIndex = this.feedBtnMapping[message.id]
        this.$delete(this.status['event'], message.id)
        this.$delete(this.feedBtnMapping, message.id)
        this.$delete(this.feedObj, objIndex)
        return
      }

      var value = (message.value === 'true') ? true : (message.value === 'false') ? false : message.value
      this.$set(this.status[message.type], message.id, value)

      if (message.type === 'misc' && message.id === 'feeding') {
        this.setFeeding(value)
      } else if (message.type === 'fixed' && message.id === 'layout') {
        this.loadVideo()
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
    this.loadVideo()
    this.socket.on('message', this.trigger)
  }
}
</script>

<style>

</style>
