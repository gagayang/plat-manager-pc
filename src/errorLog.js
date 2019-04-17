import Vue from 'vue'
import store from './store'

Vue.config.errorHandler =  function(err, vm, info, a) {
  Vue.nextTick(() => {
    store.dispatch('addErrorLog', {
      err,
      vm,
      info,
      url: window.location.href
    })
    console.error(err, info)
  })
}
