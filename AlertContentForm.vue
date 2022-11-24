<template>
    <div class="AlertContentForm">
        <AlertContent>
            <slot :formData="formData"/>
        </AlertContent>
        <alert-footer :hiddenConfirm="isView" v-bind="footerProps" @save="save">
            <slot name="footer"/>
        </alert-footer>
    </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref, provide, defineProps, defineEmits} from "vue"
const vm = getCurrentInstance()
const props = defineProps<{
    row:any
    isView:boolean
    config:FormDataMapType,
    successMessage:string
    footerProps:any
    initData:any
}>()
type FromDataMapType = {
    msg:string
    check?:(value:any)=> any
}
type FormDataMapType = Record<string, FromDataMapType | string>
const formDataMap = ref <FormDataMapType>(props.config)
const formData = ref<any>((Object as any).fromEntries(Object.keys(formDataMap.value).map((e:any) => [e, ((props.row || {})[e]) || ((props.initData || {})[e])])))

const emit = defineEmits(['save', 'add', 'edit'])
const save = async() => {
    const isNotVerifyKeyName:string = Object.keys(formData.value).find((k:any) => !formData.value[k] || (formDataMap.value[k] as any)?.check?.(formData.value[k])) as string
    const {msg, check} = formDataMap.value[isNotVerifyKeyName] as FromDataMapType || {}
    const value = formData.value[isNotVerifyKeyName]
    const checkMsg = check?.(value)
    if (isNotVerifyKeyName || checkMsg) {
        return window.$toast.error((value ? checkMsg : ( msg || formDataMap.value[isNotVerifyKeyName])) as string)
    }
    const events = (vm?.vnode?.props as Record<string, any>)
    if (props.row) {
        await events?.onEdit(formData.value, props.row)
    } else {
        await events?.onAdd(formData.value)
    }
    window.$toast.success(props.successMessage || '保存成功')
    emit('save')
    return true
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
