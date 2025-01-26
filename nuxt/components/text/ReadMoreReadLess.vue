<template>
    <div class="container-read">
        <template v-if="html">
            <div :class="{ 'corte-automatico': !isOpen, 'conteudo': true }" v-html="html" ref="textContent"></div>
            <div class="corte-automatico conteudo hidden" ref="textContentShadow" v-html="html" v-show="false"></div>
        </template>
        <template v-else>
            <div :class="{ 'corte-automatico': !isOpen, 'conteudo': true }" ref="textContent">
                <slot />
            </div>
            <div class="corte-automatico conteudo hidden" ref="textContentShadow" v-show="false">
                <slot />
            </div>
        </template>

        <button class="btn-ver-mais" v-if="showButtons && !isOpen" @click="isOpen = true">
            Ver mais
        </button>
        <button class="btn-ver-mais" v-if="showButtons && isOpen" @click="isOpen = false">
            Ver menos
        </button>
    </div>
</template>
<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue';

const emit = defineEmits(['update:aberto']);

const props = defineProps({
    html: String,
    numberOfLines: {
        type: Number,
        default: 3,
    },
    observerForever: {
        type: Boolean,
        default: true,
    },
    lineHeigth: {
        type: String,
        default: 'normal',
    },
    aberto: {
        type: Boolean,
        default: false,
    },
});

//ref atribuida ao elemento html (no DOM)
const textContent = ref(null);
const textContentShadow = ref(null);

//está cortado ou não
const shouldCutText = ref(false);
const isClamped = ref(false);

//se abriu o texto
const isOpen = computed({
    get: () => props.aberto,
    set: (value) => {
        emit('update:aberto', value);
    },
});

const showButtons = computed(() => shouldCutText.value);

const observer = ref(null)

//verifica se houve corte
const checkIsTextClamped = (elm) => {
    if (!elm) {
        return false;
    }

    const dimensions = getScrollHeight(elm);
    return dimensions.scrollHeight > dimensions.clientHeight + 1
};

function getScrollHeight(el) {
    if (!el?.cloneNode) {
        return null;
    }

    const clone = el.cloneNode(true);

    Object.assign(clone.style, {
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        'white-space': 'nowrap',
        width: '1px',
        'z-index': '-1',
        'display': 'block',
    });

    el.after(clone);
    const scrollHeight = clone.scrollHeight;
    const clientHeight = clone.clientHeight;

    clone.remove();

    return {
        scrollHeight,
        clientHeight,
    };
}


onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});
// verifica se houve corte ao montar o componente
onMounted(() => {
    shouldCutText.value = checkIsTextClamped(textContentShadow.value);
    isClamped.value = checkIsTextClamped(textContentShadow.value);



    //observa redimensionamento para verificar se houve corte e alimentar variavel de controle
    observer.value = new ResizeObserver((e) => {


        isClamped.value = checkIsTextClamped(e[0].target);

        if (!shouldCutText.value && isClamped.value) {
            isClamped.value = true;
            shouldCutText.value = true;
        }

        // if(shouldCutText.value && !isClamped.value) {
        //     isClamped.value = false;
        //     shouldCutText.value = false;
        // }


    });

    observer.value.observe(textContent.value)
});
</script>
<style scoped>
.corte-automatico {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    -webkit-line-clamp: v-bind(numberOfLines);
}

.btn-ver-mais {
    background: none;
    outline: none;
    border: none;
    color: #3b82f6 !important;
    cursor: pointer;
    font-size: 14px !important;
    padding: 4px 12px 4px 0px;
}

.btn-ver-mais:hover {
    text-decoration: underline;
}

.conteudo:deep(*) {
    overflow: visible;
}

.conteudo {
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    /* line-height: v-bind(lineHeigth); */
}

.hidden {
    /* border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
    z-index: -1; */
}
</style>