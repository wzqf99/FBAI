<template>
    <div>
        <div class="tabs">
            <div :class="{ active: index === currentIndex }" class=" tab" @click="handleCheck(index)"
                v-for="(item, index) in tabs" :key="item.id">{{
                    item.name }}
            </div>
            <transition>
                <div :style="`top:1px; left:${currentIndex * (400 / 3)}px;`" class="slider"></div>
            </transition>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    currentIndex: {
        type: Number,
        required: true,
    },
})
const emit = defineEmits(['updateIdx'])

const handleCheck = (index) => {
    emit('updateIdx', index)
}
</script>

<style lang="less" scoped>
.tabs {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 400px;
    background-color: #F3F2F5;
    border-radius: 8px;
    box-shadow: 0 0 8px #ccc;

    .tab {
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        width: 33.3%;
        text-align: center;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            color: #409eff;
            font-weight: 500;
        }
    }

    .active {

        font-weight: 700;
    }

    .slider {
        font-weight: 700;
        position: absolute;
        text-align: center;
        line-height: 38px;
        border-radius: 8px;
        left: 0;
        top: 1px;
        height: 38px;
        width: (400/3) - 1px;
        background-color: #fff;
        opacity: 0.6;
        transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
}
</style>