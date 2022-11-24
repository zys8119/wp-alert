// @ts-ignore
export * from './alert'
// @ts-ignore
export {default} from './alert'
import CommonModalHeader from './CommonModalHeader.vue'
import AlertFooter from './AlertFooter.vue'
import AlertContent from './AlertContent.vue'
import AlertContentForm from './AlertContentForm.vue'
export {
    CommonModalHeader,
    AlertFooter,
    AlertContent,
    AlertContentForm,
}

export type ConfigType = {
    msg:string
    check?:(value:any)=> any
}
export type FormDataMapType = Record<string, ConfigType | string>
