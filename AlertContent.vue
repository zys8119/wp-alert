<template>
    <div class="AlertContent">
        <slot/>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.AlertContent {
    max-height: 75vh;
    overflow-x: hidden;
    padding: 0 15px;
}
</style>
