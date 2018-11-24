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

            <el-form-item label="用户名" prop="userName">
              <el-input type="text" v-model="addUserForm.userName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="passWord">
              <el-input type="text" v-model="addUserForm.passWord" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPwd">
              <el-input type="text" v-model="addUserForm.checkPwd"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('addUserForm')">提交</el-button>
              <el-button @click="resetForm('addUserForm')">重置</el-button>
            </el-form-item>

      

              <el-form-item label="选择用户组" prop="usergroup">
                <el-select v-model="addUserForm.usergroup" placeholder="请选择用户组">
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                  <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
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
export default {
  components: {
    Header,
    Footer
  },
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addUserForm.checkPass !== "") {
          this.$refs.addUserForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUserForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      addUserForm: {
        pass: "",
        checkPass: "",
        age: ""
      },
      addUserRules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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


