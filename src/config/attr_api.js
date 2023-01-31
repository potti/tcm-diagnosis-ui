import http from "../utils/httpUtil";


function getLeftBodyList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=左部"
    });
}

function getRightBodyList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=右部"
    });
}

function getCommonBodyList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=口腔"
    });
}

function getIntMedicalList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=内科诊断"
    });
}

function getMXoptionList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=脉象"
    });
}

function getLiuJingList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=六经"
    });
}
function getPathologyTypeList() {
    return http.post({
        url: "v1/dic/getDicDataListByName?dicName=诊断"
    });
}

function getDicType() {
    return http.post({
        url: "v1/dic/getDicList"
    });
}

function getDicDataList(dicIndex) {
    return http.post({
        url: "v1/dic/getDicDataList?dicIndex=" + dicIndex,
    });
}

function saveOrUpdateDicList(data) {
    return http.post({
        url: "v1/dic/saveOrUpdate",
        data
    });
}

export default {
    getLeftBodyList,
    getRightBodyList,
    getCommonBodyList,
    getMXoptionList,
    getLiuJingList,
    getDicType,
    getDicDataList,
    saveOrUpdateDicList,
    getIntMedicalList,
    getPathologyTypeList
}


