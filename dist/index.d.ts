type DbProps = {
    id?: boolean;
    uuid?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    username?: boolean;
    email?: boolean;
    password?: boolean;
    name?: boolean;
    phone?: boolean;
    avatarUrl?: boolean;
    status?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
    role?: boolean;
    type?: boolean;
    userId?: boolean;
    categoryId?: boolean;
    parentId?: boolean;
    ownerId?: boolean;
    title?: boolean;
    slug?: boolean;
    description?: boolean;
    content?: boolean;
    imageUrl?: boolean;
    location?: boolean;
    address?: boolean;
    city?: boolean;
    country?: boolean;
    latitude?: boolean;
    longituda?: boolean;
    startTime?: boolean;
    endTime?: boolean;
};

type DbStore = {
    id?: string;
    uuid?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    phone?: number;
    avatarUrl?: string;
    status?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
    role?: string;
    type?: string;
    userId?: string;
    categoryId?: number;
    parentId?: number;
    ownerId?: number;
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    location?: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: string;
    longituda?: string;
    startTime?: Date;
    endTime?: Date;
    [key: string]: any;
};

type ActionStore = {
    add: AddStore;
    get: GetStore;
    update: UpdateStore;
    remove: RemoveStore;
    reset: ResetStore;
};
interface RupaStore extends ActionStore {
}
type DataStore = DbStore | DbStore[];
type UpdateStoreProps = (prev: DbStore) => Promise<DbStore> | DbStore;
type GetStoreProps = {
    select?: DbProps;
};
/**
 * Tipe untuk fungsi yang digunakan untuk menambah data ke store.
 */
type AddStore = (data: DataStore) => Promise<void | DataStore>;
/**
 * Tipe untuk fungsi yang digunakan untuk mengambil data dari store.
 */
type GetStore = (props?: GetStoreProps) => Promise<DataStore | void>;
/**
 * Tipe untuk fungsi yang digunakan untuk menghapus data dari store.
 */
type RemoveStore = (id: string) => Promise<DataStore | void>;
/**
 * Tipe untuk fungsi yang digunakan untuk memperbarui data yang ada dalam store.
 */
type UpdateStore = (id: string, cb: UpdateStoreProps) => Promise<DataStore | void>;
/**
 * Tipe untuk fungsi yang digunakan untuk mereset store ke kondisi awal.
 */
type ResetStore = () => Promise<DataStore | void>;
/**
 * Tipe untuk store yang berisi fungsi-fungsi dasar seperti add, get, update, remove, dan reset.
 * Store ini bertanggung jawab untuk mengelola state dan data dalam aplikasi.
 */
type ManipulateCallback = (ctx: ActionStore) => void | Promise<void>;
type StoreManipulator = (pathId: string, cb: ManipulateCallback) => Promise<void>;
type RupaCallback = (ctx: RupaStore) => Promise<void>;
type RupaManipulator = (pathId: string, cb: RupaCallback) => void;
type GenStore = {
    rupa: RupaManipulator;
};

type VariantColor = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type VariantSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type VariantShape = 'default' | 'rounded' | 'pill' | 'circle' | 'square';
type VariantStyle = 'text' | 'contained' | 'outlined' | 'ghost' | 'link' | 'flat' | 'soft';
type VariantElevation = 'none' | 'flat' | 'elevated' | 'raised' | 'deep';
type ComponentVariant = {
    color?: VariantColor;
    size?: VariantSize;
    shape?: VariantShape;
    style?: VariantStyle;
    elevation?: VariantElevation;
};

type HTMLElementType = 'address' | 'article' | 'aside' | 'footer' | 'header' | 'h1' | 'h2' | 'h3' | 'h4' | 'main' | 'nav' | 'section' | 'blockquote' | 'dd' | 'div' | 'dl' | 'dt' | 'figcaption' | 'figure' | 'hr' | 'li' | 'ol' | 'p' | 'pre' | 'ul' | 'a' | 'abbr' | 'b' | 'bdi' | 'bdo' | 'br' | 'cite' | 'code' | 'data' | 'dfn' | 'em' | 'i' | 'kbd' | 'mark' | 'q' | 'rb' | 'rp' | 'rt' | 'rtc' | 'ruby' | 's' | 'samp' | 'small' | 'span' | 'strong' | 'sub' | 'sup' | 'time' | 'u' | 'var' | 'wbr' | 'del' | 'ins' | 'area' | 'audio' | 'img' | 'map' | 'track' | 'video' | 'iframe' | 'embed' | 'object' | 'param' | 'picture' | 'source' | 'canvas' | 'form' | 'input' | 'textarea' | 'button' | 'select' | 'optgroup' | 'option' | 'label' | 'fieldset' | 'legend' | 'datalist' | 'output' | 'progress' | 'meter' | 'details' | 'dialog' | 'summary' | 'table' | 'caption' | 'colgroup' | 'col' | 'tbody' | 'thead' | 'tfoot' | 'tr' | 'td' | 'th' | 'slot' | 'template';

type Design = {
    type: HTMLElementType;
    className?: string;
    variant?: ComponentVariant;
    content?: string;
};
type Listeners = Record<string, (e: any) => void>;
type RuleComponent = {
    name?: string;
    data?: DataStore[];
    design?: Design;
    listeners?: Listeners;
    scope?: RuleComponent[];
    sealed?: false | true;
};

type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends (...args: any[]) => any ? T[P] : T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type RoutesMap = Record<string, string[]> | {
    pathname: string;
    name: string[];
}[];
type NormalizeRules = {
    pathname: string;
    name: string[];
};

/**
 * Digunakan untuk fungsi yang membutuhkan data.
 *
 * @type object | Record<string, string>
 */
type Data = Rules | Record<string, string>;
/**
 * Berbeda dengan `Data` yang ditujukan untuk parameter sebuah fungsi `DataObject` digunakan untuk properti pada `Rules`
 * untuk mengatur data dari external.
 *
 * @type Record<string, any>
 */
type DataObject = Partial<DbStore>;
/**
 * Alias `DataBounds` dari `DataObject`
 *
 * Digunakan untuk mendeteksi {} atau {}[]
 *
 * @type Record<string, any> | Record<string, any>[]
 */
type DataBounds = DataObject | DataObject[];

/**
 * Digunakan untuk menyembunyikan komponen
 *
 * @type object
 */
type Filters = {
    /** Nama component */
    name: string;
    /** Sembunyikan secara otomatis, default: `false` */
    autohide?: boolean;
};

/**
 * Fallback untuk menunggu respon dari data.
 *
 * @type object
 */
type Skeleton = {
    /** ClassName CSS custom untuk skeleton */
    /** Aktifkan skeleton UI */
    /** Nama skeleton component (optional) */
    /** Inline style untuk skeleton */
    select: SkeletonSelect;
    delay: {
        start: number;
        end: number;
    };
};
type SkeletonSelect = {
    name: string;
    status: boolean;
};

/**
 * Rules Api
 *
 * Adalah semua kumpulan fungsi yang bisa digunakan sesuai kebutuhan.
 *
 * Tersedia :
 * - createStore
 * - createVirtual
 *
 * Notes: Upcoming
 * @type object
 */
type RulesApi = {
    select?: {};
};

/**
 * Base rules
 *
 * Bersifat lokal sebagai bagian dari Rules
 *
 * @type object
 */
type Base = {
    /** Daftar komponen untuk dirender */
    components?: RuleComponent[];
    /** Selector root utama, contoh: #app atau body */
    root: string | string[];
    /** Routes */
    routes?: Record<string, string[]> | {
        pathname: string;
        name: string[];
    }[];
    /** Mode development */
    debug?: false | true;
    skeleton?: Skeleton;
};
/**
 * Rules Based
 *
 * Sebuah aturan untuk mendefinisikan berbagai komponen.
 *
 * @type object
 */
type Rules = DeepReadonly<Base & RuleComponent>;
/**
 * Rules based cache
 *
 * Digunakan untuk kebetuhan membaca dan menulis pada rules.
 *
 * @type object
 */
type CacheRules = Base & RuleComponent;
/**
 * Rules based cache
 *
 * Digunakan untuk kebetuhan membaca dan menulis pada rules.
 *
 * @type object
 */
type RulesConfig = Base & RuleComponent;

interface GhostElement extends RuleComponent {
    scope?: RuleComponent[];
}
type CreateGhostProps = {
    entries: GhostElement[];
    autoCompile?: boolean;
};
type GhostElements = GhostElement | GhostElement[];
type SpawnMapCallback = (g: GhostElement, i: number) => void;
type SpawnConfig = {
    count: number;
    design: Design;
    contents?: string[];
    randomId?: false | true;
    map?: SpawnMapCallback;
};
type CreateGhostLayer = (options: CreateGhostProps) => GhostElements;
type IsGhostReadyLayer = false | true;
type SpawnGhostsLayer = (id: string, config: SpawnConfig) => Record<string, any> | void;
type CompileLayer = (ghost: GhostElement) => void;
type PullGhostLayer = () => Record<string, GhostElement>;
type PushGhostLayer = () => RulesConfig;
type SealGhostLayer = (id?: string) => void;
type RemoveLayer = (id: string) => boolean;
type ResetLayer = () => boolean;
type CloneGhostLayer = (id: string) => GhostElement | void;
type SummonGhostLayer = (id: string) => GhostElement[] | void;
type SortGhostLayer = (config: {
    from?: string;
    to?: string;
}) => void;
type ConnectGhostLayer = (fn: (rupa: RupaManipulator) => Promise<void> | void) => void;
type MaintenanceLayer = boolean;
type VirtualApi = {
    /** createGhost */
    createGhost: CreateGhostLayer;
    connect: ConnectGhostLayer;
    cloneGhost: CloneGhostLayer;
    isGhostReady: IsGhostReadyLayer;
    maintenance: MaintenanceLayer;
    removeGhost: RemoveLayer;
    resetGhost: ResetLayer;
    spawnGhosts: SpawnGhostsLayer;
    summonGhost: SummonGhostLayer;
    sortGhost: SortGhostLayer;
    pullGhost: PullGhostLayer;
    pushGhost: PushGhostLayer;
};

declare const CACHE_KEY_RULES = "CJ1sUcqGXq8OYIBKMLAdft+onbRgu8V2Pze8oW71SH8=";
declare const GHOST_ELEMENT_ID = "ghost-";
declare const GHOST_KEY_RULES = "zJ0/GitvAfL5OIuW+Om/QrtU8vRgFncbUcanmRYOFaE=";
declare const STORE_KEY_RULES = "IzfdTfnpiLOcnNuJKH/zFm6nU1gSYooF6teBeYN8jqA=";

declare const RULES_SECRET_KEY: string;

declare const eventMaps: string[];

/**
 * Daftar HTMLElementType
 *
 * Digunakan untuk memvalidasi `design.type` dalam pembuatan ghost component.
 *
 * @type Array<string>
 */
declare const ghostElements: Array<string>;

declare function encodeData(data: DataStore): string;
declare function decodeData(encoded: string): any;

/**
 * Membekukan dan menyimpan rules ke cacheMap,
 * lalu menginisialisasi jika autorun diaktifkan.
 */
declare const secureRules: (rules: Rules) => Rules;

/**
 * API publik untuk membuat schema rules.
 *
 * @param rules Schema rules yang ingin digunakan.
 * @returns Hasil dari secureRules (frozen rules atau inisialisasi).
 */
declare const defineRules: (rules: Rules) => ReturnType<typeof secureRules>;

/**
 * Menghasilkan objek store dasar yang berisi aksi manipulasi store.
 * Store ini bersifat generik dan bertanggung jawab atas add, get, update, remove, dan reset.
 *
 * @returns {GenStore} Store dasar dengan fungsi manipulasi data.
 */
declare const generateStore: () => GenStore;
/**
 * Membuat store jika rules yang diberikan valid dan cocok dengan cache.
 * Digunakan dalam lingkungan runtime setelah rules diamankan.
 *
 * @param {Rules} rules - Rules yang diberikan untuk validasi dan inisialisasi.
 * @returns {GenStore} Store hasil generate jika valid, jika tidak, objek kosong.
 */
declare const createStore: (rules: Rules) => ReturnType<typeof generateStore>;

declare const generateVirtual: () => VirtualApi;
declare const createVirtual: (rules: Rules) => ReturnType<typeof generateVirtual>;

declare const deepClone: <T>(obj: T) => T;

declare const generateId: (tag: string, index?: number) => string;

declare const logWarning: (msg: string) => void;

declare const normalizeRules: (routes: RoutesMap) => NormalizeRules[];

/**
 * Check if a component with given `name` is allowed to render
 * based on current `window.location.pathname`, comparing it with
 * `rules.routes` or fallback to `rules.root`.
 *
 * @param name - The name identifier of the component.
 * @param rules - The rules configuration to evaluate against.
 * @returns True if the component is allowed to render, false otherwise.
 */
declare const resolvedPath: (name: string, rules: CacheRules) => boolean;

/**
 * Membandingkan dua objek untuk menentukan apakah mereka memiliki nilai yang sama pada properti yang sama.
 * Perbandingan dilakukan hanya pada properti pertama dan tidak menyeluruh ke dalam objek atau array yang lebih dalam.
 *
 * @param prev Objek pertama yang akan dibandingkan
 * @param current Objek kedua yang akan dibandingkan
 * @returns true jika objek `prev` dan `current` memiliki properti yang sama dengan nilai yang sama, false jika tidak
 */
declare const shallowEqual: <T extends Record<string, any> | null>(prev: T, current: T) => boolean;

export { type ActionStore, type AddStore, type Base, CACHE_KEY_RULES, type CacheRules, type CloneGhostLayer, type CompileLayer, type ConnectGhostLayer, type CreateGhostLayer, type CreateGhostProps, type Data, type DataBounds, type DataObject, type DataStore, type DbProps, type DbStore, type DeepReadonly, type Design, type Filters, GHOST_ELEMENT_ID, GHOST_KEY_RULES, type GenStore, type GetStore, type GetStoreProps, type GhostElement, type GhostElements, type IsGhostReadyLayer, type Listeners, type MaintenanceLayer, type ManipulateCallback, type NormalizeRules, type PullGhostLayer, type PushGhostLayer, RULES_SECRET_KEY, type RemoveLayer, type RemoveStore, type ResetLayer, type ResetStore, type RoutesMap, type RuleComponent, type Rules, type RulesApi, type RulesConfig, type RupaCallback, type RupaManipulator, type RupaStore, STORE_KEY_RULES, type SealGhostLayer, type Skeleton, type SortGhostLayer, type SpawnConfig, type SpawnGhostsLayer, type SpawnMapCallback, type StoreManipulator, type SummonGhostLayer, type UpdateStore, type UpdateStoreProps, type VirtualApi, createStore, createVirtual, decodeData, deepClone, defineRules, encodeData, eventMaps, generateId, ghostElements, logWarning, normalizeRules, resolvedPath, secureRules, shallowEqual };
