"use strict";
/**
 * File ini memang terlihat tidak biasa — karena memang sengaja dibuat
 * untuk uji coba eksploratif: menemukan bug, fitur baru, atau eksperimen logika.
 *
 * Cukup jalankan:
 * @example
 * ```bash
 * tsx experimental/[name].ts
 * ```
 *
 * Kenapa tidak pakai vitest?
 *
 * Karena tujuan utamanya bukan validasi, tapi eksplorasi cepat dan langsung.
 *
 * 1. Vitest bagus untuk testing formal, tapi eksplorasi sering terbentur kebutuhan mock.
 * 2. Assertion seperti `toBeDefined()` kadang terasa membatasi saat hanya ingin lihat hasil mentah.
 *
 * # Kesimpulan
 * Untuk eksplorasi cepat, `tsx file.ts` lebih praktis daripada vitest.
 *
 * @author Aidomx
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var config_1 = require("@/rules/config");
var _events_1 = require("@/_events");
var payload_1 = require("@/rules/payload");
console.time('rules');
/**
 * Struktur baru defineRules untuk mendukung fleksibel
 * dalam memisahkan logic dan UI.
 *
 */
var test = [
    {
        name: 'test',
        design: {
            type: 'h1',
            className: '',
        },
    },
    {
        name: 'testHandler',
        design: {
            type: 'button',
        },
    },
];
var test2 = [
    {
        name: 'test2',
        design: {
            type: 'h1',
            className: '',
        },
    },
];
var test3 = [
    {
        name: 'test3',
        design: {
            type: 'h1',
            className: '',
        },
    },
];
exports.app = (0, config_1.defineConfig)({
    //remove: 'test2',
    //clone: 'test3',
    //connect: (rupa) => {
    //rupa('test', async (db) => {
    //await db.add({ name: 'Kaos panjang' })
    //})
    //},
    define: {
        root: 'container',
        components: { test: test, test2: test2, test3: test3 },
    },
    use: {
        name: 'testHandler',
        type: 'click',
        maps: function (e) {
            var tick = e === null || e === void 0 ? void 0 : e.pick('test3');
            console.log('Before delete: ', tick);
            e === null || e === void 0 ? void 0 : e.delete(tick !== null && tick !== void 0 ? tick : {}, 'design');
            console.log('after delete: ', tick);
        },
    },
    //spawn: {
    //id: 'buttonGroups',
    //config: {
    //count: 5,
    //design: {
    //type: 'button',
    //},
    //randomId: false,
    //contents: ['one', 'two', 'three', 'four', 'five'],
    //map(ghost: RulesApi.component, index) {
    //return {
    //...ghost,
    //design: {
    //...ghost.design,
    //className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
    //},
    //}
    //},
    //},
    //},
    //sort: {
    //from: 'test3',
    //to: 'test2',
    //},
    devMode: false,
});
(0, _events_1.triggerEvent)({
    name: 'testHandler',
    scope: false,
    event: 'click',
    payload: payload_1.payload,
});
console.log(exports.app);
console.timeEnd('rules');
