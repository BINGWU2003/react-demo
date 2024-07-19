import request from "../index"

export function phoneLogin(params) {
    return request({
        url: "/app/user/phoneLogin",
        method: "GET",
        params
    })
}

export function searchCompanies(params) {
    return request({
        url: "/app/user/companies",
        method: "GET",
        params
    })
}

export function getUserDetail(params) {
    return request({
        url: "/app/user/getUserDetail",
        method: "GET",
        params
    })
}

export function loginCompany(cid) {
    return request({
        url: "/app/user/loginCompany",
        method: "GET",
        params: {cid}
    })
}