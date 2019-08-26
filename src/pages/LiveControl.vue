<template>
  <q-page class="fit row">
    <div v-if="status.mode.behavior==='event'" class="objBtnWrapper row">
      <div v-for="i in 12" :key="i" class="q-btn q-pa-none q-ma-none deckBtn">
        <wrapper class="fit"
          v-if="typeof feedBtn[i] !== 'undefined'"
          color="blue"
          :bgColor="feedBtn[i].color"
          :button-id="i"
          :is-button="true"
          :is-visible="status.event[i]"
          @click.native="triggerEvent(i)">
            Comment<br />
            {{ feedBtn[i].name }}
        </wrapper>

        <q-btn v-else class="fit"></q-btn>
      </div>
    </div>

    <div v-else-if="status.mode.behavior==='fixed'" class="objBtnWrapper row">
      <wrapper class="deckBtn"
        color="pink"
        button-id="1"
        :is-button="true"
        :is-visible="status.fixed.logoObj"
        @click.native="trigger('fixed', 'logoObj', !status.fixed.logoObj)">
          Logo
      </wrapper>

      <wrapper class="deckBtn"
        color="pink"
        button-id="2"
        :is-button="true"
        :is-visible="status.fixed.cameraObj"
        @click.native="trigger('fixed', 'cameraObj', !status.fixed.cameraObj)">
          Camera
      </wrapper>

      <wrapper class="deckBtn"
        color="pink"
        button-id="3"
        :is-button="true"
        :is-visible="status.fixed.commentBoxObj"
        @click.native="trigger('fixed', 'commentBoxObj', !status.fixed.commentBoxObj)">
          Comment Box
      </wrapper>

      <q-btn v-for="i in 5" class="deckBtn" :key="i"></q-btn>

      <wrapper class="deckBtn"
        color="pink"
        button-id="9"
        :is-button="true"
        :is-visible="status.fixed.layout === 'gameMain'"
        @click.native="trigger('fixed', 'layout', 'gameMain')">
          Layout<br />
          Default
      </wrapper>

      <wrapper class="deckBtn"
        color="pink"
        button-id="10"
        :is-button="true"
        :is-visible="status.fixed.layout === 'gameOnly'"
        @click.native="trigger('fixed', 'layout', 'gameOnly')">
          Layout<br />
          Game
      </wrapper>

      <wrapper class="deckBtn"
        color="pink"
        button-id="11"
        :is-button="true"
        :is-visible="status.fixed.layout === 'cameraOnly'"
        @click.native="trigger('fixed', 'layout', 'cameraOnly')">
          Layout<br />
          Camera
      </wrapper>

      <wrapper class="deckBtn"
        color="pink"
        button-id="12"
        :is-button="true"
        :is-visible="status.fixed.layout === 'cameraMain'"
        @click.native="trigger('fixed', 'layout', 'cameraMain')">
          Layout<br />
          Talk
      </wrapper>
    </div>

    <div v-else class="objBtnWrapper row">
      <wrapper class="deckBtn"
        color="orange"
        :is-button="true"
        :is-visible="status.misc.feeding"
        @click.native="trigger('misc', 'feeding', !status.misc.feeding)">
          Live
      </wrapper>

      <wrapper class="deckBtn"
        color="orange"
        :is-button="true"
        :is-visible="status.misc.autoShowComment"
        @click.native="trigger('misc', 'autoShowComment', !status.misc.autoShowComment)">
          Auto Show Comment
      </wrapper>

      <q-btn v-for="i in 10" class="deckBtn" :key="i"></q-btn>
    </div>

    <div class="actionBtnWrapper">
      <q-btn class="deckBtn" color="blue"
        :class="{ 'dimmed': status.mode.behavior != 'event'}"
        @click="trigger('mode', 'behavior', 'event')">
        Event
      </q-btn>
      <q-btn class="deckBtn" color="pink"
        :class="{ 'dimmed': status.mode.behavior != 'fixed'}"
        @click="trigger('mode', 'behavior', 'fixed')">
        Fixed
      </q-btn>
      <q-btn class="deckBtn" color="orange"
        :class="{ 'dimmed': status.mode.behavior != 'misc'}"
        @click="trigger('mode', 'behavior', 'misc')">
        Misc
      </q-btn>
    </div>
  </q-page>
</template>

<script>
/**
 * Limitations:
 * All event objects are comments.
 * Only perfrom action through controller
 */

import io from 'socket.io-client'
import Wrapper from 'components/Wrapper'

export default {
  name: 'PageIndex',
  components: {
    Wrapper
  },
  data () {
    return {
      socket: {},
      room: null,
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
      feedObjLightColor: true,
      status: {
        'mode': {
          'behavior': 'misc'
        },
        'event': {},
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
    loadFeed: function () {
      if (!this.status.misc.feeding) return

      var data = JSON.parse(JSON.stringify(this.feedData[this.feedDataIndex])) // clone object
      data.color = (this.feedObjLightColor) ? 'white' : 'blue-1'

      this.$set(this.feedBtn, this.feedBtnIndex, data)
      this.$set(this.status['event'], this.feedBtnIndex, this.status.misc.autoShowComment)

      this.socket.emit('message', {
        'room': this.room, 'type': 'create-event', 'feedDataIndex': this.feedDataIndex, 'feedBtnIndex': this.feedBtnIndex, 'feedObjIndex': this.feedObjIndex
      })

      this.feedDataIndex++
      this.feedBtnIndex++
      this.feedObjIndex++

      if (this.feedDataIndex === this.feedData.length) this.feedDataIndex = 0
      if (this.feedBtnIndex > 12) {
        this.feedBtnIndex = 1
        this.feedObjLightColor = !this.feedObjLightColor
      }
    },
    trigger: function (type, id, value) {
      this.$set(this.status[type], id, value)
      this.socket.emit('message', { 'room': this.room, 'type': type, 'id': id, 'value': value })
    },
    triggerEvent: function (btnIndex) {
      if (this.status.event[btnIndex]) {
        this.$delete(this.feedBtn, btnIndex)
        this.socket.emit('message', { 'room': this.room, 'type': 'delete-event', 'id': btnIndex })
      } else {
        this.trigger('event', btnIndex, true)
      }
    },
    joinRoom: function () {
      this.room = (this.$route.params.room) ? this.$route.params.room : 'default'
      this.socket.emit('room', this.room)
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
    setInterval(this.loadFeed, 3000)
  }
}
</script>

<style>
.objBtnWrapper {
  width: 80%;
}
.actionBtnWrapper {
  width: 20%;
}
.objBtnWrapper .deckBtn {
  width: 25%;
}
.actionBtnWrapper .deckBtn {
  width: 100%;
}
.deckBtn {
  height: 33%;
  overflow: hidden;
}
</style>
