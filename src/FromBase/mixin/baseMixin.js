export default {
  props: {
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String
    },
    inForm: {
      type: Boolean,
      default: false
    },
    title: String,
    code: String,
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    value: {
      type: String | Array | Object | Boolean | Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    hasLabel: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    capitalize(value) {
      if (!value) {
        return ''
      } else {
        return value.toString() + "："
      }
    }
  },
  computed: {
    endTitle() {
      if (this.hasLabel) {
        return this.title
      } else {
        return ''
      }
    },
    isRequired() {
      return !!this.validate.required
    }
  }
}
