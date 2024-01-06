<template>
  <div class="themeprovider">
    <slot :thema="thema"></slot>
  </div>
</template>

<script setup>
import {
  defineProps,
  computed,
  reactive,
  ref,
  onBeforeMount,
  watch,
} from "vue";
import {
  lighten,
  darken,
  shade,
  setHue,
  setSaturation,
  tint,
  adjustHue,
  setLightness,
  readableColor,
  getContrast,
} from "polished";

const props = defineProps({
  corThemaPrincipal: {
    type: String,
    required: false,
  },
});

const dados = reactive({
    corThemaPrincipal: props.corThemaPrincipal
})

const thema = reactive({
  primaryColor: {
    50: "#c4d8ff",
    100: "#abc7ff",
    200: "#8caff5",
    300: "#678edb",
    400: "#4871c2",
    500: "#2d57a8",
    600: "#18408f",
    700: "#082d75",
    800: "#001f5c",
    900: "#001642",
  },
  warningColor: {
    50: "#fff3ba",
    100: "#ffefa1",
    200: "#ffeb87",
    300: "#ffe66e",
    400: "#ffe254",
    500: "#ffde3b",
    600: "#ffd921",
    700: "#e6c007",
    800: "#cca900",
    900: "#b39400",
  },
});

function gerarEscala(cor) {

    const corDireta = cor;

    const corMaisEscura = shade(0.4, corDireta);

    const corEscuraReforcada = readableColor(corMaisEscura) === "#fff"  ? corMaisEscura : corMaisEscura;

    const contrasteRuim = getContrast(corDireta, "#fff") < 3 ? true : false;

    const corSelecionada = contrasteRuim ? corEscuraReforcada : corDireta;


  let novaEscala = {
    primaryColor: {
      50: tint(0.4, corSelecionada),
      100: tint(0.3, corSelecionada),
      200: tint(0.2, corSelecionada),
      300: tint(0.1, corSelecionada),
      400: corSelecionada,
      500: shade(0.1, corSelecionada),
      600: shade(0.2, corSelecionada),
      700: shade(0.3, corSelecionada),
      800: shade(0.4, corSelecionada),
      900: shade(0.5, corSelecionada),
    },
  };

  Object.assign(thema, novaEscala);
}

watch(() => props.corThemaPrincipal, () => {
  if (props.corThemaPrincipal) {
    dados.corThemaPrincipal = props.corThemaPrincipal;
    gerarEscala(props.corThemaPrincipal);
  }
});

onBeforeMount(() => {
  if (props.corThemaPrincipal) {
    dados.corThemaPrincipal = props.corThemaPrincipal;
    gerarEscala(props.corThemaPrincipal);
  }
});
</script>
<style scoped lang="scss">
$primary-colors: (
  50: v-bind("thema.primaryColor[50]"),
  100: v-bind("thema.primaryColor[100]"),
  200: v-bind("thema.primaryColor[200]"),
  300: v-bind("thema.primaryColor[300]"),
  400: v-bind("thema.primaryColor[400]"),
  500: v-bind("thema.primaryColor[500]"),
  600: v-bind("thema.primaryColor[600]"),
  700: v-bind("thema.primaryColor[700]"),
  800: v-bind("thema.primaryColor[800]"),
  900: v-bind("thema.primaryColor[900]"),
);

$warning-colors: (
  "50": #fff3ba,
  "100": #ffefa1,
  "200": #ffeb87,
  "300": #ffe66e,
  "400": #ffe254,
  "500": #ffde3b,
  "600": #ffd921,
  "700": #e6c007,
  "800": #cca900,
  "900": #b39400,
);

$error-colors: (
  "50": #ffc4c4,
  "100": #ffabab,
  "200": #ff9191,
  "300": #ff7878,
  "400": #f55b5b,
  "500": #db3b3b,
  "600": #c22121,
  "700": #a80c0c,
  "800": #8f0000,
  "900": #750000,
);

$gray: (
  "50": #ffffff,
  "100": #eff0f2,
  "200": #e1e2e6,
  "300": #adafb3,
  "400": #939599,
  "500": #797b80,
  "600": #606266,
  "700": #47494d,
  "800": #2f3033,
  "900": #000000,
);

$text-color: #2f3033;
$warning-color: #ffd921;

// FUNÇÃO que cria variaveis CSS com as cores
@mixin create-color-variables($prefix, $color-map) {
  @each $value, $color in $color-map {
    --#{"" + $prefix}-color-#{$value}: #{$color};
  }
}
@mixin create-color-simple-variables($prefix, $color-map) {
  @each $value, $color in $color-map {
    --#{"" + $prefix}-#{$value}: #{$color};
  }
}

//   incluir variaveis no CSS
:deep(*) {
  @include create-color-variables(primary, $primary-colors);
  @include create-color-variables(warning, $warning-colors);
  @include create-color-variables(error, $error-colors);
  @include create-color-simple-variables(gray, $gray);

  --text-color: #{$text-color};

  --secondary-color: #7f2ea6;
  --success-color: #31b383;
  --warning-color: #{$warning-color};
  --error-color: var(--error-color-600);

  --primary-color-principal: var(--primary-color-400);
  --primary-color-principal-hover: var(--primary-color-300);
  --primary-color-principal-active: var(--primary-color-700);
  --primary-color-principal-focus: var(--primary-color-300);
}

// cria classes de texto e background com as cores
@mixin create-color-classes($prefix, $color-map) {
  @each $value, $color in $color-map {
    .text-#{"" + $prefix}-#{$value} {
      color: #{$color};
    }

    .bg-#{"" + $prefix}-#{$value} {
      background: #{$color};
    }
  }
}

@mixin create-color-simple-classes($prefix, $color-map) {
  @each $value, $color in $color-map {
    .text-#{"" + $prefix}-#{$value} {
      color: #{$color};
    }

    .bg-#{"" + $prefix}-#{$value} {
      background: #{$color};
    }
  }
}

@include create-color-classes(primary, $primary-colors);
@include create-color-classes(warning, $warning-colors);
@include create-color-classes(error, $error-colors);
@include create-color-simple-classes(gray, $gray);



:deep(*) {
  /* variaveis botões primarios */
  --primary-button-background: var(--primary-color-principal);
  --primary-button-color: #fff;

   /* variaveis botões primarios: hover */
   --primary-button-hover-background: var(--primary-color-principal-hover);
   --primary-button-hover-color: #fff;

   /* variaveis botões primarios: focus */
   --primary-button-focus-background: var(--primary-color-principal-focus);
   --primary-button-focus-color: #fff;
   --primary-button-focus-shadow: var(--primary-color-principal-focus);

  /* variaveis botões primarios: active */
  --primary-button-active-background: var(--primary-color-principal-active);
  --primary-button-active-color: #fff;


  /* variaveis botões secundários */
  --secondary-button-background: none;
  --secondary-button-color: var(--primary-color-principal);
  --secondary-button-border: var(--primary-color-principal);
  --secondary-button-icon: var(--primary-color-principal);

  /* variaveis botões secundários : hover*/
  --secondary-button-hover-background: var(--primary-color-50);
  --secondary-button-hover-color: var(--primary-color-500);
  --secondary-button-hover-border: var(--primary-color-500);

  /* variaveis botões secundários : focus*/
  --secondary-button-focus-background: var(--primary-color-50);
  --secondary-button-focus-color: var(--primary-color-500);
  --secondary-button-focus-border: #fff;
  --secondary-button-focus-shadow: var(--primary-color-500);

  /* variaveis botões secundários : active*/
  --secondary-button-active-background: var(--primary-color-400);
  --secondary-button-active-color: #fff;
  --secondary-button-active-border: var(--primary-color-400);
  

  /* variaveis botões terciarios */
  --tertiary-button-background: none;
  --tertiary-button-color: var(--primary-color-principal);
  --tertiary-button-border: transparent;

  /* variaveis botões terciarios:hover */
  --tertiary-button-hover-background: var(--primary-color-50);
  --tertiary-button-hover-color: var(--primary-color-500);
  --tertiary-button-hover-border: transparent;

  /* variaveis botões terciarios:focus */
  --tertiary-button-focus-background: var(--primary-color-50);
  --tertiary-button-focus-color: var(--primary-color-500);
  --tertiary-button-focus-border: var(--primary-color-500);
  

  /* variaveis botões terciarios:active */
  --tertiary-button-active-background: var(--primary-color-400);
  --tertiary-button-active-color: #fff;
  --tertiary-button-active-border: transparent;
  


  /* variaveis botões danger */
  --danger-button-background: var(--error-color-600);
  --danger-button-color: #fff;
  --danger-button-border: transparent;

  /* variaveis botões danger: hover */
  --danger-button-hover-background: var(--error-color-400);
  --danger-button-hover-color: #fff;

  /* variaveis botões danger: focus */
  --danger-button-focus-background: var(--error-color-400);
  --danger-button-focus-shadow: var(--error-color-400);
  --danger-button-focus-color: #fff;

  /* variaveis botões danger: active */
  --danger-button-active-background: var(--error-color-700);
  --danger-button-active-color: #fff;


  /* variaveis botões danger-secondary */
  --danger-secondary-button-background: transparent;
  --danger-secondary-button-color: var(--error-color-600);
  --danger-secondary-button-border: var(--error-color-600);

  /* variaveis botões danger-secondary: hover */
  --danger-secondary-button-hover-background: var(--error-color-400);
  --danger-secondary-button-hover-color: #fff;
  --danger-secondary-button-hover-border: var(--error-color-600);

  /* variaveis botões danger-secondary: focus */
  --danger-secondary-button-focus-background: var(--error-color-400);
  --danger-secondary-button-focus-color: #fff;
  --danger-secondary-button-focus-shadow: var(--error-color-400);

  /* variaveis botões danger-secondary: active */
  --danger-secondary-button-active-background: var(--error-color-500);
  --danger-secondary-button-active-color: #fff;
  --danger-secondary-button-active-border: var(--error-color-700);


  /* variaveis botões danger-tertiary */
  --danger-tertiary-button-background: transparent;
  --danger-tertiary-button-color: var(--error-color-600);

  /* variaveis botões danger-tertiary: hover */
  --danger-tertiary-button-hover-background: var(--error-color-400);
  --danger-tertiary-button-hover-color: #fff;

  /* variaveis botões danger-tertiary: focus */
  --danger-tertiary-button-focus-background: var(--error-color-400);
  --danger-tertiary-button-focus-color: #fff;
  --danger-tertiary-button-focus-border: var(--error-color-600);
  
  /* variaveis botões danger-tertiary: active */
  --danger-tertiary-button-active-background: var(--error-color-500);
  --danger-tertiary-button-active-color: #fff;
}

</style>
