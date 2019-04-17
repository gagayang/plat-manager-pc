import {
  required,
  minLength,
  between,
  alpha,
  alphaNum,
  integer,
  decimal,
  email,
  numeric,
  ipAddress,
  helpers,
  maxValue,
  maxLength,
  minValue,
  sameAs
} from 'vuelidate/lib/validators'
import getMessage from '../message/validateMessage'
import {validationMixin} from 'vuelidate'
// import _ from 'lodash'
/* eslint-disable */

export default {
  mixins: [validationMixin],
  data() {
    return {
      errorMessage: '',
      validateRules: {}
    }
  },
  props: {
    code: {
      type: String,
      required: true
    },
    validate: {
      type: Object,
      default() {
        return  {}
      }
    }
  },
  computed: {},
  methods: {
    triggerVaildate() {
      this.$v.defaultValue.$touch()
    },
    focus() {
      this.$refs.input && this.$refs.input.focus()
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        // this.$v.defaultValue.$touch()
      },
      deep: true
    },
    '$v.$error': {
      handler(val) {
        if (val) {
          let message = ''
          const dv = this.$v.defaultValue
          for (const i in dv) {
            if (!i.startsWith('$') && !_.isFunction(dv[i])) {
              if (!dv[i]) {
                message = this.validateRules[i]
              }
            }
          }
          this.errorMessage = message.message
        }
        this.hasError = val
        this.$nextTick(() => {
          this.$emit('vaildate', val)
        })
      },
      deep: true,
      immediate: true
    }
  },
  validations() {
    const retObj = {}
    const v = this.validate
    const _form = window.helpSpace[this.code].form
    for (const i in v) {
      if (v[i]) {
        let value = v[i]
        if (_.isObject(value) && !_.isArray(value)) {
          value = value['value']
          this.validateRules[i] = {
            value,
            message: v[i]['message']
          }
        } else {
          const message = getMessage(i, value, _form)
          this.validateRules[i] = {
            value,
            message
          }
        }

        switch (i) {
          case 'regex':
            retObj['regex'] = helpers.regex(this.defaultValue, new Function('return ' + value)())
            break
          case 'required':
            retObj['required'] = required
            break
          case 'minLength':
            retObj['minLength'] = minLength(value)
            break
          case 'maxLength':
            retObj['maxLength'] = maxLength(value)
            break
          case 'maxValue':
            retObj['maxValue'] = maxValue(value)
            break
          case 'minValue':
            retObj['minValue'] = minValue(value)
            break
          case 'between':
            retObj['between'] = between(value[0], value[1])
            break
          case 'alpha':
            retObj['alpha'] = alpha
            break
          case 'alphaNum':
            retObj['alphaNum'] = alphaNum
            break
          case 'numeric':
            retObj['numeric'] = numeric
            break
          case 'sameAs':
            const mustBeSameWidth = (v, ov) => {
              const targetValue = _form.getValue(value)
              if (v === targetValue) {
                return true
              } else {
                return false
              }
            }
            retObj['sameAs'] = mustBeSameWidth
            break
          case 'integer':
            retObj['integer'] = integer
            break
          case 'decimal':
            retObj['decimal'] = decimal // 接受正负十进制数
            break
          case 'email':
            retObj['email'] = email
            break
          case 'ipAddress':
            retObj['ipAddress'] = ipAddress
            break
          case 'compare':
            retObj['compare'] = Function(value)
            break
          default:
            console.error('出现了目前还不支持的验证类型')
            break
        }
      }
    }
    return {
      defaultValue: retObj
    }
  }
}
