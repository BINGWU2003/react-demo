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