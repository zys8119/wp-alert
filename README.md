# wp-alert

wp-alert 弹框插件

## 使用教程

`npm i wp-alert`

### pc方式

1、main.ts

```typescript
import alert from 'wp-alert'
app.use(alert)
```

### h5方式（以 vant 为例）

1、main.ts

```typescript
import alert, {AlertPlugConfig} from 'wp-alert'
import {Dialog, DialogOptions} from 'vant'
import 'vant/lib/index.css'
import {merge} from 'lodash'
declare module 'wp-alert' {
    interface CustomAlertOptions extends DialogOptions{}
}
app.use(alert, {
    // 默认取消按钮回调
    onCancel(ev: MouseEvent): Promise<void> | void {
        window.$alert.close()
        Dialog.close()
    },
    // 默认确定按钮回调
    onConfirm(ev: MouseEvent): Promise<void> | void {
        window.$alert.close()
        Dialog.close()
    },
    // 打开弹框之前覆盖配置
    defineConfig:async(config) => {
        return {
            ...config,
            hiddenCancel:true,
            hiddenConfirm:true,
        }
    },
    // 可以更改弹框框架
    defineComponent:async(config) => {
        const content = await config.content
        const vnode = h(content?.default, config.props)
        return h(Dialog(merge( {
            title:config.title,
            message:content?.default ? (() => vnode) : content,
            className:config.className || (config.alert ? null : 'van-popup--bottom'),
            showConfirmButton:false,
            closeOnClickOverlay:true
        }, config)))
    }
} as AlertPlugConfig)
```


### 全局组件导入:

    CommonModalHeader
    AlertFooter
    AlertContent
    AlertContentForm

vite.config.ts

```typescript
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolver as WpAlertResolver} from 'wp-alert/resolver'
export default defineConfig({
    plugins:[
        AutoImport({
            resolvers: [
                WpAlertResolver()
            ]
        }),
        Components({
            resolvers: [
                WpAlertResolver()
            ]
        }),
    ]
})
```

## 内置组件介绍

### CommonModalHeader.vue

弹框公共头部

#### Props

| 名称    | 描述       |
|-------|----------|
| showClose | 是否显示关闭按钮 |

#### Slot

| 名称    | 描述  |
|-------|-----|
| title | 标题  |

### AlertContent.vue

弹框内容

#### Slot

| 名称      | 描述   |
|---------|------|
| default | 默认插槽 |

### AlertFooter.vue

弹框内容

#### Props

| 名称      | 描述     |
|---------|--------|
| hiddenCancel | 隐藏取消按钮 |
| hiddenConfirm | 隐藏确定按钮 |
| cancelText | 取消按钮文字 |
| confirmText | 确定按钮文字 |

#### Slot

| 名称      | 描述   |
|---------|------|
| default | 默认插槽 |

#### Emits

| 名称      | 描述  | 参数             |
|---------|-----|----------------|
| cancel | 取消  | (evt:any)=>any |
| save | 保存  | (evt:any)=>any   |

### AlertContentForm.vue

弹框内容

#### Props

| 名称      | 描述                        |
|---------|---------------------------|
| row | 编辑回显数据                    |
| isView | 是否为编辑状态                   |
| config | 表单配置：请参考示例                |
| successMessage | 成功回调提示语                   |
| footerProps | 尾部参数， 请参考：AlertFooter.vue |
| initData | 初始数据                      |

#### Slot

| 名称      | 描述       |
|---------|----------|
| default | 表单内容默认插槽 |
| footer | footer插槽 |

#### Emits

| 名称   | 描述  | 参数                       |
|------|-----|--------------------------|
| add  | 保存  | (data:any)=>any          |
| edit | 编辑  | (data:any, row:any)=>any |

#### 使用示例：

```vue
<template>
    <div class="AddFzlly">
        <AlertContentForm
            v-bind="$props"
            :config="config"
            @edit="edit"
            @add="add"
            @save="$emit('save')"
        >
            <template #default="{formData}">
                <wp-input v-model="formData.name" :disabled="isView" />
            </template>
        </AlertContentForm>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
const props = defineProps<{
    row:any
    isView:boolean
}>()

/**
 * 表单配置
 */
const config = ref({
    'name': '请输入姓名',
    'phone': {
        msg:'请输入联系方式',
        check:(value:any) => !/1[0-9]{10}/.test(value) ? '手机号格式错误' : null
    },
    'sex': '请选择性别',
    'area': '请选择所属地区',
    'state': '请设置绑定状态',
})

/**
 * 编辑数据
 * @param data 表单数据
 * @param row 当前数据
 */
const edit = (data:any, row:any) => {
    // 调用修改数据接口
    // window.api.***
}

/**
 * 创建数据
 * @param data 表单数据
 */
const add = (data:any) => {
    // 调用创建数据接口
    // window.api.***
}
</script>

```
