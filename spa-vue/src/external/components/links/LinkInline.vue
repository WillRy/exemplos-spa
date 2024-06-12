<template>
    <component :is="is" :class="[size,'link-inline']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
export default {
    name: "LinkInline",
    props: {
        is: {
            type: String,
            default: 'a'
        },
        size: {
            type: String,
            default: 'sm',
            validator(value: string) {
                return ["sm", "lg"].includes(value);
            }
        },
    }
}
</script>

<style scoped>
.link-inline {
  margin: 0;
  color: var(--primary-color-principal);
  text-decoration: none;
}

.link-inline:hover {
  color: var(--primary-color-principal);
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}

.lg {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: normal;
}

.sm {
  font-size: 0.875rem;
  line-height: 1.4875rem;
  font-weight: normal;
}
</style>
