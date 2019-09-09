import Vue from 'vue'

export const timerstore = Vue.observable({
  delay: 0,
  timers: {}
})

export const timerfunc = {
  countdown (id, reset = false, callback = null) {
    if (typeof timerstore.timers[id] === 'undefined' || reset) {
      Vue.set(timerstore.timers, id, { 'remain': timerstore.delay })
    }

    var that = this
    var arg1 = arguments[3]
    var arg2 = arguments[4]
    if (timerstore.timers[id].remain <= 0) {
      if (typeof callback === 'function') callback(arg1, arg2)
      return
    }

    timerstore.timers[id].timer = setTimeout(function () {
      Vue.set(timerstore.timers[id], 'remain', timerstore.timers[id].remain - 1000)
      that.countdown(id, false, callback, arg1, arg2)
    }, 1000)
  },
  getRamainingTime (id) {
    return (timerstore.timers[id]) ? timerstore.timers[id].remain / 1000 : 0
  }
}
