import {ComponentResolver} from 'unplugin-vue-components'
export type ResolverType = () => ComponentResolver[]
export const resolver:ResolverType = () => []
export default resolver
