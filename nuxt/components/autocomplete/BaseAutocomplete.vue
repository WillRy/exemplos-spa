<template>
  <div
    class="form-group"
    :class="{
      error: error,
      md: size === 'md',
      lg: size === 'lg',
      disabled: disabled
    }"
  >
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>
    <div class="label-container" v-if="label">
      <label>{{ label }}</label>
    </div>

    <div style="display: flex; position: relative">
      <div class="form-group-container" :class="{ borda: borda, btn: $slots.btn }">
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>

        <input
          type="text"
          ref="input"
          :value="keyword"
          :placeholder="placeholder"
          @input="onInput"
          @blur="onBlur"
          @keydown="onKeydown"
          @focus="inputWithFocus = true"
        />
        <div v-if="loading" class="form-group-icon">
            <Loader width="20px" height="20px" :cor-principal="true"/>
        </div>
      </div>
      <template v-if="remover && hasValue && !loading">
        <button class="btn-remover-select" @click="onClear">x</button>
      </template>


      <div v-if="$slots.btn" class="form-group-btn">
        <slot name="btn"></slot>
      </div>

      <div v-show="mutableOptions.length" class="box-options">
        <ul class="py-1 rounded-md bg-white shadow-xs">
          <li
            v-for="(opt, index) in mutableOptions"
            :key="opt[trackBy]"
            :ref="`option_${index}`"
            class="autocomplete-item block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer"
            :class="{ 'autocomplete-item-active': arrowCounter === index }"
            @click="onSelect"
            tabindex="0"
            @mouseover="setArrowCounter(index)"
          >
            <span class="font-normal" v-html="opt[textBy]" />
          </li>
        </ul>
      </div>
    </div>

    <div v-if="$slots.legenda || legenda" class="legenda">
      <InfoInputIcon size="14px" class="icone-footer" />
      <slot name="legenda" v-if="$slots.legenda"></slot>
      <template v-else>{{ legenda }}</template>
    </div>
    <div v-if="$slots.success || success" class="successMessage">
      <InfoSuccessIcon size="14px" class="icone-footer" />
      <slot name="success" v-if="$slots.success"></slot>
      <template v-else>{{ success }}</template>
    </div>
    <div v-if="$slots.error || error" class="errorMessage">
      <InfoErrorIcon size="14px" class="icone-footer" />
      <slot name="error" v-if="$slots.error"></slot>
      <template v-else>{{ error }}</template>
    </div>
  </div>
</template>

<script>
import InfoErrorIcon from '../icons/InfoErrorIcon.vue'
import InfoInputIcon from '../icons/InfoInputIcon.vue'
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue'
import { PropType } from 'vue'
import Loader from '../Loader.vue'

export type SizeInput = 'md' | 'lg'

export default {
  inheritAttrs: false,
  emits: ['update:modelValue', 'update:selected', 'update:search', 'shouldSearch', 'onClear'],
  components: {
    InfoInputIcon,
    InfoSuccessIcon,
    InfoErrorIcon,
    Loader
  },
  directives: {},
  props: {
    disabled: {
      default: false
    },
    borda: {
      type: Boolean,
      default: true
    },
    size: {
      type: String as PropType<SizeInput>,
      default: 'md'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      default: 'Selecione um valor'
    },
    noResult: {
      type: String,
      default: 'Não foram encontrados itens com esta pesquisa'
    },
    noOptions: {
      type: String,
      default: 'Digite sua pesquisa'
    },
    maxElements: {
      type: String,
      default: null
    },
    modelValue: {
      type: Object
    },
    options: {
      type: Array<object>
    },
    search: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: true
    },
    error: {
      type: String
    },
    success: {
      type: String
    },
    legenda: {
      type: String
    },
    remover: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      default: null
    },
    textBy: {
      type: String,
      default: 'label'
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    searchMinLength: {
      type: Number,
      default: 3
    },
    ajax: {
      type: Boolean,
      default: false
    },
    autoFocusOnFirst: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: '',
      arrowCounter: this.autoFocusOnFirst ? 0 : -1,
      originalOptions: [],
      mutableOptions: [],
      inputWithFocus: false
    }
  },
  watch: {
    search(value) {
      this.keyword = value
    },

    options() {
      this.cloneOptions()
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs
      }
    },
    hasValue() {
      return this.search
    },
  },
  created() {
    this.keyword = this.search

    if (this.options.length) {
      this.cloneOptions()
    }
  },

  methods: {
    onInput(event: Event) {
      const vl = (event.target as HTMLInputElement).value;
      this.keyword = vl
      this.emitInput()

      if (vl.length >= this.searchMinLength) {
        this.$emit('shouldSearch', vl)
      } else {
        this.resetOptions()
        
      }

      return event
    },

    searchInternally() {
      const search = this.keyword

      if (search) {
        this.mutableOptions = this.originalOptions.filter(
          (o: any) => o[this.textBy].toLowerCase().search(search.toLowerCase()) >= 0
        )
      }

      // this.highlightOptions();
    },

    highlightOptions() {
      const search = this.keyword
      const query = new RegExp(search, 'i')

      // this.mutableOptions.forEach((o) => {
      //     this.$set(o, `${this.textBy}_highlighted`, o[this.textBy].replace(query, '<span class="font-bold">$&</span>'));
      // });
    },

    cloneOptions() {
      this.originalOptions = JSON.parse(JSON.stringify(this.options))
      this.mutableOptions = JSON.parse(JSON.stringify(this.options))
      this.searchInternally()
    },

    resetOptions() {
      this.originalOptions = []
      this.mutableOptions = []
    },

    onKeydown(evt) {
      if (!this.mutableOptions.length && evt.code !== "Enter") {
        return
      }

      switch (evt.code) {
        case 'ArrowDown':
          evt.preventDefault()
          this.onArrowDown()
          break
        case 'ArrowUp':
          evt.preventDefault()
          this.onArrowUp()
          break
        case 'Enter':
            
          this.onSelect()
          break
        case 'Escape':
          this.onEsc()
          break
      }
    },

    onEsc() {
      (this.$refs.input as HTMLInputElement).blur()
      this.resetArrowCounter()
      this.resetOptions()
    },

    onArrowDown() {
      if (this.arrowCounter < this.mutableOptions.length - 1) {
        this.arrowCounter += 1
      }

      this.fixScrolling()
    },

    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter -= 1
      }

      this.fixScrolling()
    },

    onBlur(evt) {
      const tgt = evt.relatedTarget
      if (tgt && tgt.classList.contains('autocomplete-item')) {
        return
      }

      this.resetOptions();
      this.resetArrowCounter();
    },

    setArrowCounter(number) {
      this.arrowCounter = number
    },

    fixScrolling() {
      // this.$refs[`option_${this.arrowCounter}`][0].scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'nearest',
      //   inline: 'start'
      // })
      const option = this.$refs[`option_${this.arrowCounter}`] as Array<HTMLElement>;
        if(option) {
          option[0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
          })
        }
    },

    resetArrowCounter() {
      if(this.autoFocusOnFirst) {
        this.arrowCounter = 0
      } else {
        this.arrowCounter = -1
      }
    },

    onSelect() {
      const selected = this.mutableOptions[this.arrowCounter]
      const selectedOption = selected ? this.options.find((o: any) => o[this.trackBy] === selected[this.trackBy]) : null

      if (selectedOption) {
        this.$emit('update:selected', selectedOption)
        this.keyword = selectedOption[this.textBy];
        this.emitInput();
        this.resetOptions();
        this.resetArrowCounter();
      } else {
        this.$emit('update:selected', null)
      }

      (this.$refs.input as HTMLInputElement).blur();
    },

    emitInput() {
      this.$emit('update:search', this.keyword)
    },

    resetKeyword() {
      this.keyword = ''
      this.emitInput()
    },

    onClear() {
      this.$emit('onClear', null)
      this.$emit('update:selected', null)
      this.resetKeyword()
      this.resetOptions()
    }
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;

  /* tamanho da borda */
  --border: 1px;

  /* tamanho medio do container */
  --md-min-height: 36px;

  /* tamanho grande do container */
  --lg-min-height: 42px;

  /* tamanho do input dentro do container */
  --md-min-height-input: calc(36px - var(--border) - var(--border));
  --lg-min-height-input: calc(42px - var(--border) - var(--border));

  /* tamanho do botão */
  --md-min-height-btn: calc(36px);
  --lg-min-height-btn: calc(42px);

  --label-color: var(--gray-color-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--primary-color-principal-focus);

  /* espaçamento do texto/label */
  --padding-text: 16px;
}

:deep(label) {
  line-height: 24px;
  font-weight: 400;
  font-size: 0.75rem;

  color: var(--label-color);
  margin-bottom: var(--label-margin-bottom);
  display: block;
  padding-left: var(--padding-text);
}

.form-group-container {
  position: relative;
  width: 100%;
}

.form-group-icon {
  flex-shrink: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group-icon > :deep(img) {
  height: 18px;
  width: 18px;
}

.form-group-icon > :deep(svg) {
  height: 18px;
  width: 18px;
}

.form-group-container:focus-within .form-group-icon > :deep(svg path) {
  fill: var(--focus-color);
}

.form-group-prefix {
  flex-shrink: 0;
}

.form-group-container {
  box-sizing: border-box;
  border: var(--border) solid transparent;
  display: flex;
  align-items: center;
}

.form-group-container.btn {
  padding-right: 0;
  border-right: 0;
}

.form-group-container.borda {
  background: #ffffff;
  border: var(--border) solid var(--gray-color-400);
  border-radius: 8px;
}

.form-group-container:not(.borda) {
  background: var(--gray-color-100);
  border-bottom: var(--border) solid var(--gray-color-800);
  border-radius: 8px 8px 0 0;
}

.md .form-group-container {
  min-height: var(--md-min-height);
}

.md .form-group-container input {
  min-height: var(--md-min-height-input);
}

.lg .form-group-container {
  min-height: var(--lg-min-height);
}

.lg .form-group-container input {
  min-height: var(--lg-min-height-input);
}

.form-group-container.borda:hover {
  border-top: var(--border) solid var(--primary-color-principal-hover);
  border-bottom: var(--border) solid var(--primary-color-principal-hover);
  border-left: var(--border) solid var(--primary-color-principal-hover);
  border-right: var(--border) solid var(--primary-color-principal-hover);
}

.form-group-container.borda:focus-within {
  box-shadow: var(--focus-color) 0px 0px 0px 1px inset;
  border: 1px solid var(--focus-color);
}

.form-group-container:not(.borda):hover {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--primary-color-principal-hover);
  border-left: var(--border) solid transparent;
  border-right: var(--border) solid transparent;
}

.form-group-container:not(.borda):focus-within {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--focus-color);
  border-left: var(--border) solid transparent;
  border-right: var(--border) solid transparent;
}

.disabled .form-group-container,
.disabled .form-group-container:hover,
.disabled .form-group-container:focus {
  background: var(--gray-color-100) !important;
  cursor: not-allowed;
}

.form-group-container.btn {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.form-group-btn {
  flex-shrink: 0;
}

.form-group-btn > :deep(button) {
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/*.error .form-group-container {*/
/*    border: 1px solid var(--error-color-500) !important;*/
/*}*/

input {
  cursor: inherit;
  font-size: 0.875rem;
  color: #444444;
  border: 0;
  width: 100%;
  background: transparent;
  border-radius: var(--radius-principal);
  padding: 0 var(--padding-text);
}

.icon input {
  padding: 0 calc(var(--padding-text) / 2);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
  -webkit-transition-delay: 9999s;
}

.lg input {
  font-size: 1rem;
}

input:focus {
  outline: 0;
}

input::placeholder {
  font-size: 0.875rem;
  color: var(--gray-color-400);
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.legenda {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--gray-color-400);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.legenda:deep(*) {
  margin: 0;
}

.legenda > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.errorMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--error-color-600);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.errorMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.successMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--success-color-600);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.successMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.box-options {
  background: #ffffff;
  position: absolute;
  width: 100%;
  overflow-y: scroll;
  max-height: 200px;
  margin-top: 100%;
  z-index: 1;
}

.box-empty {
  background: #ffffff;
  position: absolute;
  width: 100%;
  overflow-y: hidden;
  max-height: 200px;
  margin-top: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.md .box-options, .md .box-empty  {
  margin-top: var(--md-min-height);
}
.lg .box-options, .lg .box-empty  {
  margin-top: var(--lg-min-height);
}

.btn-remover-select {
  all: unset;
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 9;
  background: var(--error-color-600);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  line-height: 0;
}

.autocomplete-item-active {
    background: var(--primary-color-principal-active);
    color: #fff;
}
</style>
