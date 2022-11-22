# wp-alert

wp-alert 弹框插件

## 使用教程

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
