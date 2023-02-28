<template>
    <div :class="{ 'form-group-has-icon': $slots.icon }" class="form-group">
        <label class="checkbox blue">
            <input type="checkbox" id="checkbox" class="checkbox" :checked="modelValue" @input="updateValue"
                   v-bind="attrs">
            <span class="indicator"></span>
            <template v-if="label">{{ label }}</template>
        </label>
        <div v-if="error || $slots.error" class="errorMessage">
            <div>{{ error }}</div>
            <slot name="error"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "BaseCheckbox",
    inheritAttrs: false,
    props: {
        label: {
            type: String,
            default: ''
        },
        modelValue: {
            default: null
        },
        error: {
            type: String,
        }
    },
    computed: {
        attrs() {
            return {
                ...this.$attrs,
                input: this.updateValue
            }
        }
    },
    methods: {
        updateValue(event) {
            let boolean = event.target.checked;
            this.$emit('update:modelValue', boolean)
        }
    },
}
</script>

<style scoped>
/* Checkbox styles */
label.checkbox {
    display: flex;
    align-items: center;
    /*justify-content: center;*/
    position: relative;
    cursor: pointer;
}


label.checkbox input[type="checkbox"] {
    /*position: absolute;*/
    right: -15px;
    position: relative;
    opacity: 0;
    margin-left: -16px;
}

label.checkbox input[type="checkbox"]:focus ~ span {
    border: 2px solid #aab0b9;
}

label.checkbox input[type="checkbox"]:focus:checked ~ span {
    border: 2px solid #20644c;
}

label.checkbox input[type="checkbox"]:checked ~ span {
    color: #fff !important;
    background: #329e78 url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMTIgOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHBhdGggZD0iTTQuNTc1IDguOTc3cy0uNDA0LS4wMDctLjUzNi0uMTY1TC4wNTcgNS42NGwuODI5LTEuMjI3TDQuNDcgNy4yNjggMTAuOTIxLjA4NmwuOTIzIDEuMTAzLTYuODYzIDcuNjRjLS4xMzQtLjAwMy0uNDA2LjE0OC0uNDA2LjE0OHoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPg0KPC9zdmc+) 50% 40% no-repeat;
    border: 2px solid #329e78;
}

label.checkbox span {
    border-radius: 3px;
    left: 0;
    top: -2px;
    width: 18px;
    height: 18px;
    background-color: #d4d7dc;
    border: 2px solid #d4d7dc;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

label.checkbox.blue {
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

label.checkbox.blue input[type="checkbox"] {
    /*position: absolute;*/
    right: -20px;
    position: relative;
    opacity: 0;
    margin-left: -16px;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

label.checkbox.blue input[type="checkbox"]:focus ~ span {
    border: 2px solid #aab0b9;
}

label.checkbox.blue input[type="checkbox"]:focus:checked ~ span {
    border: 2px solid var(--primary-color-500);
}

label.checkbox.blue input[type="checkbox"]:checked ~ span {
    color: #fff;
    background: var(--primary-color-500) url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMTIgOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHBhdGggZD0iTTQuNTc1IDguOTc3cy0uNDA0LS4wMDctLjUzNi0uMTY1TC4wNTcgNS42NGwuODI5LTEuMjI3TDQuNDcgNy4yNjggMTAuOTIxLjA4NmwuOTIzIDEuMTAzLTYuODYzIDcuNjRjLS4xMzQtLjAwMy0uNDA2LjE0OC0uNDA2LjE0OHoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPg0KPC9zdmc+) 50% 40% no-repeat;
    border: 2px solid #3785bc;
    margin-right: 5px;
}

label.checkbox.blue span {
    border-radius: 3px;
    left: 0;
    top: -2px;
    width: 18px;
    height: 18px;
    background-color: #d4d7dc;
    border: 2px solid #d4d7dc;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right: 5px;
}

label.checkbox.red {
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

label.checkbox.red input[type="checkbox"] {
    /*position: absolute;*/
    right: -15px;
    position: relative;
    opacity: 0;
    margin-left: -16px;
}

label.checkbox.red input[type="checkbox"]:focus ~ span {
    border: 2px solid #aab0b9;
}

label.checkbox.red input[type="checkbox"]:focus:checked ~ span {
    border: 2px solid #ad201e;
}

label.checkbox.red input[type="checkbox"]:checked ~ span {
    color: #fff;
    background: #dd3c3a url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMTIgOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHBhdGggZD0iTTQuNTc1IDguOTc3cy0uNDA0LS4wMDctLjUzNi0uMTY1TC4wNTcgNS42NGwuODI5LTEuMjI3TDQuNDcgNy4yNjggMTAuOTIxLjA4NmwuOTIzIDEuMTAzLTYuODYzIDcuNjRjLS4xMzQtLjAwMy0uNDA2LjE0OC0uNDA2LjE0OHoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPg0KPC9zdmc+) 50% 40% no-repeat;
    border: 2px solid #dd3c3a;
}

label.checkbox.red span {
    border-radius: 3px;
    left: 0;
    top: -2px;
    width: 18px;
    height: 18px;
    background-color: #d4d7dc;
    border: 2px solid #d4d7dc;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}


</style>
