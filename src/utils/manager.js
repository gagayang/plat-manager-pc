import _ from 'lodash'
import request from './request'
import { Message } from 'element-ui'
import utils from './utils'
export default class HelpService {
  static getForm(form) {
    return new Form(form)
  }
  static getReport(report) {
    return new Report(report)
  }

  static utils = utils

  static ajax = request

  static getAjaxPost = function(url, data){
    return request({
      url,
      method: 'post',
      data
    })
  }

  static getAjaxGet = function(url, params) {
    return request({
      url,
      method: 'get',
      params
    })
  }

  static info = function(message) {
    Message.info(message)
  }

  static error = function(error) {
    Message.error(message)
  }

  static success = function(successInfo) {
    Message.success(successInfo)
  }

  static waring = function( waringInfo) {
    Message.warning(waringInfo)
  }

  /***
   * 处理js 有链接和直接行内两种
   * @param id
   * @param script
   */

  static dealScript(id, script) {
    if (script) {
      if (~script.indexOf('.js')) {
        _makeScript(id, script)
      } else {
        Function(script)()
      }
    }
  }

  /***
   * 处理css 有链接和直接行内两种
   * @param id
   * @param css
   */

  static dealCss(id, css) {
    if (css) {
      _makeCss(id, css)
    }
  }

  static removeScriptOrCss(id) {
    const script = document.querySelector('#' + id + 'script')
    const css = document.querySelector('#' + id + 'css')
    if (script) {
      script.parentElement.removeChild(script)
    }
    if (css) {
      css.parentElement.removeChild(css)
    }
  }
}
let _form = null

let _report = null

let _util = null

function _makeScript(id, script) {
  const myScript = document.createElement('script')
  myScript.type = 'text/javascript'
  myScript.src = script
  myScript.id = id + 'script'
  document.body.appendChild(myScript)
}

function _makeCss(id, css) {
  const myCss = document.createElement('link')
  myCss.type = 'text/css'
  myCss.rel = 'stylesheet'
  myCss.id = id + 'css'
  if (~css.indexOf('.css')) {
    myCss.href = css
  } else {
    myCss.appendChild(document.createTextNode(css))
  }
  document.getElementsByTagName('head')[0].appendChild(myCss)
}

const _getFormParamsModelItem = function(form, name, code = 'name') {
  let returnItem = ''
  const targt = {}
  targt[code] = name
  returnItem = _.find(form.$data.paramsModelClone, targt)
  return returnItem
}
const _getValueModelItem = function(form, name, code = 'name') {
  let returnItem = ''
  returnItem = form.$data.valueClone[name]
  return returnItem
}
const _getComponentByName = (form, name) =>  {
  let comp = null
  form.$children[0].$children.forEach((component) => {
    if(component.$props.name && component.$props.name === name) {
      return comp = component
    }
  })
  return comp
}

class Report {
  constructor(vueReport) {
    this.report = vueReport
  }
  getCheckedRows() {
    return this.report.$data.checked
  }

  setCheckedRows(rows) {
    (rows||[]).forEach(row => {
      this.report.setChecked(row)
    })

  }

  getRadioValue() {
    return this.report.$data.radioValue
  }

  search() {
    this.report.getData()
  }
}

class Form {
  constructor(vueForm) {
    this.form = vueForm
  }

  /*
   * 获取输入的值
   * @param name
   */
  getValue(name) {
    const item = _getValueModelItem(this.form, name)
    return item
  }

  /**
   * 给输入域赋值
   * @param name
   * @param value
   */
  setValue(name, value) {
    this.form.$data.valueClone[name] = value
  }

  /**
   * 显示输入域
   * @param name
   */
  showField(name) {
    const item = _getFormParamsModelItem(this.form, name)
    if (item) {
      this.form.$set(item, 'isHidden', false)
    }
  }

  /**
   * 隐藏输入域
   * @param name
   */
  hideField(name) {
    const item = _getFormParamsModelItem(this.form, name)
    if (item) {
      this.form.$set(item, 'isHidden', true)
    }
  }

  /*
   * 设置输入域是否只读
   * @param name
   * @param falg
   */
  setDisable(name, falg) {
    const item = _getFormParamsModelItem(this.form, name)
    if (item) {
      this.form.$set(item, 'disabled', falg)
    }
  }
  getTextValueByName(name) {
    const item = _getFormParamsModelItem(this.form, name)
    if (item) {
      return item.title
    } else {
      return null
    }
  }

  triggerValidate(name) {
    const component = _getComponentByName(this.form, name)
    component.triggerVaildate()
  }
  getComponentByName(name) {
    const component = _getComponentByName(this.form, name)
    return component
  }

  /**
   * 增加监听
   * @param args
   * @param callback
   * @param deep
   * @param immediate
   */
  addListener(args = [], callback, deep = true, immediate = true) {
    const that = this
    const trigger = function() {
      const triggers = []
      args.forEach((i) => {
        const item = _getValueModelItem(that.form, i)
        if (item) {
          triggers.push(item.value)
        }
      })
      return triggers.join('==')
    }
    const handler = function(value, oldValue) {
      callback(this, value)
    }
    const unwatch = this.form.$watch(trigger,
      handler, {
        immediate: immediate,
        deep: deep
      })
    this.form.dynamicWatches.push(unwatch)
  }

  getSubFormItemValue(index = 0, rowIndex, name) {
    const subForm =  this.form.$data.valueClone.subForms[index]
    const retValue = []
    if(rowIndex) {
      retValue.push(subForm[rowIndex][name])
    } else {
      subForm.forEach(item => {
        retValue.push(item[name])
      })
    }
    return retValue
  }

  setSubFormItemValue(index= 0, rowIndex, name, value) {
    const subForm =  this.form.$data.valueClone.subForms[index]

    if(rowIndex) {
      subForm[rowIndex][name] = value
    } else {
      subForm.forEach(item => {
        item[name] = value
      })
    }
  }

  hideSubFormItem(index = 0, rowIndex, name) {
    const subForm =  this.form.$data.subFormsClone[index]
    if(rowIndex) {
      const item = subForm[rowIndex]
      this.form.$set(item, 'isHidden', true)
    } else {
      subForm.forEach(item => {
        const i = item[name]
        this.form.$set(i, 'isHidden', true)
      })
    }
  }

  showSubFormItem(index = 0, rowIndex, name) {
    const subForm =  this.form.$data.subFormsClone[index]
    if(rowIndex) {
      const item = subForm[rowIndex]
      this.form.$set(item, 'isHidden', false)
    } else {
      subForm.forEach(item => {
        const i = item[name]
        this.form.$set(i, 'isHidden', false)
      })
    }
  }

  disableSubFormItem(index = 0, rowIndex, name, falg) {
    const subForm =  this.form.$data.subFormsClone[index]
    if(rowIndex) {
      const item = subForm[rowIndex]
      this.form.$set(item, 'disabled', falg)
    } else {
      subForm.forEach(item => {
        const i = item[name]
        this.form.$set(i, 'disabled', falg)
      })
    }
  }

}
