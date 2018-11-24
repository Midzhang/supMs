<template>
  <div class="user-add">
    <!-- 引入头部 -->
    <Header></Header>
    <!-- 主体 -->
    <el-main>
      <el-card class="box-card">
        <!-- 面板标题 -->
        <div slot="header" class="clearfix ">
          <span>添加管理员账号</span>
        </div>
        <!-- 面板内容 -->
        <div class="text item">

          <el-form :model="addUserForm" status-icon :rules="addUserRules" ref="addUserForm" label-width="100px" class="demo-ruleForm">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="addUserForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
              <el-input type="text" v-model="addUserForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item label="确认密码" prop="checkPwd">
              <el-input type="text" v-model="addUserForm.checkPwd"></el-input>
            </el-form-item>

            <el-form-item label="选择用户组" prop="usergroup">
              <el-select v-model="addUserForm.usergroup" placeholder="请选择用户组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通用户" value="普通用户"></el-option>
              </el-select>
            </el-form-item>

            <!-- 添加按钮  -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('addUserForm')">提交</el-button>
              <el-button @click="resetForm('addUserForm')">重置</el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-card>
    </el-main>
    <!-- 引入尾部 -->
    <Footer></Footer>
  </div>
</template>


<script>
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
// 引入qs 库
import qs from 'qs'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    //自定义一个验证密码一致的函数
    const confirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUserForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      addUserForm: {
        username: "",
        password: "",
        checkPwd: "",
        usergroup: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }, // 非空验证
          {
            min: 3,
            max: 9,
            message: "长度必须 3 到 9 个字符",
            trigger: "blur"
          } //长度验证
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }, // 非空验证
          {
            min: 3,
            max: 11,
            message: "长度必须 3 到 11 个字符",
            trigger: "blur"
          } //长度验证
        ],
        checkPwd: [{ required: true, validator: confirmPwd, trigger: "blur" }],
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
   //表单提交触发的函数
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          //获取用户输入的新增账号数据，用一个参数对象保存
            let params = {
              username :this.addUserForm.username,
              password :this.addUserForm.password,
              usergroup :this.addUserForm.usergroup,
            }
            //发送ajax 请求 把数据发送给后端
            this.axios.post('http://127.0.0.1:3000/users/adduser',
            //参数处理
             qs.stringify(params),
             //设置请求头
             {"header":{'Content-Type':'applicaton/x-www-form-urlencoded'}
             })
             .then(response=>{
               if(response.data.rstCode === 1){
                 this.$message({
                   type:'success',
                   message:response.data.msg
                 })
                 // 成功跳转到账号管理列表页面
                 this.$router.push('/usermanage')
               } else{
                 //失败弹出失败信息
                 this.$message.error(response.data.msg)
               }
             })
          } else {
         this.$message.error('前端验证不能通过，不能发送哟');
            return false;
          }
        });
      },
    // 重置表单触发的函数
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="less">
.user-add {
  width: 100%;
  display: flex; // 让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; // 方向是 纵向
  // 主体
  .el-main {
    flex: 1; // 自动增长 撑满
    .el-card {
      .el-card__header {
        font-weight: 700;
        font-size: 15px;
        background-color: #f1f1f1;
      }
      .el-card__body {
        .item {
          .el-form {
            width: 300px;
            .el-form-item {
              .el-form-item__label {
                height: 35px;
                line-height: 35px;
              }
              .el-form-item__content {
                height: 35px;
                line-height: 35px;
                .el-input__inner {
                  height: 35px;
                  line-height: 35px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>


