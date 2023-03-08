<template>
    <button
        class="btn"
        :class="{
            'btn-min-width': min,
            'btn-sm': size === 'sm',
            'btn-md': size === 'md',
            'btn-lg': size === 'lg',
            'btn-full': full
        }"
        :disabled="disabled || loading"
        :style="{...(loading ? {paddingLeft: loadingPaddingSize} : {})}"
        :data-loading="loading"
    >
        <span>
            <Loader v-if="loading" :height="loadingSize" :width="loadingSize" :style="{'left': loadingLeft}"
                    :cor-principal="true"/>
            <slot></slot>
        </span>
    </button>
</template>

<script>
import Loader from "../Loader";

export default {
    name: "BaseButton",
    components: {Loader},
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'md'
        },
        type: {
            type: String,
            default: 'primary'
        },
        min: {
            type: Boolean,
            default: false
        },
        full: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        loadingSize() {
            switch (this.size) {
                case 'sm':
                    return '16px';
                case 'md':
                    return '24px';
                case 'lg':
                    return '30px';
                default:
                    return '16px'
            }
        },
        loadingPaddingSize() {
            switch (this.size) {
                case 'sm':
                    return '18px';
                case 'md':
                    return '26px';
                case 'lg':
                    return '32px';
                default:
                    return '18px'
            }
        },
        loadingLeft() {
            switch (this.size) {
                case 'sm':
                    return '-16px';
                case 'md':
                    return '-24px';
                case 'lg':
                    return '-30px';
                default:
                    return '-16px'
            }
        },
    }
}
</script>

<style scoped>
.btn {
    all: 'unset';
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    outline: 0;
    gap: 10px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
    position: relative;
}

.btn[data-loading='true'] {
    cursor: progress !important;
}

.btn :deep(.loader) {
    position: absolute;
    left: -21px;
    top: 50%;
    transform: translateY(-50%);
}

.btn-sm {
    font-size: 14px;
    padding: 6px;
}

.btn-md {
    font-size: 14px;
    padding: 10px 20px;
    min-height: 36px;
}

.btn-lg {
    font-size: 16px;
    padding: 10px 20px;
    min-height: 42px;
}

.btn-min-width {
    min-width: 100px;
}

.btn-full {
    width: 100%;
}


.btn > span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    outline: 0;
    gap: 10px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
}

</style>
