<template>
  <wrapper class="relative-position"
    :color="color"
    :button-id="buttonId"
    :is-active="isActive"
    :is-visible="isVisible">

    <video ref="mainFeed" width="100%" playsinline muted poster="statics/video-placeholder.png">
    </video>

    <wrapper v-if="childImage"
      :color="childImage.color"
      :button-id="childImage.buttonId"
      :is-active="childImage.isActive"
      :is-visible="childImage.isVisible"
      :style="(childImage.customStyle) ? childImage.customStyle : 'width: 10%; position: absolute; top: 1%; right: 1%;'">
      <img :src="childImage.src" width="100%" />
    </wrapper>

    <wrapper v-if="childVideo"
      :color="childVideo.color"
      :button-id="childVideo.buttonId"
      :is-active="childVideo.isActive"
      :is-visible="childVideo.isVisible"
      :style="(childVideo.customStyle) ? childVideo.customStyle : 'width: 25%; position: absolute; top: 50%; left: 1%;'">
      <video ref="childFeed" width="100%" playsinline muted poster="statics/video-placeholder.png">
      </video>
    </wrapper>

    <slot></slot>
  </wrapper>
</template>

<script>
import Wrapper from 'components/Wrapper'

export default {
  name: 'VideoWrapper',
  components: {
    Wrapper
  },
  props: ['color', 'buttonId', 'isActive', 'isVisible', 'childImage'],
  data: function () {
    return {
      'childVideo': null
    }
  },
  methods: {
    play: function () {
      try {
        this.$refs.mainFeed.play()
        if (this.$refs.childFeed) this.$refs.childFeed.play()
      } catch (error) {
        console.error(error)
      }
    },
    pause: function () {
      try {
        this.$refs.mainFeed.pause()
        if (this.$refs.childFeed) this.$refs.childFeed.pause()
      } catch (error) {
        console.error(error)
      }
    },
    loadMainVideo: function (source) {
      var isPlaying = !this.$refs.mainFeed.paused
      if (isPlaying) this.$refs.mainFeed.pause()

      if (typeof source === 'string') {
        this.$refs.mainFeed.srcObject = null
        this.$refs.mainFeed.src = source
        this.$refs.mainFeed.loop = true
      } else {
        this.$refs.mainFeed.src = null
        this.$refs.mainFeed.srcObject = source
        this.$refs.mainFeed.loop = false
      }

      if (isPlaying) this.$refs.mainFeed.play()
    },
    loadChildVideo: function (childVideo) {
      if (this.$refs.childFeed && !this.$refs.childFeed.paused) this.$refs.childFeed.pause()

      this.childVideo = childVideo
      this.$nextTick(function () {
        if (childVideo === null) {
          // console.log('empty child')
        } else if (typeof childVideo.source === 'string') {
          this.$refs.childFeed.srcObject = null
          this.$refs.childFeed.src = childVideo.source
          this.$refs.childFeed.loop = true
        } else {
          this.$refs.childFeed.src = null
          this.$refs.childFeed.srcObject = childVideo.source
          this.$refs.childFeed.loop = false
        }

        if (!this.$refs.mainFeed.paused && childVideo) this.$refs.childFeed.play()
      })
    }
  }
}
</script>

<style>
</style>
