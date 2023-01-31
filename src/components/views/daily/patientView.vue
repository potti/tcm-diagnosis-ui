<template>
    <!-- 'calc(100vh - 152px)' -->
    <el-card v-if="refresh" class="box-card" shadow="never" :body-style="{ padding: '15px', height: '100%' }">
        <el-container>
            <el-aside v-bind:style="{ width: daily_width + '%', 'padding-top': '20px' }">
                <el-form style="padding-left: 12px;" :inline="true" :model="queryFrom" class="demo-form-inline">
                    <el-select v-model="queryFrom.name" placeholder="候诊人" style="width: 200px" @change="onQuery"
                        ref="queryNameSelect" filterable remote reserve-keyword :remote-method="queryName"
                        @hook:mounted="cancalReadOnly" @visible-change="cancalReadOnly">
                        <el-option v-for="item in patients" :key="item.pid" :label="item.name + '     年龄:' + item.age"
                            :value="item.pid">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ '年龄:' + item.age }}</span>
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="queryFrom.recordDate" type="date" placeholder="选择日期"
                        :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-form-item label="上次就诊时间:" v-if="queryFrom.lastrecordDate != ''">
                        <div>{{ queryFrom.lastrecordDate }}</div>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="!compare" type="primary" @click="dialogFormVisible = true">新建</el-button>
                        <el-button type="primary" @click="onCompare">
                            <div v-if="!compare">对比</div>
                            <div v-if="compare">取消</div>
                        </el-button>
                        <el-button style="padding-left: 80px;" v-if="!compare" type="success" @click="onSubmit">提交
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="todayFrom" label-position="right" label-width="80px" size="mini"
                    v-loading="todayFromReload">
                    <velChineseMedicine id="todayFrom" ref='todayRecord' :data="todayFrom" :leftBody="leftBody"
                        :rightBody="rightBody" :commonBody="commonBody" :mxOptions="mxOptions" :intMedical="intMedical">
                    </velChineseMedicine>
                    <el-row>
                        <el-form-item label="六经诊断">
                            <el-button type="primary" @click="addDiagnosisRow">增加</el-button>
                        </el-form-item>
                    </el-row>
                    <div>
                        <div v-for="(item, index) in diagnosisList" v-bind:key="item.dicKey">
                            <el-row v-if="index % 4 == 0">
                                <el-form-item label="">
                                    <el-col :span="6">
                                        <el-autocomplete class="inline-input" style="width:100%" v-model="item.value"
                                            :fetch-suggestions="queryLiujingSearch" placeholder="六经诊断"
                                            valueKey="keyDesc" @select="(e) => handleLiujingSelect(e, index)"
                                            type="textarea" :autosize="{ minRows: 1 }" popper-class="c-options">
                                        </el-autocomplete>
                                    </el-col>
                                    <el-col :span="6" v-if="diagnosisList[index + 1]">
                                        <el-autocomplete class="inline-input" style="width:100%" valueKey="keyDesc"
                                            v-model="diagnosisList[index + 1].value"
                                            :fetch-suggestions="queryLiujingSearch" placeholder="六经诊断"
                                            @select="(e) => handleLiujingSelect(e, index + 1)" type="textarea"
                                            :autosize="{ minRows: 1 }" popper-class="c-options">
                                        </el-autocomplete>
                                    </el-col>
                                    <el-col :span="6" v-if="diagnosisList[index + 2]">
                                        <el-autocomplete class="inline-input" style="width:100%" valueKey="keyDesc"
                                            v-model="diagnosisList[index + 2].value"
                                            :fetch-suggestions="queryLiujingSearch" placeholder="六经诊断"
                                            @select="(e) => handleLiujingSelect(e, index + 2)" type="textarea"
                                            :autosize="{ minRows: 1 }" popper-class="c-options">
                                        </el-autocomplete>
                                    </el-col>
                                    <el-col :span="6" v-if="diagnosisList[index + 3]">
                                        <el-autocomplete class="inline-input" style="width:100%" valueKey="keyDesc"
                                            v-model="diagnosisList[index + 3].value"
                                            :fetch-suggestions="queryLiujingSearch" placeholder="六经诊断"
                                            @select="(e) => handleLiujingSelect(e, index + 3)" type="textarea"
                                            :autosize="{ minRows: 1 }" popper-class="c-options">
                                        </el-autocomplete>
                                    </el-col>
                                </el-form-item>
                            </el-row>
                        </div>
                    </div>

                    <el-row style="padding-top:20px">
                        <el-form-item label="药方">
                            <el-input type="textarea" placeholder="请输入药方" v-model="todayFrom.prescription"
                                :autosize="{ minRows: 1 }">
                            </el-input>
                        </el-form-item>
                    </el-row>

                    <el-divider v-if="lastestPathologys && lastestPathologys.length > 0" content-position="left">
                        历史诊断
                    </el-divider>
                    <div v-for="(newPathology, j) in lastestPathologys" v-bind:key="'lastestPathologys' + j">
                        <div v-for="(item, index) in newPathology" v-bind:key="'lastestPathologysitem' + index">
                            <el-row v-if="index % 4 == 0" :style="index == 0 ? 'padding-top:20px' : ''">
                                <el-col :span="6">
                                    <!-- <el-form-item :label="item.keyDesc">
                                        <el-input v-if="item.valueType === 'input'" style="width:100%"
                                            :placeholder="item.keyDesc" v-model="item.value" :disabled="true"
                                            type="textarea" :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="item" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 1]">
                                    <!-- <el-form-item :label="newPathology[index + 1].keyDesc">
                                        <el-input v-if="newPathology[index + 1].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 1].keyDesc"
                                            v-model="newPathology[index + 1].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 1]" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 2]">
                                    <!-- <el-form-item :label="newPathology[index + 2].keyDesc">
                                        <el-input v-if="newPathology[index + 2].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 2].keyDesc"
                                            v-model="newPathology[index + 2].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 2]" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 3]">
                                    <!-- <el-form-item :label="newPathology[index + 3].keyDesc">
                                        <el-input v-if="newPathology[index + 3].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 3].keyDesc"
                                            v-model="newPathology[index + 3].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 3]" :disable="true"></velFormItem>
                                </el-col>
                            </el-row>
                        </div>
                        <el-divider></el-divider>
                    </div>
                    <el-row style="padding-top:20p">
                        <el-form-item label="添加诊断">
                            <el-select v-model="pathologyType" clearable placeholder="请选择">
                                <el-option v-for="item in pathologyTypeList" :key="item.dicKey" :label="item.keyDesc"
                                    :value="item.dicKey">
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="addPathologyData">添加</el-button>
                        </el-form-item>
                    </el-row>
                    <div v-for="(newPathology, j) in newPathologys" v-bind:key="j">
                        <div v-for="(item, index) in newPathology" v-bind:key="item.key">
                            <el-row v-if="index % 4 == 0" :style="index == 0 ? 'padding-top:20px' : ''">
                                <el-col :span="6">
                                    <velFormItem :item="item" :disable="false"></velFormItem>
                                    <!-- <el-form-item :label="item.keyDesc">
                                        <el-input v-if="item.valueType === 'input'" style="width:100%"
                                            :placeholder="item.keyDesc" v-model="item.value" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 1]">
                                    <!-- <el-form-item :label="newPathology[index + 1].keyDesc">
                                        <el-input v-if="newPathology[index + 1].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 1].keyDesc"
                                            v-model="newPathology[index + 1].value" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 1]" :disable="false"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 2]">
                                    <!-- <el-form-item :label="newPathology[index + 2].keyDesc">
                                        <el-input v-if="newPathology[index + 2].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 2].keyDesc"
                                            v-model="newPathology[index + 2].value" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 2]" :disable="false"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 3]">
                                    <!-- <el-form-item :label="newPathology[index + 3].keyDesc">
                                        <el-input v-if="newPathology[index + 3].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 3].keyDesc"
                                            v-model="newPathology[index + 3].value" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 3]" :disable="false"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="index + 4 >= newPathology.length"
                                    :offset="newPathology.length % 4 > 0 ? (3 - newPathology.length % 4) * 6 : 18">
                                    <div style="padding-left: 80%">
                                        <el-button type="danger" icon="el-icon-delete" circle
                                            @click="delNewPathology(j)">
                                        </el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <el-divider></el-divider>
                    </div>
                </el-form>
            </el-aside>
            <!-- ######################### 对比 #########################-->
            <el-main v-bind:style="{ width: compare_width + '%' }" v-if="compare">
                <el-form style="padding-left: 50px;" :inline="true" class="demo-form-inline">
                    <el-form-item label="就诊日期">
                        <el-select v-model="compareFrom.recordDate" placeholder="请选择" @change="onQueryHisRecord">
                            <el-option v-for="item in recordDates" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item style="padding-left: 10px;">
                        <el-button type="primary" @click="lastTime">上一次</el-button>
                        <el-button type="primary" @click="nextTime">下一次</el-button>
                    </el-form-item> -->
                </el-form>
                <el-form :model="compareFrom" label-position="right" label-width="80px" size="mini"
                    v-loading="compareFromReload">
                    <velChineseMedicine id="hisRecord" ref='hisRecord' :data="compareFrom" :leftBody="leftBodyCopy"
                        :rightBody="rightBodyCopy" :commonBody="commonBodyCopy" :mxOptions="mxOptions"
                        :intMedical="intMedicalCopy">
                    </velChineseMedicine>

                    <el-row>
                        <el-form-item label="六经诊断">
                        </el-form-item>
                    </el-row>
                    <div v-for="(item, index) in compareFrom.diagnosisList" v-bind:key="item.key">
                        <el-row v-if="index % 4 == 0">
                            <el-form-item label="">
                                <el-col :span="6">
                                    <el-input placeholder="六经诊断" v-model="item.value" type="textarea"
                                        :autosize="{ minRows: 1 }"></el-input>
                                </el-col>
                                <el-col :span="6" v-if="compareFrom.diagnosisList[index + 1]">
                                    <el-input placeholder="六经诊断" v-model="compareFrom.diagnosisList[index + 1].value"
                                        type="textarea" :autosize="{ minRows: 1 }">
                                    </el-input>
                                </el-col>
                                <el-col :span="6" v-if="compareFrom.diagnosisList[index + 2]">
                                    <el-input placeholder="六经诊断" v-model="compareFrom.diagnosisList[index + 2].value"
                                        type="textarea" :autosize="{ minRows: 1 }">
                                    </el-input>
                                </el-col>
                                <el-col :span="6" v-if="compareFrom.diagnosisList[index + 3]">
                                    <el-input placeholder="六经诊断" v-model="compareFrom.diagnosisList[index + 3].value"
                                        type="textarea" :autosize="{ minRows: 1 }">
                                    </el-input>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </div>

                    <el-row style="padding-top:20px">
                        <el-form-item label="药方">
                            <el-input type="textarea" placeholder="请输入药方" v-model="compareFrom.prescription"
                                :autosize="{ minRows: 1 }">
                            </el-input>
                        </el-form-item>
                    </el-row>
                    <el-divider v-if="lastestPathologysCopy && lastestPathologysCopy.length > 0" content-position="left">
                        历史诊断
                    </el-divider>
                    <div v-for="(newPathology, j) in lastestPathologysCopy" v-bind:key="'lastestPathologysCopy' + j">
                        <div v-for="(item, index) in newPathology" v-bind:key="'lastestPathologysCopyitem' + index">
                            <el-row v-if="index % 4 == 0" :style="index == 0 ? 'padding-top:20px' : ''">
                                <el-col :span="6">
                                    <!-- <el-form-item :label="item.keyDesc">
                                        <el-input v-if="item.valueType === 'input'" style="width:100%"
                                            :placeholder="item.keyDesc" v-model="item.value" :disabled="true"
                                            type="textarea" :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="item" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 1]">
                                    <!-- <el-form-item :label="newPathology[index + 1].keyDesc">
                                        <el-input v-if="newPathology[index + 1].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 1].keyDesc"
                                            v-model="newPathology[index + 1].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 1]" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 2]">
                                    <!-- <el-form-item :label="newPathology[index + 2].keyDesc">
                                        <el-input v-if="newPathology[index + 2].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 2].keyDesc"
                                            v-model="newPathology[index + 2].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 2]" :disable="true"></velFormItem>
                                </el-col>
                                <el-col :span="6" v-if="newPathology[index + 3]">
                                    <!-- <el-form-item :label="newPathology[index + 3].keyDesc">
                                        <el-input v-if="newPathology[index + 3].valueType === 'input'"
                                            style="width:100%" :placeholder="newPathology[index + 3].keyDesc"
                                            v-model="newPathology[index + 3].value" :disabled="true" type="textarea"
                                            :autosize="{ minRows: 1 }">
                                        </el-input>
                                    </el-form-item> -->
                                    <velFormItem :item="newPathology[index + 3]" :disable="true"></velFormItem>
                                </el-col>
                            </el-row>
                        </div>
                        <el-divider></el-divider>
                    </div>
                </el-form>
            </el-main>

            <!-- ######################### 新建候诊人 #########################-->
            <el-dialog title="候诊人" :visible.sync="dialogFormVisible">
                <el-form :model="newPatinetForm">
                    <el-form-item label="姓名">
                        <el-input v-model="newPatinetForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="newPatinetForm.gender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="newPatinetForm.age" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="病床号">
                        <el-input v-model="newPatinetForm.sickbedNo" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="住院号">
                        <el-input v-model="newPatinetForm.hospitalNo" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onNewPatient">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </el-card>
</template>

<script>

import velChineseMedicine from "@/components/common/vel_chinese_medicine";
import velFormItem from "@/components/common/vel_form_item";
import api from "@/config/api";
import attrApi from "@/config/attr_api";
import { STATUS_CODE } from "@/config/constant"
export default {
    name: "patientView",
    components: { velChineseMedicine,velFormItem },
    data() {
        return {
            queryFrom: {
                pid: '',
                name: '',
                recordDate: new Date(),
                lastrecordDate: '',
            },
            todayFrom: {
                pid: '',
                prescription: '',
                // diagnosisList: [], // 六经
            },
            patients: [],
            compareFrom: {},
            compare: false,
            dialogFormVisible: false,
            compareFromReload: false,
            todayFromReload: false,
            leftBody: [],
            rightBody: [],
            commonBody: [],
            intMedical: [],
            lastestPathologys: [],//历史诊断记录
            lastestPathologysCopy: [],//对比历史诊断记录
            leftBodyCopy: [],
            rightBodyCopy: [],
            commonBodyCopy: [],
            intMedicalCopy: [], //内科诊断
            mxOptions: [],
            liujingOptions: [],
            diagnosisList: [], // 六经
            diagnosisListCopy: [],
            compare_width: 0,
            daily_width: 100,
            recordDates: [], //历史诊断时间
            pathologyType: '', // 肿瘤
            pathologyTypeList: [], //新增诊断类型
            newPathologys: [], // 新增诊断数据
            newPatinetForm: {
                pid: '',
                name: '',
                gender: 1,
                age: '',
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
        }
    },
    mounted: function () {
        console.log('门诊 mounted....')

    },
    created: function () {
        console.log('门诊 created...')
        this.getLeftBodyList()
        this.getRightBodyList()
        this.getCommonBodyList()
        this.getIntMedicalList()
        this.getPathologyTypeList()
        this.getMXattrList()
        this.getLiuJingList()
    },
    methods: {
        onNewPatient() {
            let that = this;
            if(that.newPatinetForm.name == ''){
                that.$message.error('姓名不能为空');
                return
            }
            if(that.newPatinetForm.age == ''){
                that.$message.error('年龄不能为空');
                return
            }
            api.createPatient(this.newPatinetForm).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.queryFrom.pid = res.data
                    console.log('createPatient', that.queryFrom.pid)
                    that.queryFrom.name = that.newPatinetForm.name
                    that.queryFrom.age = that.newPatinetForm.age
                    that.dialogFormVisible = false
                } else {
                    that.$message.error('新建失败:' + res.message);
                }
            })
        },
        queryName(name) {
            let that = this;
            console.log('queryName', name)
            if (name == '') {
                return
            }
            api.queryPatientByName(name).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.patients = res.data
                } else {
                    that.$message.error('查询姓名失败:' + res.message);
                }
            })
        },
        onQuery(pid) {
            console.log('onQuery', pid)
            let that = this;
            this.queryFrom.pid = pid
            that.queryFrom.lastrecordDate = ''
            that.recordDates = []
            if (this.compare) {
                this.onCompare()
            }
            this.todayFromReload = true
            api.queryPatientPid(this.queryFrom.pid).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    if (res.data.patient) {
                        if (res.data.recordDates && res.data.recordDates.length > 0) {
                            that.queryFrom.lastrecordDate = res.data.recordDates[0]
                            that.recordDates = res.data.recordDates
                        }
                        if (res.data.lastestData) {
                            console.log('res.data.lastestData', res.data.lastestData)
                            let mxMap = res.data.lastestData.mxList
                            that.diagnosisList = res.data.lastestData.diagnosis
                            console.log('diagnosisList', that.diagnosisList)
                            that.todayFrom.prescription = res.data.lastestData.prescription
                            that.$refs.todayRecord.setMxValue(mxMap);
                            if (res.data.lastestData.pathologyList && that.intMedical[0].dicIndex == res.data.lastestData.pathologyList[0][0].dicIndex) {
                                // first is 内科诊断
                                let intMedicalList = res.data.lastestData.pathologyList.splice(0, 1)
                                console.log("intMedicalList", intMedicalList[0])
                                let intMedicalDateMap = {}
                                intMedicalList[0].forEach(element => {
                                    intMedicalDateMap[element.dicKey] = element.value
                                });
                                console.log("intMedicalDateMap", intMedicalDateMap)
                                that.intMedical.forEach(e => {
                                    if (intMedicalDateMap[e.dicKey]) {
                                        e.value = intMedicalDateMap[e.dicKey]
                                    }
                                })
                                that.lastestPathologys = res.data.lastestData.pathologyList
                            }
                        }
                    } else {
                        that.$message({
                            message: '未找到该编号',
                            type: 'error'
                        });
                    }
                } else {
                    that.$message.error('查询失败:' + res.message);
                }
                this.todayFromReload = false
            })
        },
        onQueryHisRecord() {
            let that = this;
            this.compareFromReload = true
            api.queryPatientByPidWithLastRecord(this.queryFrom.pid, this.compareFrom.recordDate).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    if (res.data) {
                        that.compareFrom.diagnosisList = res.data.diagnosis
                        that.compareFrom.prescription = res.data.prescription
                        that.$refs.hisRecord.setMxValue(res.data.mxList);

                        if (res.data.pathologyList && that.intMedicalCopy[0].dicIndex == res.data.pathologyList[0][0].dicIndex) {
                            // first is 内科诊断
                            let intMedicalList = res.data.pathologyList.splice(0, 1)
                            console.log("intMedicalCopy", intMedicalList[0])
                            let intMedicalDateMap = {}
                            intMedicalList[0].forEach(element => {
                                intMedicalDateMap[element.dicKey] = element.value
                            });
                            console.log("intMedicalDateMap", intMedicalDateMap)
                            that.intMedicalCopy.forEach(e => {
                                if (intMedicalDateMap[e.dicKey]) {
                                    e.value = intMedicalDateMap[e.dicKey]
                                }
                            })
                        }
                        that.lastestPathologysCopy = res.data.pathologyList

                    } else {
                        that.$message({
                            message: '未找到记录',
                            type: 'error'
                        });
                    }
                } else {
                    that.$message.error('查询失败:' + res.message);
                }
                that.compareFromReload = false
            })
        },
        onSubmit() {
            if (!this.queryFrom.pid || this.queryFrom.pid == '') {
                this.$message.error('请重新选择候诊人');
                return
            }
            console.log('onSubmit queryFrom.pid', this.queryFrom.pid)
            console.log('onSubmit data', this.newPathologys)

            let mxList = []
            this.leftBody.forEach(e => {
                if (e.value) {
                    mxList.push({
                        dicIndex: e.dicIndex,
                        dicKey: e.dicKey,
                        valueDicIndex: e.valueDicIndex,
                        value: e.value
                    })
                }
            });
            this.rightBody.forEach(e => {
                if (e.value) {
                    mxList.push({
                        dicIndex: e.dicIndex,
                        dicKey: e.dicKey,
                        valueDicIndex: e.valueDicIndex,
                        value: e.value
                    })
                }
            });
            this.commonBody.forEach(e => {
                if (e.value) {
                    mxList.push({
                        dicIndex: e.dicIndex,
                        dicKey: e.dicKey,
                        valueDicIndex: e.valueDicIndex,
                        value: e.value
                    })
                }
            });

            let pathologyMap = {}
            let tmp = []
            this.intMedical.forEach(e => {
                if (e.value) {
                    tmp.push({
                        dicIndex: e.dicIndex,
                        dicKey: e.dicKey,
                        valueDicIndex: e.valueDicIndex,
                        value: e.value
                    })
                }
            });
            pathologyMap[this.intMedical[0].dicIndex] = tmp

            console.log("newPathologys", this.newPathologys)

            this.newPathologys.forEach(element => {
                let tmp = []
                element.forEach(e => {
                    if (e.value) {
                        tmp.push({
                            dicIndex: e.dicIndex,
                            dicKey: e.dicKey,
                            valueDicIndex: e.valueDicIndex,
                            value: e.value
                        })
                    }
                });
                pathologyMap[element.type] = tmp
            });
            console.log('pathologyMap', pathologyMap)

            api.submitDailyRecord({
                pid: this.queryFrom.pid,
                recordDate: this.queryFrom.recordDate,
                mxList,
                diagnosis: this.diagnosisList,
                prescription: this.todayFrom.prescription,
                pathologyMap
            }).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                } else {
                    this.$message.error('保存失败:' + res.message);
                }
            })
        },
        onCompare() {
            if (this.compare) {
                this.compare = false
                this.compare_width = 0
                this.daily_width = 100
            } else {
                if (this.recordDates.length == 0) {
                    this.$message.error('没有历史诊断记录');
                    return
                }
                this.compare = true
                this.compare_width = 50
                this.daily_width = 50
            }
        },
        lastTime() {

        },
        nextTime() {

        },
        getLeftBodyList() {
            let that = this;
            attrApi.getLeftBodyList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.leftBody = res.data
                    that.leftBodyCopy = JSON.parse(JSON.stringify(res.data))
                }
            })
        },
        getRightBodyList() {
            let that = this;
            attrApi.getRightBodyList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.rightBody = res.data
                    that.rightBodyCopy = JSON.parse(JSON.stringify(res.data))
                }
            })
        },
        getCommonBodyList() {
            let that = this;
            attrApi.getCommonBodyList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.commonBody = res.data
                    that.commonBodyCopy = JSON.parse(JSON.stringify(res.data))
                }
            })
        },
        getIntMedicalList() {
            let that = this;
            attrApi.getIntMedicalList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.intMedical = res.data
                    that.intMedicalCopy = JSON.parse(JSON.stringify(res.data))
                }
            })
        },
        getPathologyTypeList() {
            let that = this;
            attrApi.getPathologyTypeList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.pathologyTypeList = res.data
                }
            })
        },
        addDiagnosisRow() {
            console.log("len:", this.diagnosisList.length)
            this.diagnosisList.push({ dicIndex: this.liujingOptions[0].dicIndex, dicKey: this.diagnosisList.length, value: "" })
        },
        getMXattrList() {
            let that = this;
            attrApi.getMXoptionList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.mxOptions = res.data
                }
            })
        },
        getLiuJingList() {
            let that = this;
            attrApi.getLiuJingList().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.liujingOptions = res.data
                }
            })
        },
        queryLiujingSearch(queryString, cb) {
            var results = queryString ? this.liujingOptions.filter(this.createLiujingFilter(queryString)) : this.liujingOptions;
            cb(results);
        },
        createLiujingFilter(queryString) {
            return (op) => {
                return (op.keyDesc.indexOf(queryString) != -1);
            };
        },
        handleLiujingSelect(item, index) {
            console.log('handleLiujingSelect', item, index)
            this.diagnosisList[index].dicKey = item.dicKey
        },
        addPathologyData() {
            let that = this;
            let pathology = this.pathologyTypeList[this.pathologyType - 1]
            if (pathology && pathology.valueDicIndex != '') {
                attrApi.getDicDataList(pathology.valueDicIndex).then((res) => {
                    if (res.statusCode === STATUS_CODE.SUCCESS) {
                        res.data.type = pathology.valueDicIndex
                        that.newPathologys.push(res.data)
                    }
                })
            }
        },
        delNewPathology(index) {
            console.log('delNewPathology', index)
            this.newPathologys.splice(index, 1);
        },
        cancalReadOnly(onOff) {
            this.$nextTick(() => {
                if (!onOff) {
                    const Selects = this.$refs
                    console.log('cancalReadOnly queryNameSelect', Selects.queryNameSelect)
                    // 如果只有1个下拉框，这段就足够了---start
                    if (Selects.queryNameSelect) {
                        const input = Selects.queryNameSelect.$el.querySelector('.el-input__inner')
                        input.removeAttribute('readonly')

                        console.log('cancalReadOnly remove readonly')
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
/deep/.el-button {
    font-size: 16px;
}

/deep/textarea::placeholder {
    color: #96c7fb;
    font-size: 16px;
}

/deep/input::-moz-input-placeholder {
    color: #96c7fb;
    font-size: 14px;
}

/deep/input::-ms-input-placeholder {
    color: #96c7fb;
    font-size: 14px;
}

/deep/input::-webkit-input-placeholder {
    color: #96c7fb;
    font-size: 14px;
}

/deep/.el-form-item {
    /* margin-bottom: 20px; */
}

/deep/.el-input {
    font-size: 18px;
}

/deep/.el-form-item__label {
    font-size: 16px;
}

/deep/.el-input__inner {
    height: 42px;
}

/deep/.el-textarea__inner {
    /* min-height: 32px;
    height: 32px; */
    font-size: 20px;
}
</style>
