import http from "../utils/httpUtil";
import { LOGIN_API } from "./constant";


/**
 * 用户登陆
 * @returns {Promise<unknown>}
 */
function userLogin(param) {
    return http.post({
        url: LOGIN_API,
        data: {
            name: param.userName,
            password: param.userPwd,
        }
    });
}


/**
 * 获取菜单列表
 * @returns {Promise<unknown>}
 */
function getLeftMenuList() {
    return http.getStatic({
        url: "static/res/leftmenu.json"
    });
}

function queryPatientPid(pid) {
    return http.post({
        url: "v1/patient/queryPatientByPid?pid=" + pid,
    });
}

function queryPatientByName(name) {
    return http.post({
        url: "v1/patient/queryPatientByName?name=" + name,
    });
}

function queryPatientByPidWithLastRecord(pid, recordDate) {
    return http.post({
        url: "v1/patient/queryPatientByPidWithLastRecord?pid=" + pid + "&recordDate=" + recordDate,
    });
}


function submitDailyRecord(data) {
    return http.post({
        url: "v1/patient/saveDailyRecord",
        data
    });
}

function createPatient(data) {
    return http.post({
        url: "v1/patient/createPatient",
        data
    });
}


export default {
    userLogin,
    getLeftMenuList,
    submitDailyRecord,
    queryPatientPid,
    createPatient,
    queryPatientByPidWithLastRecord,
    queryPatientByName
}


