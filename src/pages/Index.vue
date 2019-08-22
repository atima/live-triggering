<template>
  <q-page class="flex flex-center row bg-grey-10">
    <screen :mode="show.layout">
      <template v-slot:gameMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="9"
          :is-active="behaviorMode==='fixed'"
          :is-visible="show.layout==='gameMain'">

          <video ref="gameFeed" width="580" height="330" loop>
            <source src="statics/game.mp4" type="video/mp4">
          </video>

          <wrapper
            color="pink"
            button-id="1"
            :is-active="behaviorMode==='fixed'"
            :is-visible="show.logoObj"
            style="width: 60px; height: 30px; position: absolute; top: 10px; right: 5px; background-color: white;">
            Logo
          </wrapper>

          <wrapper
            color="pink"
            button-id="2"
            :is-active="behaviorMode==='fixed'"
            :is-visible="show.cameraObj"
            style="width: 120px; height: 70px; position: absolute; top: 150px; left: 5px;">
            <video ref="cameraFeed" width="100%" loop>
              <source src="statics/camera.mp4" type="video/mp4">
            </video>
          </wrapper>

          <wrapper
            color="pink"
            button-id="3"
            :is-active="behaviorMode==='fixed'"
            :is-visible="show.commentBoxObj"
            style="width: 150px; height: 120px; position: absolute;top: 90px; right: 5px;">
            <div v-chat-scroll="{always: true, scrollonremoved:true}" class="commentBox">
              <wrapper v-for="item in feedObj" :key="item.objIndex"
                color="blue"
                :button-id="item.btnIndex"
                :is-active="behaviorMode==='event'"
                :is-visible="item.show"
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
          :is-active="behaviorMode==='fixed'"
          :is-visible="show.layout==='gameOnly'">
          <video ref="gameFeedOnly" width="180" height="99" loop>
            <source src="statics/game.mp4" type="video/mp4">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraOnly>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="11"
          :is-active="behaviorMode==='fixed'"
          :is-visible="show.layout==='cameraOnly'">
          <video ref="cameraFeedOnly" width="180" height="99" loop>
            <source src="statics/camera.mp4" type="video/mp4">
          </video>
        </wrapper>
      </template>

      <template v-slot:cameraMain>
        <wrapper class="relative-position q-ma-xs"
          color="pink"
          button-id="12"
          :is-active="behaviorMode==='fixed'"
          :is-visible="show.layout==='cameraMain'">
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

    <div class="column q-ml-md">
      <div class="text-right q-ma-xs">
        <q-btn v-if="!isFeeding" color="black" label="Start" @click="start()" />
        <q-btn v-if="isFeeding" color="black" label="Stop" @click="stop()" />
      </div>

      <div class="bg-white text-center q-pb-xs">Controller</div>
      <div class="bg-white row">
        <div v-if="behaviorMode==='event'" class="objBtnWrapper row">
          <div v-for="i in 12" :key="i">
            <wrapper class="deckBtn"
              v-if="typeof feedBtn[i] !== 'undefined'"
              color="blue"
              :bgColor="feedBtn[i].color"
              :button-id="i"
              :is-button="true"
              :is-visible="feedBtn[i].show"
              @click.native="(feedBtn[i].show)? remove(i) : display(i)">
                Comment
                <span class="text-caption">{{ feedBtn[i].name }}</span>
            </wrapper>

            <q-btn v-else class="deckBtn"></q-btn>
          </div>
        </div>

        <div v-else-if="behaviorMode==='fixed'" class="objBtnWrapper row">
          <wrapper class="deckBtn"
            color="pink"
            button-id="1"
            :is-button="true"
            :is-visible="show.logoObj"
            @click.native="show.logoObj = !show.logoObj">
              Logo
          </wrapper>

          <wrapper class="deckBtn"
            color="pink"
            button-id="2"
            :is-button="true"
            :is-visible="show.cameraObj"
            @click.native="show.cameraObj = !show.cameraObj">
              Camera
          </wrapper>

          <wrapper class="deckBtn"
            color="pink"
            button-id="3"
            :is-button="true"
            :is-visible="show.commentBoxObj"
            @click.native="show.commentBoxObj = !show.commentBoxObj">
              Comment Box
          </wrapper>

          <q-btn v-for="i in 5" class="deckBtn" :key="i"></q-btn>

          <wrapper class="deckBtn"
            color="pink"
            button-id="9"
            :is-button="true"
            :is-visible="show.layout === 'gameMain'"
            @click.native="show.layout = 'gameMain'">
              Layout
              <span class="text-caption">Default</span>
          </wrapper>

          <wrapper class="deckBtn"
            color="pink"
            button-id="10"
            :is-button="true"
            :is-visible="show.layout === 'gameOnly'"
            @click.native="show.layout = 'gameOnly'">
              Layout
              <span class="text-caption">Game</span>
          </wrapper>

          <wrapper class="deckBtn"
            color="pink"
            button-id="11"
            :is-button="true"
            :is-visible="show.layout === 'cameraOnly'"
            @click.native="show.layout = 'cameraOnly'">
              Layout
              <span class="text-caption">Camera</span>
          </wrapper>

          <wrapper class="deckBtn"
            color="pink"
            button-id="11"
            :is-button="true"
            :is-visible="show.layout === 'cameraMain'"
            @click.native="show.layout = 'cameraMain'">
              Layout
              <span class="text-caption">Talk</span>
          </wrapper>
        </div>

        <div v-else class="objBtnWrapper row">
          <wrapper class="deckBtn"
            color="orange"
            :is-button="true"
            :is-visible="isAutoShowComment"
            @click.native="isAutoShowComment = !isAutoShowComment">
              Auto Show Comment
          </wrapper>

          <q-btn v-for="i in 11" class="deckBtn" :key="i"></q-btn>
        </div>

        <div class="actionBtnWrapper">
          <q-btn class="deckBtn" color="blue" :class="{ 'dimmed': behaviorMode!='event'}" @click="behaviorMode='event'">Event</q-btn>
          <q-btn class="deckBtn" color="pink" :class="{ 'dimmed': behaviorMode!='fixed'}" @click="behaviorMode='fixed'">Fixed</q-btn>
          <q-btn class="deckBtn" color="orange" :class="{ 'dimmed': behaviorMode!='misc'}" @click="behaviorMode='misc'">Misc</q-btn>
        </div>
      </div>
    </div>
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
      isFeeding: false,
      isAutoShowComment: true,
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
      feedObjLightColor: true,
      behaviorMode: 'event'
    }
  },
  methods: {
    loadFeed: function () {
      if (!this.isFeeding) return

      var data = JSON.parse(JSON.stringify(this.feedData[this.feedDataIndex])) // clone object
      data.btnIndex = this.feedBtnIndex
      data.objIndex = this.feedObjIndex
      data.show = this.isAutoShowComment
      data.color = (this.feedObjLightColor) ? 'white' : 'blue-1'

      // Reuse the button. Clear the number from the existing object.
      if (typeof this.feedBtn[this.feedBtnIndex] !== 'undefined') {
        var removeBtnIndexFrom = this.feedBtn[this.feedBtnIndex].objIndex
        this.$delete(this.feedObj[removeBtnIndexFrom], 'btnIndex')
      }

      this.$set(this.feedBtn, this.feedBtnIndex, data)
      this.$set(this.feedObj, this.feedObjIndex, data)

      this.feedDataIndex++
      this.feedBtnIndex++
      this.feedObjIndex++

      if (this.feedDataIndex === this.feedData.length) this.feedDataIndex = 0
      if (this.feedBtnIndex > 12) {
        this.feedBtnIndex = 1
        this.feedObjLightColor = !this.feedObjLightColor
      }
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
      this.isFeeding = true
      this.$refs.gameFeed.play()
      this.$refs.cameraFeed.play()
      this.$refs.gameFeedOnly.play()
      this.$refs.cameraFeedOnly.play()
      this.$refs.game2.play()
      this.$refs.camera2.play()
    },
    stop: function () {
      this.isFeeding = false
      this.$refs.gameFeed.pause()
      this.$refs.cameraFeed.pause()
      this.$refs.gameFeedOnly.pause()
      this.$refs.cameraFeedOnly.pause()
      this.$refs.game2.pause()
      this.$refs.camera2.pause()
    }
  },
  mounted () {
    this.loadFeed()
    this.loadFeed()
    setInterval(this.loadFeed, 1000)
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
