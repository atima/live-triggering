import Vue from 'vue'

export const timerstore = Vue.observable({
  delay: 0,
  timers: {}
})

export const timerfunc = {
  countdown (id, reset = false, callback = null) {
    if (typeof timerstore.timers[id] === 'undefined' || reset) {
      Vue.set(timerstore.timers, id, { 'remain': timerstore.delay, 'active': true })
    }

    var that = this
    var arg1 = arguments[3]
    var arg2 = arguments[4]
    if (timerstore.timers[id].remain <= 0) {
      if (typeof callback === 'function' && timerstore.timers[id].active) callback(arg1, arg2)
      this.clear(id)
    }
    if (!timerstore.timers[id].active) return

    clearTimeout(timerstore.timers[id].timer)
    timerstore.timers[id].timer = setTimeout(function () {
      // console.log(id + ' ' + timerstore.timers[id].remain)
      Vue.set(timerstore.timers[id], 'remain', timerstore.timers[id].remain - 1000)
      that.countdown(id, false, callback, arg1, arg2)
    }, 1000)
  },
  clear (id) {
    if (!timerstore.timers[id]) return

    clearTimeout(timerstore.timers[id].timer)
    timerstore.timers[id].timer = null
    timerstore.timers[id].active = false
  },
  clearall () {
    for (var id in timerstore.timers) {
      this.clear(id)
    }
  },
  getRamainingTime (id) {
    return (timerstore.timers[id]) ? timerstore.timers[id].remain / 1000 : 0
  }
}
