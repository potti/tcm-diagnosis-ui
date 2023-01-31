<template>
    <el-card v-if="refresh" class="box-card" shadow="never"
        :body-style="{ padding: '15px', minHeight: 'calc(100vh - 152px)' }">
        <el-form style="padding-left: 12px;" :inline="true" class="demo-form-inline">
            <el-form-item label="字典类别">
                <el-select style="width:100%" v-model="selectDicType" clearable placeholder="字典类别"
                    @change="onDicTypeChange">
                    <el-option v-for="op in dicType" :key="op.dicIndex" :label="op.dicName" :value="op.dicIndex">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onNewDic">新增字典</el-button>
            </el-form-item>

        </el-form>
        <el-table :data="dicData" stripe style="width: 100%">
            <el-table-column fixed type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column fixed prop="dicName" label="类别" width="150">
                <template slot-scope="scope">
                    <!-- <div v-if="scope.row.id">{{ scope.row.dicName }}</div> -->
                    <!-- <el-input v-if="!scope.row.id" v-model="scope.row.dicName" placeholder="请输入类别" @input="onInputType">
                    </el-input> -->
                    <el-input v-model="scope.row.dicName" placeholder="请输入类别" @input="onInputType">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="dicKey" label="索引" width="230">
                <template slot-scope="scope">
                    <!-- <div v-if="scope.row.id">{{ scope.row.dicKey }}</div> -->
                    <!-- <el-input v-if="!scope.row.id" v-model="scope.row.dicKey" placeholder="请输入索引,不填则自动生成">
                    </el-input> -->
                    <el-input v-model="scope.row.dicKey" placeholder="请输入索引,不填则自动生成" @input="onInputModify">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="keyDesc" label="描述" width="200">
                <template slot-scope="scope">
                    <!-- <div v-if="scope.row.id">{{ scope.row.keyDesc }}</div>
                    <el-input v-if="!scope.row.id" v-model="scope.row.keyDesc" placeholder="请输入描述">
                    </el-input> -->
                    <el-input v-model="scope.row.keyDesc" placeholder="请输入描述" @input="onInputModify">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="valueType" width="200">
                <template slot="header" slot-scope="scope">
                    <el-checkbox v-model="valueTypeCheck" @change="onValueTypeCheck(scope.$index)">统一类型</el-checkbox>
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.valueType" placeholder="请选择" @change="onValueTypeChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="valueDicIndex" label="值范围" width="250">
                <template slot-scope="scope">
                    <div v-if="scope.row.valueType == 'select' || scope.row.valueType == 'multiple'">
                        <el-select v-model="scope.row.valueDicIndex" clearable placeholder="请选择"
                            @change="onValueDicIndexChange">
                            <el-option v-for="op in dicType" :key="op.dicIndex" :label="op.dicName"
                                :value="op.dicIndex">
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleInset(scope.$index, scope.row)">插入</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-pagination style="padding-left: 70%;" background layout="prev, pager, next" :total="50">
        </el-pagination> -->
        <el-button v-if="isModified" type="primary" @click="onSubmit">提交</el-button>


    </el-card>
</template>

<script>
import attrApi from "@/config/attr_api";
import { STATUS_CODE } from "@/config/constant"
export default {
    name: "dicView",
    components: {},
    data() {
        return {
            valueTypeCheck: true,
            selectDicType: '',
            isModified: false,
            dicType: [],
            dicData: [],
            delIds: [],
            options: [{
                value: '',
                label: '无'
            }, {
                value: 'input',
                label: '输入框'
            }, {
                value: 'select',
                label: '下拉框'
            }, {
                value: 'multiple',
                label: '多选框'
            }],
        }
    },
    mounted() {
        console.log('dicView mounted...')
        this.getDicTypeList()
    },
    methods: {
        getDicTypeList() {
            let that = this;
            attrApi.getDicType().then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.dicType = res.data
                }
            })
        },
        onDicTypeChange(item) {
            let that = this;
            attrApi.getDicDataList(item).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    that.isModified = false
                    that.dicData = res.data
                    that.selectDicType = that.dicData[0].dicIndex
                    that.delIds = []
                    let lastValueType = that.dicData[0].valueType
                    let lastValueIndex = that.dicData[0].valueDicIndex
                    let isSame = true
                    that.dicData.forEach(element => {
                        if (lastValueType != element.valueType || lastValueIndex != element.valueDicIndex) {
                            isSame = false
                        }
                    });
                    that.valueTypeCheck = isSame
                }
            })
        },
        onNewDic() {
            this.dicData = []
            this.delIds = []
            this.dicData.push(this.newDic())
            this.isModified = true
            this.valueTypeCheck = true
        },
        onSubmit() {
            let that = this;
            console.log(this.delIds)
            attrApi.saveOrUpdateDicList({
                delIds: this.delIds,
                dicList: this.dicData
            }).then((res) => {
                if (res.statusCode === STATUS_CODE.SUCCESS) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    that.getDicTypeList()
                    that.isModified = false
                    that.dicData = res.data
                    that.delIds = []
                } else {
                    this.$message.error('保存失败:' + res.message);
                }
            })
        },
        handleDelete(index, row) {
            this.dicData.splice(index, 1);
            this.isModified = true
            if (row.id) {
                this.delIds.push(row.id)
            }
        },
        handleInset(index) {
            this.dicData.splice(index + 1, 0, this.newDic());
            this.isModified = true
        },
        newDic() {
            return {
                dicIndex: this.dicData.length > 0 ? this.dicData[0].dicIndex : null,
                dicName: this.dicData.length > 0 ? this.dicData[0].dicName : '',
                dicKey: '',
                keyDesc: '',
                valueDicIndex: this.dicData.length > 0 ? this.dicData[0].valueDicIndex : '',
                valueType: this.dicData.length > 0 ? this.dicData[0].valueType : '',
            }
        },
        onInputType(value) {
            this.isModified = true
            this.dicData.forEach(element => {
                element.dicName = value
            });
        },
        onValueTypeChange(value) {
            this.isModified = true
            if (this.valueTypeCheck) {
                this.dicData.forEach(element => {
                    element.valueType = value
                });
            }
        },
        onValueDicIndexChange(value) {
            this.isModified = true
            if (this.valueTypeCheck) {
                this.dicData.forEach(element => {
                    element.valueDicIndex = value
                });
            }
        },
        onInputModify() {
            this.isModified = true
        },
        onValueTypeCheck(e) {
            console.log('onValueTypeCheck', e)
        }
    }
}
</script>

<style scoped>
</style>
