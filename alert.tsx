import {h, ref, defineComponent, defineAsyncComponent} from 'vue'
import {Dialog, DialogOptions, closeAllModals, ModalProps, WpButton, Toast} from 'wisdom-plus'
import {merge} from 'lodash'
import CommonModalHeader from './CommonModalHeader.vue'
import AlertFooter from './AlertFooter.vue'
import AlertContent from './AlertContent.vue'
import "./style.css"
export interface AlertPlugConfig {
    defineComponent?(config: AlertOptions):void
    defineConfig?(config: AlertOptions):AlertOptions
    onConfirm?(ev:MouseEvent):Promise<void> | void
    onCancel?(ev:MouseEvent):Promise<void> | void
}

/**
 * 自定义弹框选项
 */
export interface CustomAlertOptions{
}


export type AlertOptions = Partial<DialogOptions & AlertOptionsConfig & CustomAlertOptions>

const alertOptionsInIt = ref<AlertPlugConfig>({} as any)

export const alertPlug = (alertOptions:AlertOptions = {}) => {
    return (async ()=>{
        const options = await alertOptionsInIt.value?.defineConfig?.(merge({
            showCloseIcon:true,
            showTitle:true,
        },  alertOptions))
        const config = merge({
            showFooter:false,
            content:options.component ? h(defineComponent({
                setup() {
                    return () => [
                        options.showTitle ? h(CommonModalHeader, {
                            // title:options.title,
                            showClose:options.showCloseIcon,
                            onClose:() => {
                                alertPlug.close()
                            },
                        }, {
                            title:() => Object.prototype.toString.call(options.title) === '[object Object]' ? h(options.title) : options.title
                        }) : null,
                        h(Object.prototype.toString.call(options.component) === '[object Promise]' ? defineAsyncComponent(() => options.component) as any : options.component, merge({
                            title:options.props,
                        }, options.props), options.children),
                    ]
                }
            })) : options.content
        }, options, {
            title:false,
            showCloseIcon:true,
            props:merge({
                class:'common-wp-modal',
                showClose:false,
                width:'700px',
            }, options.modalProps)
        }, options.alert ? {
            title:options.title || '温馨提示',
            props:{
                width:400,
            },
            content:h(defineComponent({
                setup() {
                    return () => [
                        h('div', {
                            class:{
                                'p-a-15':true
                            }
                        }, options.content),
                        h(AlertFooter, {
                            hiddenCancel:options.hiddenCancel,
                            hiddenConfirm:options.hiddenConfirm,
                        }, () => [
                            h(WpButton, {
                                onClick:ev => {
                                    (async() => {
                                        try {
                                            await alertOptionsInIt.value?.onCancel?.(ev)
                                            await options.onCancel?.(ev)
                                            await alertPlug.close()
                                        } catch (e) {
                                            // err
                                        }
                                    })()
                                }
                            }, {
                                default:() => '取消'
                            }),
                            h(WpButton, {
                                type:'primary',
                                onClick:ev => {
                                    (async() => {
                                        try {
                                            await alertOptionsInIt.value?.onConfirm?.(ev)
                                            await options.onConfirm?.(ev)
                                            await alertPlug.close()
                                        } catch (e) {
                                            // err
                                        }
                                    })()
                                }
                            }, {
                                default:() => '确定'
                            })
                        ]),
                    ]
                }
            }))
        } : {})
        return await alertOptionsInIt.value.defineComponent?.(config as any) as void
    })()
}

alertPlug.install = (app, options:AlertPlugConfig = {}) => {
    alertOptionsInIt.value = merge<AlertPlugConfig, AlertPlugConfig>({
        defineComponent(config:any) {
            return Dialog(config)
        }
    }, options)
    app.config.globalProperties.$alert = alertPlug
    window.$alert = alertPlug
    app.config.globalProperties.$toast = Toast
    app.config.globalProperties.$Toast = Toast
    window.$toast = Toast
    app.component('alert-content', AlertContent)
    app.component('alert-footer', AlertFooter)
    app.component('common-modal-header', CommonModalHeader)
}

alertPlug.close = () => {
    closeAllModals()
}
interface AlertOptionsConfig {
    onConfirm?:(ev:MouseEvent)=>(Promise<void> | void)
    onCancel?:(ev:MouseEvent)=>(Promise<void> | void)
    content?:any
    alert?:boolean
    hiddenCancel?:boolean
    hiddenConfirm?:boolean
    component?:any
    title?:any
    showCloseIcon?:boolean
    showTitle?:boolean
    props?:Record<string, any>
    modalProps?: Partial<ModalProps> & Record<string, any>;
    children?: any []
}

declare global {
    interface Window {
        $alert:typeof alertPlug
        $toast: typeof Toast;
        $Toast: typeof Toast;
    }
}
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $alert: typeof alertPlug;
        $toast: typeof Toast;
        $Toast: typeof Toast;
    }
}

export default alertPlug
