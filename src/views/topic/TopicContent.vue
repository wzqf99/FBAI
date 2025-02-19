<template>
    <div class="topic">
        <h2>topic</h2>
        <el-button @click="pushtoCreation">跳转创作页</el-button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const pushtoCreation = () => {
    router.push('/articleCreation')
}
</script>

<style lang="less" scoped></style>