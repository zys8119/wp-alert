<template>
    <div class="AlertFooter">
        <wp-button v-if="!hiddenConfirm" @click="onCancel">取消</wp-button>
        <wp-button v-if="!hiddenConfirm" type="primary" @click="onConfirm">保存</wp-button>
        <slot/>
    </div>
</template>

<script setup lang="ts">
import {WpButton} from "wisdom-plus"
import {defineProps, getCurrentInstance} from "vue"
const props = defineProps<{
    alert?:boolean
    hiddenCancel?:boolean
    hiddenConfirm?:boolean
}>()
const emits = defineEmits<{
    (event: 'cancel', evt: MouseEvent): any
    (event: 'save', evt: MouseEvent): any
}>()
const vm = getCurrentInstance()
const onCancel = async(evt: MouseEvent) => {
    window.$alert.close()
    await emits('cancel', evt)
}
const onConfirm = async(evt: MouseEvent) => {
    const fn = (vm?.vnode?.props as Record<string, any>)?.onSave
    try {
        const fnRes = await fn?.(evt)
        if (typeof fnRes !== 'boolean') {
            window.$alert.close()
        }
    } catch (e) {
        window.$alert.close()
    }
}
</script>

<style scoped lang="less">
.AlertFooter {
    border-top: 1px solid #f6f6f6;
    padding-top: 15px;
    margin-top: 15px;
    text-align: center;
}
</style>
