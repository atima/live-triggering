<template>
  <q-page class="fit row bg-grey-10">
    <screen :mode="status.fixed.layout">
      <template v-slot:gameMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="9"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameMain'">

          <video ref="gameFeed" width="100%" loop>
            <source src="statics/game.mp4" type="video/mp4">
          </video>

          <wrapper
            color="pink"
            button-id="1"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.logoObj"
            style="width: 10%; height: 10%; position: absolute; top: 1%; right: 1%; background-color: white;">
            Logo
          </wrapper>

          <wrapper
            color="pink"
            button-id="2"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.cameraObj"
            style="width: 25%; position: absolute; top: 50%; left: 1%;">
            <video ref="cameraFeed" width="100%" :src="cameraSource">
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
          <video ref="gameFeedOnly" width="100%" loop>
            <source src="statics/game.mp4" type="video/mp4">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraOnly>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="11"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraOnly'">
          <video ref="cameraFeedOnly" width="100%" :src="cameraSource">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraMain'">
            <video ref="camera2" width="100%" :src="cameraSource">
            </video>

            <video ref="game2" width="30%" loop
              style="position: absolute; top: 1%; left: 1%;">
              <source src="statics/game.mp4" type="video/mp4">
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
import getUserMedia from 'getusermedia'
Vue.use(VueChatScroll)

import io from 'socket.io-client'
import Wrapper from 'components/Wrapper'
import Screen from 'components/Screen'

const Constraints = {
  video: {
    width: 320,
    height: 180
  }
}

export default {
  name: 'PageIndex',
  components: {
    Wrapper,
    Screen
  },
  data () {
    return {
      socket: {},
      cameraSource: null,
      feedDataIndex: 0,
      feedData: [
        { name: 'Admin', message: 'Thank you for participating in this study.' },
        { name: 'Admin', message: 'Try following the order in this comment box.' },
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
    loadSrcStream (stream) {
      // Adapted from https://github.com/kelvin2go/vue-cam-vision/blob/master/src/webcam.vue
      if ('srcObject' in this.$refs.cameraFeed) {
        try {
          this.$refs.cameraFeed.srcObject = stream
          this.$refs.cameraFeedOnly.srcObject = stream
          this.$refs.camera2.srcObject = stream
        } catch (err) {
          console.log(err)
        }
      } else {
        // old broswers
        this.source = window.HTMLMediaElement.srcObject(stream)
      }

      this.$refs.cameraFeed.play()
      this.$refs.cameraFeedOnly.play()
      this.$refs.camera2.play()
      this.$emit('started', stream)
    },
    loadCamera () {
      getUserMedia(Constraints, (err, stream) => {
        if (err) {
          this.$emit('error', err)
          console.log('failed to get user camera')
          return
        }
        this.loadSrcStream(stream)
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
      this.$refs.gameFeed.play()
      this.$refs.gameFeedOnly.play()
      this.$refs.game2.play()
    },
    stop: function () {
      this.$refs.gameFeed.pause()
      this.$refs.gameFeedOnly.pause()
      this.$refs.game2.pause()
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
