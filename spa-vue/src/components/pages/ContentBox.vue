<template>
    <div class="content">
        <slot>

        </slot>
    </div>
</template>

<script>
export default {
    name: "ContentBox"
}
</script>

<style scoped>
.content-box {
    padding: 20px;
    background: #fff;
    border-radius: 12px;
}


</style>
