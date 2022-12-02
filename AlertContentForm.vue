<template>
    <div class="AlertContentForm">
        <AlertContent>
            <slot :formData="formData"/>
        </AlertContent>
        <alert-footer v-if="!hiddenFooter" :hiddenConfirm="isView" v-bind="footerProps" @save="save" :isH5="isH5">
            <template #="{cancel, confirm}">
                <slot name="footer"  :cancel="cancel" :confirm="confirm"/>
            </template>
        </alert-footer>
    </div>
</template>

<script setup lang="ts">
import AlertContent from "./AlertContent.vue"
import AlertFooter from "./AlertFooter.vue"
import {FormDataMapType, ConfigType} from "./index"
import {getCurrentInstance, ref, provide, defineProps, defineEmits, watch, computed, watchEffect} from "vue"
const vm = getCurrentInstance()
const props = defineProps<{
    row?:any
    isView?:boolean
    config:FormDataMapType,
    successMessage?:string
    footerProps?:any
    initData?:any
    modelValue?:any
    format?(value:any, row:any, key:string):any
    hiddenFooter?:boolean
    isH5?:boolean
}>()

const formDataMap = computed<FormDataMapType>(()=>{
    return props.config || {}
})
const formData = ref<any>({})


const emit = defineEmits(['save', 'add', 'edit', 'error', 'update:modelValue'])
watch(formData, (v:any)=>{
    emit('update:modelValue', v)
}, {
    deep:true,
    immediate:true
})

watchEffect(()=>{
    formData.value = (Object as any).fromEntries(Object.keys(formDataMap.value).map((e:any) => {
        const value = (props.row || {})[e] || (props.initData || {})[e] || null
        return [
            e,
            props.format?.(value, props.row, e) || value
        ]
    }))
})

const save = async() => {
    const events = (vm?.vnode?.props as Record<string, any>)
    try {
        const isNotVerifyKeyName:string = Object.keys(formData.value).find((k:any) => formDataMap.value[k] && (!formData.value[k] || (formDataMap.value[k] as any)?.check?.(formData.value[k]))) as string
        const {msg, check} = formDataMap.value[isNotVerifyKeyName] as ConfigType || {}
        const value = formData.value[isNotVerifyKeyName]
        const checkMsg = await check?.(value, formData.value)
        const error_msg = (checkMsg || msg || formDataMap.value[isNotVerifyKeyName])
        if (isNotVerifyKeyName && typeof error_msg === 'string') {
            return window.$toast.error(error_msg as string)
        }
        let apiRes = false
        if (props.row) {
            apiRes = await events?.onEdit(formData.value, props.row)
        } else {
            apiRes = await events?.onAdd(formData.value)
        }
        if(apiRes !== true){
            window.$toast.success(props.successMessage || '保存成功')
            emit('save')
            return true
        }
    }catch (e) {
        await events?.onEdit(e)
    }
}

provide('acf-formData', formData)
provide('acf-save', formData)
</script>

<style scoped lang="less">
.AlertContentForm {
    .title{
        color: var(--primary-color);
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .userInfo{
        display: flex;
        gap: 15px;
        .wp-upload{
            width: auto;
            flex: 0;
        }
        .uploadtx{
            width: 100px;
            height: 150px;
            object-fit: cover;
        }
        &>div{
            flex: 1;
            display: grid;
            gap: 15px;
            grid-template-columns: repeat(1, 1fr);
            &>div{
                display: flex;
                align-items: center;
            }
        }
    }
    .line{
        width: 100%;
        height: 1px;
        background-color: #d8d8d8;
        margin: 15px 0;
    }
    .wp-space{

    }
    .wp-upload-card{
        .uploadBtn{
            width: 100%;
            height: 150px;
            background-color: #f5f5f5;
            border:1px dashed #d8d8d8;
            overflow: hidden;
            border-radius: 10px;
            object-fit: contain;
        }
    }
    .msg{
        text-align: center;
    }

}
</style>
