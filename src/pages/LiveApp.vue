<template>
  <!-- Design A: type-based -->
  <q-page v-if="$route.params.design==='A'" class="bg-grey-10">
    <div class="column">
      <div class="row">
        <div class="col q-ma-xs">
          <div class="text-white">Preview</div>
          <video-wrapper ref="preview"
            id="fixedlayout"
            :is-visible="true"
            :child-image="(statusPreview.fixed.logoObj) ? { 'id': 'fixedlogoObj', 'src': 'statics/logo.svg', 'isVisible': true } : null"
            :child-video="(statusPreview.fixed.cameraObj) ? { 'id': 'fixedcameraObj', 'isVisible': true } : null">
            <comment-wrapper v-if="this.statusPreview.fixed.layout==='gameMain' && statusPreview.fixed.commentBoxObj"
              id="fixedcommentBoxObj"
              :is-visible="true"
              :comments="feedObjPreview" :comment-props="{ 'isActive': true, 'visible': true }">
            </comment-wrapper>
          </video-wrapper>
        </div>

        <div class="col q-ma-xs">
          <div class="text-white">Live</div>
          <video-wrapper ref="live"
            :is-visible="true"
            :child-image="(statusLive.fixed.logoObj) ? { 'src': 'statics/logo.svg', 'isVisible': true } : null"
            :child-video="(statusLive.fixed.cameraObj) ? { 'isVisible': true } : null">
            <comment-wrapper v-if="this.statusLive.fixed.layout==='gameMain' && statusLive.fixed.commentBoxObj"
              :is-visible="true"
              :comments="feedObjLive" :comment-props="{ 'isActive': true, 'visible': true }">
            </comment-wrapper>
          </video-wrapper>
        </div>
      </div>
      <div v-if="!statusPreview.misc.autoShowComment" class="col q-ma-xs"
        style="max-height: 100px; overflow-y: scroll;"
        v-chat-scroll="{always: true, scrollonremoved:true}">
        <div class="text-white"
          v-for="item in feedObj" :key="item.objIndex">
          <strong>{{ item.name }}</strong>: {{ item.message }}
          <div class="status-inline" v-if="feedObjPreview[item.objIndex]">
            <span v-if="getRamainingTime('event' + item.objIndex) > 0">
              {{ getRamainingTime('event' + item.objIndex) }}
            </span>
            <q-icon v-else name="check_circle" />
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <!-- Design B: behaviour-based -->
  <q-page v-else class="fit row bg-grey-10">
    <div class="row fit">
      <div class="col-9">
        <video-wrapper ref="gameMain" class="relative-position q-ma-xs"
          id="fixedlayout"
          color="pink"
          button-id="9"
          :is-active="statusLive.mode.behavior==='fixed'"
          :is-visible="statusLive.fixed.layout==='gameMain'"
          :child-image="childImageConfig"
          :child-video="childVideoConfig">

          <comment-wrapper v-if="statusLive.fixed.commentBoxObj"
            id="fixedcommentBoxObj"
            color="pink"
            button-id="3"
            :is-active="statusLive.mode.behavior==='fixed'"
            :is-visible="statusLive.fixed.commentBoxObj"
            :comments="feedObj" :comment-props="commentConfig">
          </comment-wrapper>
        </video-wrapper>
      </div>

      <div class="col-3 column">
        <video-wrapper ref="gameOnly" class="relative-position q-ma-xs"
          color="pink"
          button-id="10"
          :is-active="statusLive.mode.behavior==='fixed'"
          :is-visible="statusLive.fixed.layout==='gameOnly'"
          :child-image="childImageConfig">
        </video-wrapper>

        <video-wrapper ref="cameraOnly" class="relative-position q-ma-xs"
          color="pink"
          button-id="11"
          :is-active="statusLive.mode.behavior==='fixed'"
          :is-visible="statusLive.fixed.layout==='cameraOnly'"
          :child-image="childImageConfig">
        </video-wrapper>

        <video-wrapper ref="cameraMain" class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="statusLive.mode.behavior==='fixed'"
          :is-visible="statusLive.fixed.layout==='cameraMain'"
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
import { timerstore, timerfunc } from '../store/timers.js'

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
      feedObjPreview: {},
      feedObjLive: {},
      feedBtnMapping: {
        // buttonId: objectId
      },
      statusPreview: {
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
      },
      statusLive: {
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
        'isActive': this.statusLive.mode.behavior === 'fixed',
        'isVisible': this.statusLive.fixed.logoObj
      }
    },
    childVideoConfig: function () {
      return {
        'id': 'fixedcameraObj',
        'color': 'pink',
        'buttonId': '2',
        'isActive': this.statusLive.mode.behavior === 'fixed',
        'isVisible': this.statusLive.fixed.cameraObj
      }
    },
    commentConfig: function () {
      return {
        'color': 'blue',
        'isActive': this.statusLive.mode.behavior === 'event',
        'visible': this.statusLive.event
      }
    }
  },
  methods: {
    getRamainingTime: timerfunc.getRamainingTime,
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
    },
    loadVideo: function (status, ref) {
      if (this.$route.params.design === 'A') {
        switch (status.fixed.layout) {
          case 'gameMain':
            ref.load(this.gameStream, this.cameraStream)
            break
          case 'gameOnly':
            ref.load(this.gameStream)
            break
          case 'cameraOnly':
            ref.load(this.cameraStream)
            break
          default:
            ref.load(this.cameraStream, this.gameStream)
        }
      } else {
        this.$refs.gameMain.load(this.gameStream, this.cameraStream)
        this.$refs.gameOnly.load(this.gameStream)
        this.$refs.cameraOnly.load(this.cameraStream)
        this.$refs.cameraMain.load(this.cameraStream, this.gameStream)
      }
    },
    feeding: function (value, ref) {
      if (this.$route.params.design === 'A') {
        if (value) {
          ref.play()
        } else {
          setTimeout(function () { // hack. waiting for dom to update, i guess
            ref.pause()
          }, 1000)
        }
      } else {
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
      }
    },
    trigger: function (message, isLive = false) {
      if (this.$route.params.design !== 'A') isLive = true

      var data
      var status = (isLive) ? this.statusLive : this.statusPreview
      var obj = (isLive) ? this.feedObjLive : this.feedObjPreview
      var ref = (isLive) ? this.$refs.live : this.$refs.preview

      var value = (message.value === 'true') ? true : (message.value === 'false') ? false : message.value
      if (status[message.type]) this.$set(status[message.type], message.id, value)

      if (message.type === 'create-event') {
        data = JSON.parse(JSON.stringify(this.feedData[message.feedDataIndex])) // clone object
        if (this.$route.params.design !== 'A') data.btnIndex = message.feedBtnIndex
        data.objIndex = message.id

        // Reuse the button. Clear the number from the existing object.
        if (typeof this.feedBtnMapping[message.feedBtnIndex] !== 'undefined') {
          var removeBtnIndexFrom = this.feedBtnMapping[message.feedBtnIndex]
          this.$delete(this.feedObj[removeBtnIndexFrom], 'btnIndex')
        }

        this.$set(this.feedBtnMapping, message.feedBtnIndex, message.id)
        this.$set(this.feedObj, message.id, data)
      } else if (message.type === 'event') {
        data = JSON.parse(JSON.stringify(this.feedObj[message.id]))
        this.$set(obj, message.id, data)
      } else if (message.type === 'delete-event') {
        this.$delete(status['event'], message.id)
        this.$delete(obj, message.id)
        if (!isLive) {
          timerfunc.clear('event' + message.id)
          this.trigger(message, true)
          return
        }

        this.$delete(this.feedBtnMapping, message.feedBtnIndex)
        this.$delete(this.feedObj, message.id)
      } else if (message.type === 'misc' && message.id === 'feeding') {
        this.feeding(value, ref)
      } else if (this.$route.params.design === 'A' && message.type === 'fixed' && message.id === 'layout') {
        var that = this
        setTimeout(function () { // hack. waiting for dom to update, i guess
          that.loadVideo(status, ref)
        }, 1000)
      }

      if (!isLive && value === false) { // immediate removal
        this.trigger(message, true)
      } else if (!isLive) {
        timerfunc.countdown(message.type + message.id, true, this.trigger, message, true)
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
    if (this.$route.params.design === 'A') {
      this.loadVideo(this.statusPreview, this.$refs.preview)
      var that = this
      setTimeout(function () { // hack. waiting for dom to update, i guess
        that.loadVideo(that.statusLive, that.$refs.live)
      }, 1000)
      timerstore.delay = 3000
    } else {
      this.loadVideo()
    }

    this.socket.on('message', this.trigger)
  }
}
</script>

<style>
</style>

<style lang="stylus">
.status-inline
  display inline
  color $green-4
</style>
