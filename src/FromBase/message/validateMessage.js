export default function(key, value, form) {
  let template = ''
  switch (key) {
    case 'regex':
      template = `正则表达式验证错误：${value}`
      break
    case 'required':
      template = `此项为必填项`
      break
    case 'minLength':
      template = `允许输入的最小长度为：${value}`
      break
    case 'maxLength':
      template = `允许输入的最大长度为：${value}`
      break
    case 'maxValue':
      template = `允许输入的最大值为：${value}`
      break
    case 'minValue':
      template = `允许输入的最小值为：${value}`
      break
    case 'between':
      template = `允许输入的值应在：${value[0]} 到 ${value[1]} 之间`
      break
    case 'alpha':
      template = `只能输入字母`
      break
    case 'alphaNum':
      template = `只能为字母或数字`
      break
    case 'integer':
      template = `只允许输入正整数`
      break
    case 'decimal':
      template = `只接受正负十进制数`
      break
    case 'email':
      template = `只允许输入电子邮箱类型`
      break
    case 'ipAddress':
      template = `只允许输入ip地址 如 192.168.0.1`
      break
    case 'numeric':
      template = `只能为数字`
      break
    case 'compare':
      template = `对比验证失败`
      break
    case 'sameAs':
      const title = form.getTextValueByName(value)
      template = `此项内容应与${title}相同`
      break
    default:
      console.log(key)
      console.error('出现了目前还不支持的验证类型')
      break
  }
  return template
}
