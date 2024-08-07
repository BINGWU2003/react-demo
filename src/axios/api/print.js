/*
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-07 15:04:02
 * @FilePath: \print_client_service\src\axios\api\print.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
import request from "../index"

export function printerStatusReport(params) {
    return request({
        url: "/app/print/printerStatusReport",
        method: "GET",
        params
    })
}

export function callback(params) {
    return request({
        url: "/app/print/callback",
        method: "GET",
        params
    })
}
// 获取打印模板(带二维码)
export function workOrderCuttingInfo() {
    return request({
        url: "/print/getTemplate/work_order_cutting_info",
        method: "GET"
    })
}
// 获取打印模板(不带二维码)
export function workOrderCuttingInfoPrintNoCode() {
    return request({
        url: "/print/getTemplate/cutting_info_print_no_code",
        method: "GET"
    })
}