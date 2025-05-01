import type { DbProps } from './dbProps'
import type { DbStore } from './dbStore'

// @api createStore
export type ActionStore = {
  add: AddStore
  get: GetStore
  update: UpdateStore
  remove: RemoveStore
  reset: ResetStore
}

// @rupa createStore
export interface RupaStore extends ActionStore {}

// @types
export type DataStore = DbStore | DbStore[]

// @props
export type UpdateStoreProps = (prev: DbStore) => Promise<DbStore> | DbStore

export type GetStoreProps = {
  select?: DbProps
}

/**
 * Tipe untuk fungsi yang digunakan untuk menambah data ke store.
 */
export type AddStore = (data: DataStore) => Promise<void | DataStore>

/**
 * Tipe untuk fungsi yang digunakan untuk mengambil data dari store.
 */
export type GetStore = (props?: GetStoreProps) => Promise<DataStore | void>

/**
 * Tipe untuk fungsi yang digunakan untuk menghapus data dari store.
 */
/// <reference="ActionStore">
export type RemoveStore = (id: string) => Promise<DataStore | void>

/**
 * Tipe untuk fungsi yang digunakan untuk memperbarui data yang ada dalam store.
 */
export type UpdateStore = (
  id: string,
  cb: UpdateStoreProps
) => Promise<DataStore | void>

/**
 * Tipe untuk fungsi yang digunakan untuk mereset store ke kondisi awal.
 */
export type ResetStore = () => Promise<DataStore | void>

/**
 * Tipe untuk store yang berisi fungsi-fungsi dasar seperti add, get, update, remove, dan reset.
 * Store ini bertanggung jawab untuk mengelola state dan data dalam aplikasi.
 */
export type ManipulateCallback = (ctx: ActionStore) => void | Promise<void>

export type StoreManipulator = (
  pathId: string,
  cb: ManipulateCallback
) => Promise<void>

export type RupaCallback = (ctx: RupaStore) => Promise<void>

export type RupaManipulator = (pathId: string, cb: RupaCallback) => void

export type GenStore = {
  rupa: RupaManipulator
}
