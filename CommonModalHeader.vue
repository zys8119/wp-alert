<template>
    <div class="CommonModalHeader">
        <wp-space :item-style="{0:{flex:1}}" align="center">
            <div class="CommonModalHeaderTitle"><slot name="title"/></div>
            <div v-if="showClose" class="CommonModalHeaderCloseIcon" @click="$emit('close')"><wp-icon>
                <svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M585.412525 512.594747L973.601616 124.418586c19.600808-19.600808 19.600808-51.898182 0-71.49899l-2.120404-2.120404c-19.600808-19.600808-51.898182-19.600808-71.49899 0L511.793131 439.518384 123.61697 50.799192c-19.600808-19.600808-51.898182-19.600808-71.49899 0l-2.120404 2.120404c-20.11798 19.600808-20.11798 51.898182 0 71.49899l388.189091 388.189091L49.997576 900.783838c-19.587879 19.600808-19.587879 51.898182 0 71.49899l2.120404 2.120404c19.600808 19.600808 51.898182 19.600808 71.49899 0L511.793131 586.214141l388.189091 388.176162c19.600808 19.600808 51.898182 19.600808 71.49899 0l2.120404-2.120404c19.600808-19.600808 19.600808-51.898182 0-71.49899L585.412525 512.594747z m0 0" /></svg>
            </wp-icon></div>
        </wp-space>
    </div>
</template>

<script setup lang="ts">
import {WpSpace, WpIcon} from "wisdom-plus"
import {defineProps} from "vue"
const props = defineProps<{
    showClose:boolean
}>()
</script>

<style scoped lang="less">
.CommonModalHeader {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f6f6f6;
    .CommonModalHeaderTitle{
        font-weight: bold;
        display: flex;
        align-items: center;
    }
    .CommonModalHeaderCloseIcon{
        color: #c4c4c4;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        margin-left: 15px;
        &:hover{
            background-color: var(--primary-color);
            color: #ffffff;
        }
    }
}
</style>
