<template>
    <div class="header">
        <div class="item item-left">
            <div class="item-content">
                <DropdownHeader></DropdownHeader>
            </div>
        </div>
    </div>
</template>

<script>
import DropdownHeader from "./DropdownHeader";

export default {
    name: "Header",
    components: {DropdownHeader},
}
</script>

<style scoped>
.header {
    background: var(--primary-color-600);
    height: 64px;
    width: 100%;

    position: fixed;
    top: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: var(--z-index-2);
    color: #fff;
}

.item {
    height: 100%;
    display: flex;
    align-items: center;
    transition: all .2s;
}

.item:hover .item-content {
    background: var(--primary-color-800);
}

.item-content {
    /* padding: 8px; */
    background: var(--primary-color-600);
    display: flex;
    align-items: center;
    transition: all .2s;
    border-radius: 8px;
}

.item-content:hover {

}

.item-left {
    margin-left: auto;
}
</style>
