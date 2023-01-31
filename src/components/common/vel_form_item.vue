<template>
    <el-form-item :label="item.keyDesc">
        <el-input v-if="item.valueType === 'input'" style="width:100%" :placeholder="item.keyDesc" v-model="item.value"
            @input="wallpaperInput" type="textarea" :autosize="{ minRows: 1 }" :disabled="disable">
        </el-input>
        <el-select v-if="item.valueType === 'select'" style="width:100%" v-model="item.value" placeholder="请选择"
            @change="wapperChange" :disabled="disable">
            <el-option v-for="op in item.options" :key="op.dicKey" :label="op.keyDesc" :value="op.dicKey">
            </el-option>
        </el-select>
        <el-select v-if="item.valueType === 'multiple'" multiple style="width:100%" v-model="item.value"
            placeholder="请选择" @change="wapperChange" :disabled="disable">
            <el-option v-for="op in item.options" :key="op.dicKey" :label="op.keyDesc" :value="op.dicKey">
            </el-option>
        </el-select>
    </el-form-item>
</template>

<script>
export default {
    name: "vel_form_item",
    props: ['item', 'disable'],
    // data() {
    //     return {
    //         value:''
    //     }
    // },
    methods: {
        wallpaperInput(value) {
            console.log("vel_form_item wapperChange:", value)
            this.$forceUpdate()
        },
        wapperChange(value) {
            console.log("vel_form_item wapperChange:", value)
            this.$forceUpdate()
        },
    }
}


</script>


