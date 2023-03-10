import axios from "axios"
import { BASE_URL, LOGIN_API, STATUS_CODE, TOKEN, STATIC_URL } from "@/config/constant";
import { isLogin, logout } from "@/router/common/permManager";
import cookieUtil from "@/utils/cookieUtil";
// import qs from "qs";
import { Message } from "element-ui";
// import process from "eslint-plugin-vue/lib/configs/base";

const static_ins = axios.create({ baseURL: STATIC_URL, timeout: 5000 })

axios.defaults.timeout = 100000
// 根据环境使用不同的地址
axios.defaults.baseURL = BASE_URL
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url.indexOf(LOGIN_API) === -1) {
        console.log('requset', config.method, config.url)
        // 如果不是登录请求，需要验证登录是否过期
        if (isLogin()) {
            // 请求携带 Token 参数
            let token = cookieUtil.get(TOKEN)
            config.headers["X-APP-TOKEN"] = token
        } else {
            logout()
        }
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let res = response.data;
    if (res.statusCode === STATUS_CODE.NO_LOGIN) {
        // 服务器返回未登陆，跳转登录页面
        logout()
    } else if (res.statusCode === STATUS_CODE.NO_PERM) {
        Message.warning("没有权限，请联系管理员！")
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


/**
 * get 请求方式
 * @param config
 * @returns {Promise<unknown>}
 */
function get(config) {
    return new Promise((resolve, reject) => {
        axios({
            url: config.url,
            method: "GET",
            params: config.data
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

function getStatic(config) {
    return new Promise((resolve, reject) => {
        static_ins({
            url: config.url,
            method: "GET",
            params: config.data
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * post 请求方式
 * @param config
 * @returns {Promise<unknown>}
 */
function post(config) {
    return new Promise((resolve, reject) => {
        axios({
            url: config.url,
            method: "POST",
            // headers: {"content-type": "application/x-www-form-urlencoded"},
            headers: { "content-type": "application/json" },
            // data: qs.stringify(config.data),
            data: config.data,
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export default {
    get,
    post,
    getStatic
}
