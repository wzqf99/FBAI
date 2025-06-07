<template>
    <div class="user-center">
        <div class="user-header">
            <div class="user-card">
                <div class="avatar-container">
                    <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
                    <div class="edit-avatar" @click="handleAvatarClick">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                    </div>
                </div>
                <div class="user-info">
                    <h2>{{ userInfo.name }}</h2>
                    <p class="bio">{{ userInfo.bio }}</p>
                    <div class="info-items">
                        <div class="info-item">
                            <el-icon>
                                <Message />
                            </el-icon>
                            <span>{{ userInfo.email }}</span>
                        </div>
                        <div class="info-item">
                            <el-icon>
                                <Location />
                            </el-icon>
                            <span>{{ userInfo.location }}</span>
                        </div>
                        <div class="info-item">
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            <span>{{ userInfo.joinDate }} 加入</span>
                        </div>
                    </div>
                </div>
            </div>
            <el-button type="primary" class="edit-profile" @click="openEditDialog">编辑资料</el-button>
        </div>

        <div class="tabs-container">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="个人资料" name="profile">
                    <div class="profile-content">
                        <div class="section">
                            <h3 class="section-title">基本信息</h3>
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="用户名">{{ userInfo.name }}</el-descriptions-item>
                                <el-descriptions-item label="性别">{{ userInfo.gender }}</el-descriptions-item>
                                <el-descriptions-item label="生日">{{ userInfo.birthday }}</el-descriptions-item>
                                <el-descriptions-item label="地区">{{ userInfo.location }}</el-descriptions-item>
                                <el-descriptions-item label="个人简介">{{ userInfo.bio }}</el-descriptions-item>
                            </el-descriptions>
                        </div>

                        <div class="section">
                            <h3 class="section-title">联系方式</h3>
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="电子邮箱">{{ userInfo.email }}</el-descriptions-item>
                                <el-descriptions-item label="手机号码">{{ userInfo.phone }}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="安全设置" name="security">
                    <!-- 安全设置内容保持不变 -->
                    <div class="security-content">
                        <el-card class="security-card">
                            <template #header>
                                <div class="security-header">
                                    <span>账号密码</span>
                                    <el-tag type="success" size="small" effect="dark">已设置</el-tag>
                                </div>
                            </template>
                            <div class="security-body">
                                <div class="security-info">
                                    <p>定期修改密码可以大幅提高账号安全</p>
                                    <p class="text-secondary">上次修改时间：2025-03-15</p>
                                </div>
                                <el-button type="primary" plain>修改密码</el-button>
                            </div>
                        </el-card>

                        <el-card class="security-card">
                            <template #header>
                                <div class="security-header">
                                    <span>手机验证</span>
                                    <el-tag type="success" size="small" effect="dark">已绑定</el-tag>
                                </div>
                            </template>
                            <div class="security-body">
                                <div class="security-info">
                                    <p>已绑定手机：{{ maskPhone(userInfo.phone) }}</p>
                                    <p class="text-secondary">绑定手机可以用于登录、找回密码等操作</p>
                                </div>
                                <el-button type="primary" plain>修改绑定</el-button>
                            </div>
                        </el-card>

                        <el-card class="security-card">
                            <template #header>
                                <div class="security-header">
                                    <span>邮箱验证</span>
                                    <el-tag type="success" size="small" effect="dark">已绑定</el-tag>
                                </div>
                            </template>
                            <div class="security-body">
                                <div class="security-info">
                                    <p>已绑定邮箱：{{ maskEmail(userInfo.email) }}</p>
                                    <p class="text-secondary">绑定邮箱可以用于接收消息通知</p>
                                </div>
                                <el-button type="primary" plain>修改绑定</el-button>
                            </div>
                        </el-card>

                        <el-card class="security-card">
                            <template #header>
                                <div class="security-header">
                                    <span>登录记录</span>
                                </div>
                            </template>
                            <div class="login-records">
                                <el-timeline>
                                    <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                        :type="activity.type" :timestamp="activity.timestamp">
                                        <div class="login-record-content">
                                            <div>
                                                <el-icon>
                                                    <Monitor />
                                                </el-icon>
                                                <span>{{ activity.device }}</span>
                                            </div>
                                            <div>
                                                <el-icon>
                                                    <Location />
                                                </el-icon>
                                                <span>{{ activity.location }}</span>
                                            </div>
                                        </div>
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="通知设置" name="notifications">
                    <!-- 通知设置内容保持不变 -->
                    <div class="notification-content">
                        <h3 class="section-title">通知设置</h3>
                        <el-card class="notification-card">
                            <div class="notification-item">
                                <div class="notification-info">
                                    <h4>系统通知</h4>
                                    <p>重要的系统更新、产品功能变更等通知</p>
                                </div>
                                <el-switch v-model="notificationSettings.system" active-color="#4D6BFE" />
                            </div>
                            <el-divider />

                            <div class="notification-item">
                                <div class="notification-info">
                                    <h4>互动通知</h4>
                                    <p>当有人点赞、评论、关注时接收通知</p>
                                </div>
                                <el-switch v-model="notificationSettings.interaction" active-color="#4D6BFE" />
                            </div>
                            <el-divider />

                            <div class="notification-item">
                                <div class="notification-info">
                                    <h4>文章推荐</h4>
                                    <p>根据您的兴趣推荐相关文章和话题</p>
                                </div>
                                <el-switch v-model="notificationSettings.recommendations" active-color="#4D6BFE" />
                            </div>
                            <el-divider />

                            <div class="notification-item">
                                <div class="notification-info">
                                    <h4>营销信息</h4>
                                    <p>促销活动、新功能预告等营销信息</p>
                                </div>
                                <el-switch v-model="notificationSettings.marketing" active-color="#4D6BFE" />
                            </div>
                        </el-card>

                        <div class="notification-actions">
                            <el-button type="primary">保存设置</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 编辑资料弹窗 -->
        <el-dialog v-model="dialogVisible" title="编辑个人资料" width="500px" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
                <div class="avatar-upload">
                    <el-avatar :size="100" :src="editForm.avatar"></el-avatar>
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false"
                        :on-change="handleAvatarChange">
                        <el-button type="primary" plain>更换头像</el-button>
                    </el-upload>
                </div>

                <el-form-item label="用户名" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="editForm.gender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                        <el-radio label="保密">保密</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="生日" prop="birthday">
                    <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"></el-date-picker>
                </el-form-item>

                <el-form-item label="地区" prop="location">
                    <el-input v-model="editForm.location" placeholder="请输入地区"></el-input>
                </el-form-item>

                <el-form-item label="个人简介" prop="bio">
                    <el-input v-model="editForm.bio" type="textarea" :rows="3" placeholder="请输入个人简介" maxlength="200"
                        show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="editForm.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="editForm.email" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">保存</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 头像裁剪弹窗 -->
        <el-dialog v-model="cropperVisible" title="裁剪头像" width="500px" :close-on-click-modal="false">
            <div class="cropper-container">
                <!-- 这里可以集成图片裁剪组件，如vue-cropper等 -->
                <div class="cropper-preview">
                    <img :src="cropperImage" alt="头像预览" v-if="cropperImage" />
                    <div class="empty-preview" v-else>请选择图片</div>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cropperVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmCrop">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
    EditPen, Message, Location, Calendar,
    Monitor, Bell, PhoneFilled, Lock
} from '@element-plus/icons-vue';

const activeTab = ref('profile');
const dialogVisible = ref(false);
const cropperVisible = ref(false);
const editFormRef = ref(null);
const cropperImage = ref('');

// 用户信息数据
const userInfo = reactive({
    name: '用户3',
    gender: '男',
    birthday: '2002-08-15',
    bio: '热爱创作与分享，专注于技术与生活的探索者',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    email: '1557522967@qq.com',
    phone: '',
    location: '安阳市',
    joinDate: '2023-10-05'
});

// 编辑表单数据
const editForm = reactive({
    name: '',
    gender: '',
    birthday: '',
    bio: '',
    avatar: '',
    email: '',
    phone: '',
    location: ''
});

// 编辑表单验证规则
const editRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
};

// 登录记录
const activities = [
    {
        type: 'primary',
        timestamp: '2025-05-10 08:12:33',
        device: 'Chrome浏览器 (Windows)',
        location: '上海市'
    },
    {
        type: 'success',
        timestamp: '2025-05-08 19:45:21',
        device: 'Safari浏览器 (iPhone)',
        location: '北京市'
    },
    {
        type: 'info',
        timestamp: '2025-05-05 13:28:04',
        device: 'Chrome浏览器 (MacOS)',
        location: '上海市'
    },
    {
        type: 'warning',
        timestamp: '2025-04-30 22:15:39',
        device: 'Firefox浏览器 (Windows)',
        location: '杭州市'
    }
];

// 通知设置
const notificationSettings = reactive({
    system: true,
    interaction: true,
    recommendations: true,
    marketing: false
});

// 隐藏手机号中间部分
const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 隐藏邮箱中间部分
const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    return `${username.substring(0, 2)}***@${domain}`;
};

// 打开编辑弹窗
const openEditDialog = () => {
    // 拷贝当前用户信息到编辑表单
    Object.keys(editForm).forEach(key => {
        if (key in userInfo) {
            editForm[key] = userInfo[key];
        }
    });
    dialogVisible.value = true;
};

// 点击头像编辑按钮
const handleAvatarClick = () => {
    cropperVisible.value = true;
};

// 头像文件变更
const handleAvatarChange = (file) => {
    const isImage = file.raw.type.indexOf('image/') !== -1;
    if (!isImage) {
        ElMessage.error('只能上传图片文件!');
        return false;
    }

    // 显示图片裁剪弹窗
    const reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = (e) => {
        cropperImage.value = e.target.result;
        cropperVisible.value = true;
    };
};

// 确认裁剪头像
const confirmCrop = () => {
    // 这里应该是裁剪组件处理后的图片
    // 在实际应用中，您可能需要将裁剪后的图片上传到服务器
    editForm.avatar = cropperImage.value;
    cropperVisible.value = false;

    ElMessage.success('头像更新成功');
};

// 提交表单
const submitForm = () => {
    if (!editFormRef.value) return;

    editFormRef.value.validate((valid) => {
        if (valid) {
            // 更新用户信息
            Object.keys(editForm).forEach(key => {
                if (key in userInfo) {
                    userInfo[key] = editForm[key];
                }
            });

            dialogVisible.value = false;
            ElMessage.success('个人资料更新成功');
        } else {
            ElMessage.error('请正确填写表单内容');
            return false;
        }
    });
};
</script>

<style lang="less" scoped>
.user-center {
    padding: 24px;

    .user-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 24px;

        .user-card {
            display: flex;
            align-items: center;

            .avatar-container {
                position: relative;
                margin-right: 24px;

                .edit-avatar {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 32px;
                    height: 32px;
                    background-color: #f5f7fa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: 2px solid #fff;

                    &:hover {
                        background-color: #ebeef5;
                    }
                }
            }

            .user-info {
                h2 {
                    margin: 0 0 8px;
                    font-size: 24px;
                }

                .bio {
                    color: #606266;
                    margin: 0 0 16px;
                }

                .info-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;

                    .info-item {
                        display: flex;
                        align-items: center;
                        color: #909399;

                        .el-icon {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }

        .edit-profile {
            background-color: #4D6BFE;
            border-color: #4D6BFE;
        }
    }

    .tabs-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        padding: 24px;

        .section {
            margin-bottom: 32px;

            .section-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 16px;
                position: relative;
                padding-left: 12px;

                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 16px;
                    width: 4px;
                    background-color: #4D6BFE;
                    border-radius: 2px;
                }
            }
        }

        .security-content {
            .security-card {
                margin-bottom: 16px;

                .security-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                }

                .security-body {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .security-info {
                        flex: 1;

                        p {
                            margin: 0 0 8px;

                            &.text-secondary {
                                color: #909399;
                                font-size: 12px;
                            }
                        }
                    }
                }
            }

            .login-records {
                .login-record-content {
                    display: flex;
                    gap: 24px;

                    div {
                        display: flex;
                        align-items: center;

                        .el-icon {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }

        .notification-content {
            .notification-card {
                margin-bottom: 24px;

                .notification-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 0;

                    .notification-info {
                        h4 {
                            margin: 0 0 8px;
                            font-size: 16px;
                        }

                        p {
                            margin: 0;
                            color: #909399;
                            font-size: 14px;
                        }
                    }
                }
            }

            .notification-actions {
                display: flex;
                justify-content: center;
            }
        }
    }

    // 编辑头像上传样式
    .avatar-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;

        .el-avatar {
            margin-bottom: 16px;
        }
    }

    // 裁剪容器样式
    .cropper-container {
        display: flex;
        flex-direction: column;
        align-items: center;

        .cropper-preview {
            width: 300px;
            height: 300px;
            border: 1px dashed #d9d9d9;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            img {
                max-width: 100%;
                max-height: 100%;
            }

            .empty-preview {
                color: #909399;
            }
        }
    }
}
</style>