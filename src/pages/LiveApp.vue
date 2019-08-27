<template>
  <q-page class="fit row bg-grey-10">
    <screen :mode="status.fixed.layout">
      <template v-slot:gameMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="9"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameMain'">

          <video ref="gameFeed" width="100%" playsinline volume="0"
            poster="statics/video-placeholder.png"
            :src="gameStreamSrc">
          </video>

          <wrapper
            color="pink"
            button-id="1"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.logoObj"
            style="width: 10%; position: absolute; top: 1%; right: 1%;">
            <img src="assets/logo.svg" width="100%" />
          </wrapper>

          <wrapper
            color="pink"
            button-id="2"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.cameraObj"
            style="width: 25%; position: absolute; top: 50%; left: 1%;">
            <video ref="cameraFeed" width="100%" playsinline
              poster="statics/video-placeholder.png"
              :src="cameraStreamSrc">
            </video>
          </wrapper>

          <wrapper
            color="pink"
            button-id="3"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.commentBoxObj"
            style="width: 30%; height: 40%; position: absolute;top: 30%; right: 1%;">
            <div v-chat-scroll="{always: true, scrollonremoved:true}" class="commentBox">
              <wrapper v-for="item in feedObj" :key="item.objIndex"
                color="blue"
                :button-id="item.btnIndex"
                :is-active="status.mode.behavior==='event'"
                :is-visible="status.event[item.btnIndex]"
                class="relative-position q-ma-xs">
                <strong>{{ item.name }}</strong>: {{ item.message }}
              </wrapper>
            </div>
          </wrapper>
        </wrapper>
      </template>

      <template v-slot:gameOnly>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="10"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameOnly'">
          <video ref="gameFeedOnly" width="100%"
            poster="statics/video-placeholder.png"
            :src="gameStreamSrc">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraOnly>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="11"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraOnly'">
          <video ref="cameraFeedOnly" width="100%"
            poster="statics/video-placeholder.png"
            :src="cameraStreamSrc">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraMain'">
            <video ref="camera2" width="100%"
              poster="statics/video-placeholder.png"
              :src="cameraStreamSrc">
            </video>

            <video ref="game2" width="30%" style="position: absolute; top: 1%; left: 1%;"
              poster="statics/video-placeholder.png"
              :src="gameStreamSrc">
            </video>
        </wrapper>
      </template>
    </screen>
  </q-page>
</template>

<script>
/**
 * Limitations:
 * All event objects are comments.
 */

import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import io from 'socket.io-client'
import Wrapper from 'components/Wrapper'
import Screen from 'components/Screen'

export default {
  name: 'PageIndex',
  components: {
    Wrapper,
    Screen
  },
  data () {
    return {
      socket: {},
      gameStreamSrc: 'statics/game.mp4',
      cameraStreamSrc: 'statics/camera.mp4',
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
    loadCamera () {
      // if (process.env.DEV) return

      navigator.mediaDevices.getUserMedia({
        'video': { 'width': 320, 'height': 180 }
      }).then(stream => {
        this.$refs.cameraFeed.srcObject = stream
        this.$refs.cameraFeedOnly.srcObject = stream
        this.$refs.camera2.srcObject = stream
      }, error => {
        console.log('Unable to acquire webcam', error)
      })
    },
    loadScreen: function () {
      // if (process.env.DEV) return

      navigator.mediaDevices.getDisplayMedia({
        'video': { 'width': 640, 'height': 360 }
      }).then(stream => {
        this.$refs.gameFeed.srcObject = stream
        this.$refs.gameFeedOnly.srcObject = stream
        this.$refs.game2.srcObject = stream
      }, error => {
        console.log('Unable to acquire screen capture', error)
      })
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
    start: function () {
      try {
        this.$refs.gameFeed.play()
        this.$refs.gameFeedOnly.play()
        this.$refs.game2.play()
        this.$refs.cameraFeed.play()
        this.$refs.cameraFeedOnly.play()
        this.$refs.camera2.play()
      } catch (error) {
        console.error(error)
      }
    },
    stop: function () {
      try {
        this.$refs.gameFeed.pause()
        this.$refs.gameFeedOnly.pause()
        this.$refs.game2.pause()
        this.$refs.cameraFeed.pause()
        this.$refs.cameraFeedOnly.pause()
        this.$refs.camera2.pause()
      } catch (error) {
        console.error(error)
      }
    },
    setFeeding: function (feeding) {
      if (feeding) {
        this.start()
      } else {
        this.stop()
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
    // setInterval(this.loadFeed, 3000)
    this.loadScreen()
    this.loadCamera()
    this.socket.on('message', this.trigger)
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
