<template>
  <q-page class="flex flex-center row bg-grey-10">
    <screen :mode="status.fixed.layout">
      <template v-slot:gameMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="9"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='gameMain'">

          <video ref="gameFeed" width="580" height="330" loop>
            <source src="statics/game.mp4" type="video/mp4">
          </video>

          <wrapper
            color="pink"
            button-id="1"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.logoObj"
            style="width: 60px; height: 30px; position: absolute; top: 10px; right: 5px; background-color: white;">
            Logo
          </wrapper>

          <wrapper
            color="pink"
            button-id="2"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.cameraObj"
            style="width: 120px; height: 70px; position: absolute; top: 150px; left: 5px;">
            <video ref="cameraFeed" width="100%" loop>
              <source src="statics/camera.mp4" type="video/mp4">
            </video>
          </wrapper>

          <wrapper
            color="pink"
            button-id="3"
            :is-active="status.mode.behavior==='fixed'"
            :is-visible="status.fixed.commentBoxObj"
            style="width: 150px; height: 120px; position: absolute;top: 90px; right: 5px;">
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
          <video ref="gameFeedOnly" width="180" height="99" loop>
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
          <video ref="cameraFeedOnly" width="180" height="99" loop>
            <source src="statics/camera.mp4" type="video/mp4">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="status.mode.behavior==='fixed'"
          :is-visible="status.fixed.layout==='cameraMain'">
            <video ref="camera2" width="180" height="99" loop>
              <source src="statics/camera.mp4" type="video/mp4">
            </video>

            <video ref="game2" width="54" height="30" loop
              style="position: absolute; top: 5px; left: 5px;">
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
      show: {
        'logoObj': true,
        'cameraObj': true,
        'commentBoxObj': true,
        'layout': 'gameMain'
      },
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
      feedBtnIndex: 1,
      feedBtn: {},
      feedObjIndex: 1,
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
    loadFeed: function (feedDataIndex, feedBtnIndex, feedObjIndex) {
      var data = JSON.parse(JSON.stringify(this.feedData[feedDataIndex])) // clone object
      data.btnIndex = feedBtnIndex
      data.objIndex = feedObjIndex
      data.show = this.status.misc.autoShowComment
      data.color = (this.feedObjLightColor) ? 'white' : 'blue-1'

      // Reuse the button. Clear the number from the existing object.
      if (typeof this.feedBtn[feedBtnIndex] !== 'undefined') {
        var removeBtnIndexFrom = this.feedBtn[feedBtnIndex].objIndex
        this.$delete(this.feedObj[removeBtnIndexFrom], 'btnIndex')
      }

      this.$set(this.feedBtn, feedBtnIndex, data)
      this.$set(this.feedObj, feedObjIndex, data)
    },
    display: function (btnIndex) {
      var objIndex = this.feedBtn[btnIndex].objIndex
      var data = this.feedBtn[btnIndex]
      data.show = true

      this.$set(this.feedBtn, btnIndex, data)
      this.$set(this.feedObj, objIndex, data)
    },
    remove: function (btnIndex) {
      var objIndex = this.feedBtn[btnIndex].objIndex
      this.$delete(this.feedBtn, btnIndex)
      this.$delete(this.feedObj, objIndex)
    },
    start: function () {
      this.$refs.gameFeed.play()
      this.$refs.cameraFeed.play()
      this.$refs.gameFeedOnly.play()
      this.$refs.cameraFeedOnly.play()
      this.$refs.game2.play()
      this.$refs.camera2.play()
    },
    stop: function () {
      this.$refs.gameFeed.pause()
      this.$refs.cameraFeed.pause()
      this.$refs.gameFeedOnly.pause()
      this.$refs.cameraFeedOnly.pause()
      this.$refs.game2.pause()
      this.$refs.camera2.pause()
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
        var objIndex = this.feedBtn[message.id].objIndex
        this.$delete(this.feedBtn, message.id)
        this.$delete(this.feedObj, objIndex)
        return
      }

      var value = (message.value === 'true') ? true : (message.value === 'false') ? false : message.value
      this.$set(this.status[message.type], message.id, value)

      if (message.type === 'misc' && message.id === 'feeding') {
        this.setFeeding(value)
      }
    }
  },
  created () {
    this.socket = io('http://localhost:3000')
  },
  mounted () {
    // setInterval(this.loadFeed, 3000)
    this.socket.on('message', this.trigger)
  }
}
</script>

<style>
.actionBtnWrapper {
  width: 54px;
}
.objBtnWrapper {
  width: 216px;
}
.deckBtn {
  width: 50px;
  height: 50px;
  margin: 2px;
  font-size: xx-small;
}
.text-caption {
  font-size: x-small;
}
.commentBox {
  width: 100%;
  height: 100%;
  background-color: white;
  font-size: x-small;
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
