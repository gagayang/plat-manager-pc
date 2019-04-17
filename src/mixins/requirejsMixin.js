export default {
  name: 'require-mixin',
  data() {
    this.readyRegExp = navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/
    this.isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]'
    this.useInteractive = false
    this.currentlyAddingScript = null
    this.header = document.getElementsByTagName('head')[0]
    return {

    }
  },
  methods: {
    createNode(config, moduleName, url) {
      const node =  config.xhtml ? document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') : document.createElement('script')
      node.type = config.scriptType || 'text/javascript'
      node.chartset = 'utf-8'
      node.async = true
      return node
    },
    loadScript(context, moduleName, url) {
      const config = (context && context.config) || {}
      const node = this.createNode(config, moduleName, url)
      node.setAttribute('data-requirecontext', config.contextName)
      node.setAttribute('data-requiremodule',  moduleName)
      if (node.attachEvent
        && !(node.attachEvent.toString
          && node.attachEvent.toString().indexOf('[native code]') < 0)
        && !this.isOpera
      ) {
        this.useInteractive = true
        node.attachEvent('onreadystatechange', this.onScriptLoad)
      } else {
        node.addEventListener('load', this.onScriptLoad, false)
        node.addEventListener('error', this.onScriptError, false)
      }
      node.src = url
      this.currentlyAddingScript = node
      this.header.appendChild(node)
      this.currentlyAddingScript = null
      return node;
    },
    onScriptLoad(evt) {
      if (evt.type === 'load' || (this.readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
        const data = this.getScriptData(evt);
        this.completeLoad(data.id);
      }
    },
    onScriptError(evt) {
      const data = this.getScriptData(evt)
      console.log('获取script 数据失败', data.id)
    },
    getScriptData(evt) {
      const node = evt.currentTarget || evt.srcElement
      this.removeListener(node, this.onScriptLoad, 'load', 'onreadystatechange')
      this.removeListener(node, this.onScriptError, 'error')

      return {
        node: node,
        id: node && node.getAttribute('data-requiremodule')
      }
    },
    removeListener(node, func, name, ieName) {
      if (node.detachEvent && !this.isOpera) {
        if (ieName) {
          node.detachEvent(ieName, func)
        }
      } else {
        node.removeEventListener(name, func, false)
      }
    },
    getAllScripts() {
      return document.getElementsByTagName('script')
    },
    removeScript(name) {
      const scripts = this.getAllScripts() || []
      for(let i = 0; i < scripts.length; i++) {
        const scriptNode = scripts[i]
        if (scriptNode.getAttribute('data-requiremodule') === name) {
          scriptNode.parentNode.removeChild(scriptNode)
          return true
        }
      }
    },
    completeLoad(moduleName) {
      this.removeScript(moduleName)
    }
  }
}
