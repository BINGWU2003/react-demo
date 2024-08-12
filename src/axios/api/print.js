/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-12 14:22:12
 * @FilePath: \print_client_service\src\axios\api\print.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
import request from "../index"


export function register(params) {
    return request({
        url: "/app/remotePrint/register",
        method: "GET",
        params
    })
}

export function registerPrint(params) {
    return request({
        url: "/app/remotePrint/registerPrint",
        method: "GET",
        params
    })
}

export function getClientStatus() {
    return request({
        url: "/app/remotePrint/getClientStatus",
        method: "GET",
    })
}

export function pushClientStatus(params) {
    return request({
        url: "/app/remotePrint/pushClientStatus",
        method: "GET",
        params
    })
}
export function getPrintData(params) {
    return request({
        url: "/app/remotePrint/getPrintData",
        method: "GET",
        params
    })
}

export function printCallback(params) {
    return request({
        url: "/app/remotePrint/printCallback",
        method: "GET",
        params
    })
}

export function getMqttConfig() {
    return request({
        url: "/app/remotePrint/getMqttConfig",
        method: "GET"
    })
}