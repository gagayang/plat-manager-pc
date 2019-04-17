import input from './input.vue'
import checkbox from './select.vue'
import commonTree from './commonTree.vue'
import datePicker from './datePicker.vue'
import doubleDatePicker from './doubleDatePicker.vue'
import monthPicker from './monthPicker.vue'
import multReport from './multReport.vue'
import password from './password.vue'
import select from './select.vue'
import singleReport from './singleReport.vue'
import feSwitch from './switch.vue'
import textArea from './textArea.vue'
import uploadCdn from './uploadCdn.vue'
import weekPicker from './weekPicker.vue'

const install = function (Vue) {
  if (install.installed) {
    return false
  }
  Vue.component(input.name, input)
  Vue.component(checkbox.name, checkbox)
  Vue.component(commonTree.name, commonTree)
  Vue.component(datePicker.name, datePicker)
  Vue.component(doubleDatePicker.name, doubleDatePicker)
  Vue.component(monthPicker.name, monthPicker)
  Vue.component(multReport.name, multReport)
  Vue.component(password.name, password)
  Vue.component(select.name, select)
  Vue.component(singleReport.name, singleReport)
  Vue.component(feSwitch.name, feSwitch)
  Vue.component(textArea.name, textArea)
  Vue.component(uploadCdn.name, uploadCdn)
  Vue.component(weekPicker.name, weekPicker)

}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export {
  install,
  input,
  checkbox,
  commonTree,
  datePicker,
  doubleDatePicker,
  monthPicker,
  multReport,
  password,
  select,
  singleReport,
  feSwitch,
  textArea,
  uploadCdn,
  weekPicker
}

export default {
  install,
}
