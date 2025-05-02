import { DbStore } from '../store'
import { ComponentVariant } from './variant'
import { HTMLElementType } from './type'

//export interface Component
//extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
//[>* Nama class CSS <]
//// className?: string
//children?: Component[]

//props?: Component

//[>* Data yang akan digunakan <]
//data?: DataBounds

//filters?: Filters

//[>* Properti tambahan lainnya <]
//[key: string]: any

//[>* Nama internal atau identifier dari komponen <]
//name?: string

//[>* Type dari komponen <]
//type?: string

//[>* Skeleton UI jika ingin delay render <]
//skeleton?: Skeleton

//[>* Gaya inline CSS dalam bentuk objek <]
//// style?: Record<string, string>

//[>* Nama tag HTML, contoh: div, span, button <]
//tag?: string
//// tagName?: string

//[>* Konten teks dalam komponen <]
//text?: string
//}

export type Design = {
  type: HTMLElementType
  className?: string
  variant?: ComponentVariant
  content?: string
}

export type Listeners = { [key: string]: <T>(events: T) => void | T }

export type RuleComponent = {
  name?: string
  data?: DbStore[]
  design?: Design
  listeners?: Listeners
  scope?: RuleComponent[]
  sealed?: false | true
}
