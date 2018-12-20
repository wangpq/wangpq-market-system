<template>
    <div id="selectCombo">
        <select
                ref="selectcombo"
                :value="currentValue"
                :disabled="disabled"
                @change="setCurrentValue($event.target.value)">
            <option :value="m.value" v-for="m in selectList" key="m.id">{{m.label}}</option>
        </select>
    </div>
</template>
<script>

  export default {
    name: 'selectCombo',
    props: {
      value: {
        type: Number,
        default: null
      },
      code: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value,
        selectList: []
      }
    },
    mounted () {
      this.$nextTick(() => {
      });
    },
    methods: {

      setCurrentValue (val) {
        this.currentValue = val
        // this.$emit('input', val)
      }
    },
  }
</script>
