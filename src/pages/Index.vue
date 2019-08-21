<template>
  <q-page class="flex flex-center row bg-grey-10">
    <div class="bg-white column">
      <div class="text-center q-pb-xs">Broadcasting Application</div>
      <div class="relative-position">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/eB_bZcEhKzk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        <div class="fixedObjWrapper"
          :class="{ 'active': behaviorMode==='fixed', 'visible': show.logoObj }"
          style="width: 60px; height: 30px; position: absolute; top: 5px; right: 5px; background-color: white;">
          <q-badge v-if="behaviorMode==='fixed'" color="pink" floating transparent>0</q-badge>
          Logo
        </div>

        <div class="fixedObjWrapper"
          :class="{ 'active': behaviorMode==='fixed', 'visible': show.cameraObj }"
          style="width: 108px; height: 80px; position: absolute; bottom: 5px; left: 5px; background-color: white;">
          <q-badge v-if="behaviorMode==='fixed'" color="pink" floating transparent>1</q-badge>
          Camera
        </div>

        <div class="fixedObjWrapper"
          :class="{ 'active': behaviorMode==='fixed', 'visible': show.commentBoxObj }"
          style="width: 150px; height: 100px; position: absolute; bottom: 5px; right: 5px;">
          <div v-chat-scroll class="commentBox">
            <q-badge v-if="behaviorMode==='fixed'" color="pink" floating transparent>2</q-badge>

            <div v-for="(item, i) in feedObj" :key="i"
              :class="{ 'active': behaviorMode==='event', 'visible': feedObj[i].show }" class="eventObjWrapper q-ma-xs"
              style="position: relative;">
              <q-badge v-if="typeof feedObj[i].btnIndex !== 'undefined' && behaviorMode==='event'" color="blue" floating transparent>
                {{ feedObj[i].btnIndex }}
              </q-badge>
              <strong>{{ feedObj[i].name }}</strong>: {{ feedObj[i].message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="column q-ml-md">
      <div class="text-right q-ma-xs">
        <q-btn v-if="!isFeeding" color="black" label="Start" @click="isFeeding = true" />
        <q-btn v-if="isFeeding" color="black" label="Stop" @click="isFeeding = false" />
      </div>

      <div class="bg-white text-center q-pb-xs">Controller</div>
      <div class="bg-white row">
        <div v-if="behaviorMode==='event'" class="objBtnWrapper row">
          <q-btn v-for="(v, i) in 12" :key="i" class="deckBtn event"
            :class="{ 'new': i === feedBtnIndex-1 }"
            @click="(feedBtn[i].show)? remove(i) : display(i)">
            <div v-if="typeof feedBtn[i] !== 'undefined'">
              <q-badge color="blue" floating transparent>{{ i }}</q-badge>
              <q-icon v-if="feedBtn[i].show" name="check_circle" class="status" size="40px" color="green-3" />
              Comment
              <span class="text-caption">{{ feedBtn[i].name }}</span>
            </div>
          </q-btn>
        </div>
        <div v-else-if="behaviorMode==='fixed'" class="objBtnWrapper row">
          <q-btn class="deckBtn" @click="show.logoObj = !show.logoObj">
            <q-badge color="pink" floating transparent>0</q-badge>
            <q-icon v-if="show.logoObj"
              name="check_circle" class="status" size="40px" color="green-3" />
            Logo
          </q-btn>
          <q-btn class="deckBtn" @click="show.cameraObj = !show.cameraObj">
            <q-badge color="pink" floating transparent>1</q-badge>
            <q-icon v-if="show.cameraObj"
              name="check_circle" class="status" size="40px" color="green-3" />
            Camera
          </q-btn>
          <q-btn class="deckBtn" @click="show.commentBoxObj = !show.commentBoxObj">
            <q-badge color="pink" floating transparent>2</q-badge>
            <q-icon v-if="show.commentBoxObj"
              name="check_circle" class="status" size="40px" color="green-3" />
            Comment Box
          </q-btn>
          <q-btn v-for="i in 9" class="deckBtn" :key="i"></q-btn>
        </div>
        <div v-else class="objBtnWrapper row">
          <q-btn class="deckBtn" @click="isAutoShowComment = !isAutoShowComment">
            <q-icon v-if="isAutoShowComment"
              name="check_circle" class="status" size="40px" color="green-3" />
            Auto Show Comment
          </q-btn>
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

<style>
</style>

<script>
/**
 * Limitations:
 * All event objects are comments.
 */

import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

export default {
  name: 'PageIndex',
  data () {
    return {
      isFeeding: false,
      isAutoShowComment: true,
      show: {
        'logoObj': true,
        'cameraObj': true,
        'commentBoxObj': true
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
      feedBtnIndex: 0,
      feedBtn: {},
      feedObjIndex: 0,
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
      data.color = (this.feedObjLightColor) ? 'blue-1' : 'blue-2'

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
      if (this.feedBtnIndex >= 12) {
        this.feedBtnIndex = 0
        this.feedObjLightColor = !this.feedObjLightColor
      }
    },
    display: function (btnIndex) {
      var objIndex = this.feedBtn[btnIndex].objIndex
      var data = this.feedBtn[btnIndex]
      data.show = true

      // Don't know why but using only set will not update the UI
      this.$delete(this.feedBtn, btnIndex)
      this.$delete(this.feedObj, objIndex)

      this.$set(this.feedBtn, btnIndex, data)
      this.$set(this.feedObj, objIndex, data)
    },
    remove: function (btnIndex) {
      var objIndex = this.feedBtn[btnIndex].objIndex
      this.$delete(this.feedBtn, btnIndex)
      this.$delete(this.feedObj, objIndex)
    }
  },
  mounted () {
    setInterval(this.loadFeed, 3000)
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
  border: 1px solid grey;
  font-size: xx-small;
}
.status {
  z-index: -1;
  position: absolute;
  top: 5px;
  left: 5px;
}
.fixedObjWrapper, .eventObjWrapper {
  border: 2px dashed transparent;
  padding: 1px;
  opacity: 0.8;
}
.fixedObjWrapper.visible, .eventObjWrapper.visible {
  border-style: solid;
  opacity: 1;
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

<style lang="stylus">
.fixedObjWrapper.active
  border-color $pink
.eventObjWrapper.active
  border-color $blue

@-webkit-keyframes blink
  50% { border-color: $blue; }
.deckBtn.new
  -webkit-animation: blink .5s step-end 8 alternate;
</style>
