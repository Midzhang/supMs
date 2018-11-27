<template>
  <div class="user-add">
    <!-- 引入头部 -->
    <Header></Header>
    <!-- 主体 -->
    <el-main>
      <el-card class="box-card">
        <!-- 面板标题 -->
        <div slot="header" class="clearfix ">
          <span>密码修改</span>
        </div>
        <!-- 面板内容 -->
        <div class="text item">

          <el-form :model="editPwdForm" status-icon :rules="rules" ref="editPwdForm" label-width="100px" class="demo-ruleForm">
            <!-- 用户名 -->
            <el-form-item label="旧密码" prop="oldPwd">
              <el-input type="text" v-model="editPwdForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="新密码" prop="newPwd">
              <el-input type="text" v-model="editPwdForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item label="确认新密码" prop="confirmPwd">
              <el-input type="text" v-model="editPwdForm.confirmPwd"></el-input>
            </el-form-item>

            <!-- 添加按钮  -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('editPwdForm')">提交</el-button>
              <el-button @click="resetForm('editPwdForm')">重置</el-button>
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
import qs from "qs";

export default {
  components: {
    Header,
    Footer
  },
  data() {
    //自定义一个验证密码一致的函数
    const checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPwdForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    //自定义旧密码验证规则
    const checkOldPwd = (rule, value, callback) => {
      this.axios
        .get(`http://127.0.0.1:3000/users/checkoldpwd?oldPwd=${value}`)
        .then(response => {
          if (response.data.rstCode === 1) {
            callback();
          } else if (response.data.rstCode === 0) {
            //否则旧密码不正确
            callback(new Error(response.data.msg));
          }
        });
    };
    return {
      editPwdForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        oldPwd: [
          { required: true, validator: checkOldPwd, trigger: "blur" }, // 非空验证
        ],
        newPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" }, // 非空验证
          {
            min: 3,
            max: 11,
            message: "长度必须 3 到 11 个字符",
            trigger: "blur"
          } //长度验证
        ],
        confirmPwd: [{ required: true, validator: checkPwd, trigger: "blur" }],
  
      }
    };
  },
  methods: {
    //表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获取用户输入的新增账号数据，用一个参数对象保存

          //发送ajax 请求 把数据发送给后端
          this.axios
            .get(
              `http://127.0.0.1:3000/users/savenewpwd?newPwd=${
                this.editPwdForm.newPwd
              }`
            )
            .then(response => {
              if (response.data.rstCode === 1) {
                this.$message({
                  type: "success",
                  message: response.data.msg
                });
                setTimeout(() => {
                  this.$router.push("/login");
                }, 1000);
              } else {
                //失败弹出失败信息
                this.$message.error(response.data.msg);
              }
            });
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


