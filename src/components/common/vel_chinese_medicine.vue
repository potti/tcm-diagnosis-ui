<template>
    <div v-loading="reload">
        <div v-for="(item, index) in intMedical" v-bind:key="item.key">
            <el-row v-if="index == 0">
                <el-col :span="24">
                    <el-form-item :label="item.keyDesc">
                        <el-input v-if="item.valueType === 'input'" style="width:100%" :placeholder="item.keyDesc"
                            v-model="item.value" @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="item.valueType === 'select'" style="width:100%" v-model="item.value"
                            placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in item.options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="index == 1">
                <el-col :span="24">
                    <el-form-item :label="item.keyDesc">
                        <el-input max v-if="item.valueType === 'input'" style="width:100%" :placeholder="item.keyDesc"
                            v-model="item.value" @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="index >= 2 && (index-2) % 4 == 0">
                <el-col :span="6">
                    <el-form-item :label="item.keyDesc">
                        <el-input max v-if="item.valueType === 'input'" style="width:100%" :placeholder="item.keyDesc"
                            v-model="item.value" @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="intMedical[index + 1]">
                    <el-form-item :label="intMedical[index + 1].keyDesc">
                        <el-input max v-if="intMedical[index + 1].valueType === 'input'" style="width:100%"
                            :placeholder="intMedical[index + 1].keyDesc" v-model="intMedical[index + 1].value"
                            @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="intMedical[index + 1].valueType === 'select'" style="width:100%"
                            v-model="intMedical[index + 1].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in intMedical[index + 1].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="intMedical[index + 2]">
                    <el-form-item :label="intMedical[index + 2].keyDesc">
                        <el-input max v-if="intMedical[index + 2].valueType === 'input'" style="width:100%"
                            :placeholder="intMedical[index + 2].keyDesc" v-model="intMedical[index + 2].value"
                            @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="intMedical[index + 2].valueType === 'select'" style="width:100%"
                            v-model="intMedical[index + 2].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in intMedical[index + 2].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="intMedical[index + 3]">
                    <el-form-item :label="intMedical[index + 3].keyDesc">
                        <el-input max v-if="intMedical[index + 3].valueType === 'input'" style="width:100%"
                            :placeholder="intMedical[index + 3].keyDesc" v-model="intMedical[index + 3].value"
                            @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="intMedical[index + 3].valueType === 'select'" style="width:100%"
                            v-model="intMedical[index + 3].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in intMedical[index + 3].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div v-for="(item, index) in leftBody" v-bind:key="item.key">
            <el-row v-if="index % 2 == 0">
                <el-col :span="6">
                    <el-form-item :label="item.keyDesc">
                        <el-autocomplete class="inline-input" style="width:100%" v-model="item.value" valueKey="keyDesc"
                            :fetch-suggestions="querySearch" :placeholder="item.keyDesc" :trigger-on-focus="false"
                            @focus="handleFocus('leftBody', index)" @select="handleSelect" @input="wallpaperInput"
                            type="textarea" :autosize="{ minRows: 1 }" popper-class="c-options"
                            v-bind:id="id + 'leftBody' + index">
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="leftBody[index + 1]">
                    <el-form-item :label="leftBody[index + 1].keyDesc">
                        <el-autocomplete class="inline-input" style="width:100%" v-model="leftBody[index + 1].value"
                            :fetch-suggestions="querySearch" :placeholder="leftBody[index + 1].keyDesc"
                            valueKey="keyDesc" :trigger-on-focus="false" @focus="handleFocus('leftBody', index + 1)"
                            @select="handleSelect" @input="wallpaperInput" v-bind:id="id + 'leftBody' + (index + 1)"
                            type="textarea" :autosize="{ minRows: 1 }" popper-class="c-options">
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="rightBody[index]">
                    <el-form-item :label="rightBody[index].keyDesc">
                        <el-autocomplete class="inline-input" style="width:100%" v-model="rightBody[index].value"
                            :fetch-suggestions="querySearch" :placeholder="rightBody[index].keyDesc" valueKey="keyDesc"
                            :trigger-on-focus="false" @focus="handleFocus('rightBody', index)" @select="handleSelect"
                            @input="wallpaperInput" v-bind:id="id + 'rightBody' + (index)" type="textarea"
                            :autosize="{ minRows: 1 }" popper-class="c-options">
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="rightBody[index + 1]">
                    <el-form-item :label="rightBody[index + 1].keyDesc">
                        <el-autocomplete class="inline-input" style="width:100%" v-model="rightBody[index + 1].value"
                            :fetch-suggestions="querySearch" :placeholder="rightBody[index + 1].keyDesc"
                            valueKey="keyDesc" :trigger-on-focus="false" @focus="handleFocus('rightBody', index + 1)"
                            @select="handleSelect" @input="wallpaperInput" v-bind:id="id + 'rightBody' + (index + 1)"
                            type="textarea" :autosize="{ minRows: 1 }" popper-class="c-options">
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div v-for="(item, index) in commonBody" v-bind:key="item.key">
            <el-row v-if="index % 4 == 0">
                <el-col :span="6">
                    <el-form-item :label="item.keyDesc">
                        <el-input v-if="item.valueType === 'input'" style="width:100%" :placeholder="item.keyDesc"
                            v-model="item.value" type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="item.valueType === 'select'" style="width:100%" v-model="item.value"
                            placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in item.options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="commonBody[index+1]">
                    <el-form-item :label="commonBody[index + 1].keyDesc">
                        <el-input v-if="commonBody[index + 1].valueType === 'input'"
                            :placeholder="commonBody[index + 1].keyDesc" v-model="commonBody[index + 1].value"
                            type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="commonBody[index + 1].valueType === 'select'" style="width:100%"
                            v-model="commonBody[index + 1].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in commonBody[index + 1].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="commonBody[index+2]">
                    <el-form-item :label="commonBody[index + 2].keyDesc">
                        <el-input v-if="commonBody[index + 2].valueType === 'input'"
                            :placeholder="commonBody[index + 2].keyDesc" v-model="commonBody[index + 2].value"
                            type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="commonBody[index + 2].valueType === 'select'" style="width:100%"
                            v-model="commonBody[index + 2].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in commonBody[index + 2].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="commonBody[index+3]">
                    <el-form-item :label="commonBody[index + 3].keyDesc">
                        <el-input v-if="commonBody[index + 3].valueType === 'input'"
                            :placeholder="commonBody[index + 3].keyDesc" v-model="commonBody[index + 3].value"
                            type="textarea" :autosize="{ minRows: 1 }">
                        </el-input>
                        <el-select v-if="commonBody[index + 3].valueType === 'select'" style="width:100%"
                            v-model="commonBody[index + 3].value" placeholder="请选择" @change="wapperChange">
                            <el-option v-for="op in commonBody[index + 3].options" :key="op.dicKey" :label="op.keyDesc"
                                :value="op.dicKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>

    </div>

</template>

<script>

export default {
    name: "vel_chinese_medicine",
    props: {
        id: {
            type: String
        },
        data: {
            type: Object,
        },
        leftBody: {
            type: Array,
        },
        rightBody: {
            type: Array,
        },
        commonBody: {
            type: Array,
        },
        intMedical: {
            type: Array,
        },
        mxOptions: {
            type: Array,
        }

    },
    data() {
        return {
            tmpPart: '',
            tmpOpIndex: -1,
            tmpValue: '',
            tmpQueryStr: '',
            reload: false
        }
    },
    methods: {
        hasChinese(str) {
            console.log(str)
            var re = /.*[\u4e00-\u9fa5]+.*$/;
            if (re.test(str)) {
                return true;
            }
            return false;
        },
        fetchNumberFromString(str) {
            return str.match(/\d+/g)
        },
        querySearch(queryString, cb) {
            console.log('queryString', queryString, queryString.length, this.tmpValue)
            this.tmpValue = queryString
            let numbers = this.fetchNumberFromString(queryString)
            let hasChinese = isNaN(parseFloat(queryString[0]))
            let lastChinese = isNaN(parseFloat(queryString[queryString.length - 1]))
            console.log('queryString', queryString, numbers, "1stChinese:", hasChinese, 'lastChinese', lastChinese)
            if (lastChinese) {
                let start = 0
                for (let index = queryString.length - 1; index >= 0; index--) {
                    if (!isNaN(parseFloat(queryString[index]))) {
                        start = index + 1
                        break
                    }
                }
                let queryZh = queryString.substring(start)
                this.tmpQueryStr = queryZh
                var zhresults = this.mxOptions.filter(this.createZhFilter(queryZh))
                console.log('queryZh', queryZh, zhresults)
                cb(zhresults);
            } else if (numbers && numbers.length >= 1) {
                let lastNumber = String(numbers[numbers.length - 1])
                if (hasChinese) {
                    if (lastNumber.length > 1) {
                        let qs = lastNumber.slice(1)
                        this.tmpQueryStr = qs
                        var results = this.mxOptions.filter(this.createFilter(qs))
                        console.log('qs', qs, results)
                        cb(results);
                    } else {
                        cb([]);
                    }
                } else {
                    this.tmpQueryStr = lastNumber
                    var results1 = this.mxOptions.filter(this.createFilter(lastNumber))
                    console.log('qs', lastNumber, results1)
                    cb(results1);
                }
            } else {
                cb([]);
            }
        },
        createFilter(queryString) {
            return (op) => {
                return String(op.dicKey).startsWith(queryString, 0);
            };
        },
        createZhFilter(queryString) {
            return (op) => {
                return String(op.keyDesc).startsWith(queryString, 0);
            };
        },
        handleSelect(item) {
            this.tmpValue = this.tmpValue.substring(0, this.tmpValue.length - String(this.tmpQueryStr).length) + item.keyDesc
            console.log('afterSelect', this.id + this.tmpPart + this.tmpOpIndex, this.tmpValue);
            if (this.tmpPart == 'leftBody') {
                this.leftBody[this.tmpOpIndex].value = this.tmpValue
            } else {
                this.rightBody[this.tmpOpIndex].value = this.tmpValue
            }
            document.getElementById(this.id + this.tmpPart + this.tmpOpIndex).focus()
        },
        handleFocus(part, index) {
            if (this.tmpOpIndex != index || this.tmpPart != part) {
                this.tmpPart = part
                this.tmpOpIndex = index
                this.tmpValue = ''
                this.tmpQueryStr = ''
                if (this.tmpPart == 'leftBody') {
                    this.tmpValue = this.leftBody[this.tmpOpIndex].value
                } else {
                    this.tmpValue = this.rightBody[this.tmpOpIndex].value
                }
                console.log('handleFocus', part, index, this.tmpValue);
            }
        },
        wallpaperInput() {
            this.$forceUpdate()
        },
        wapperChange(value) {
            console.log("wapperChange:", value)
            this.$forceUpdate()
        },
        setMxValue(mxMap) {
            console.log("setMxValue...", mxMap)
            this.reload = true
            this.leftBody.forEach(element => {
                if (mxMap[element.dicIndex + '-' + element.dicKey]) {
                    element.value = mxMap[element.dicIndex + '-' + element.dicKey]
                } else {
                    element.value = ''
                }
            });

            this.rightBody.forEach(element => {
                if (mxMap[element.dicIndex + '-' + element.dicKey]) {
                    element.value = mxMap[element.dicIndex + '-' + element.dicKey]
                } else {
                    element.value = ''
                }
            });

            this.commonBody.forEach(element => {
                if (mxMap[element.dicIndex + '-' + element.dicKey]) {
                    element.options.forEach(op => {
                        if (op.dicKey == mxMap[element.dicIndex + '-' + element.dicKey]) {
                            console.log("set options:", element.dicIndex + '-' + element.dicKey, "value:", op.dicKey, "label:", op.keyDesc)
                            element.value = op.dicKey
                            return
                        }
                    });
                } else {
                    element.value = ''
                }
            });
            this.reload = false
        }
    },
    mounted() {
        console.log('vel_chinese_medicine mounted.. id:', this.id)
    }

}
</script>

<style scoped>

</style>
