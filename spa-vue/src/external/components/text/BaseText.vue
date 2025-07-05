<template>
  <component :is="is" :class="variant">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>

type StyleActionText = "action-text-sm" | "action-text-md" | "action-text-lg";
type StyleBodyText = "body-text-sm" | "body-text-md" | "body-text-lg";
type StyleCaptionText = "caption-text-md";
type StyleHeadingText = "heading-text-sm" | "heading-text-md" | "heading-text-lg" | "heading-text-xl" | "heading-text-xxl" | "heading-text-xxxl";
type StyleInlineText = "inline-text-sm" | "inline-text-md" | "inline-text-lg";
type StyleOverlineText = "overline-text-sm" | "overline-text-md" | "overline-text-lg";
type StyleSubtitleText = "subtitle-text-sm" | "subtitle-text-lg";


type Variante = StyleActionText | StyleBodyText | StyleCaptionText | StyleHeadingText | StyleInlineText | StyleOverlineText | StyleSubtitleText;

withDefaults(defineProps<{
  is?: string;
  variant?: Variante;
}>(), {
  is: 'p',
  variant: 'body-text-md'
})

</script>

<style scoped></style>
