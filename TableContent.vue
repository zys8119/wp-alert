<template>
    <div class="TableContent">
        <wp-pro-page-layout
            ref="page"
            :form="form"
            :table="{ columns:props.columns, props:{
                onEditRow:add,
                onViewRow:onViewRow,
                onDeleteRow:onDelRow,
                ...tableEmits,
            }, ...tableProps }"
            :show-checked-delete="false"
            :apis="apis"
            v-bind="props.props"
            @reset="formDataInit"
        >
            <template #form>
                <slot name="form" :formData="formData" :itemStyle="itemStyle"/>
            </template>
            <template #buttons>
                <slot name="buttons" :add="add"/>
            </template>
        </wp-pro-page-layout>
    </div>
</template>

<script setup lang="ts">
const vm = getCurrentInstance()
const tableEmits = computed<any>(() => {
    const res:any = {}
    for (const [key, value] of Object.entries(vm?.vnode.props as any)) {
        if (/on/.test(key)) {
            res[key] = value
        }
    }
    return res
})
const props = defineProps<{
    alertFile?:any
    columns:any[]
    data?:any[]
    props?:any
    tableProps?:any
    formDataInit?:any
    addTitle?:string
    viewTitle?:string
    editTitle?:string
    deleteMsg?:string
    apiList?(params:any):Promise<any>
    apiDelete?(id:string, row:any):Promise<any>
}>()
const itemStyle = ref({common:{alignItems:'center'}})
const form = ref<any>({
    queryAfterReset: true,
    hideInput:true,
})
const formData = ref<any>(props.formDataInit || {})
const formDataInit = () => {
    formData.value = props.formDataInit || {}
}
const apis = computed(() => ({
    list:((a:any, b:any) => (props.apiList?.({
        ...a,
        ...b,
        ...formData.value
    })) || Promise.resolve({
        data:{
            list:props.data || [],
            total:0,
        }
    }))
}))

const page = ref()
const reset = () => {
    page.value.reset()
}
const add = ({row}:any, isView:boolean = false) => {
    if (!props.alertFile) {return}
    window.$alert({
        title:isView ? (props.viewTitle || '查看') : (row ? (props.editTitle || '编辑') : (props.addTitle || '新增')),
        component:props.alertFile,
        modalProps:{
            width:'1000px'
        },
        props:{
            row,
            isView,
            onSave() {
                reset()
            }
        }
    })
}
const onViewRow = (e:any) => add(e, true)
const onDelRow = async({row}:any) => {
    window.$alert({
        alert:true,
        content:props.deleteMsg || '确定删除该数据吗？',
        hiddenConfirm:true,
        hiddenCancel:true,
        onConfirm:async() => {
            await props?.apiDelete?.(row.id, row)
            window.$toast.success('删除成功！')
            reset()
        }
    })
}
onBeforeMount(() => {
    formDataInit()
})
</script>

<style scoped lang="less">
.TableContent {
}
</style>
