<template>
    <el-card v-if="refresh" class="box-card" shadow="never"
        :body-style="{ padding: '15px', minHeight: 'calc(100vh - 152px)' }">
        欢迎 {{ this.user.userName }}

    </el-card>
</template>

<script>
import cookieUtil from "../../utils/cookieUtil";
import { USER_NAME } from "../../config/constant";
export default {
    name: "vel_welcomeView",
    components: {},
    data() {
        return {
            user: {},
        }
    },
    mounted() {
        this.user.userName = cookieUtil.get(USER_NAME)
    },
}
</script>

<style scoped>
</style>
