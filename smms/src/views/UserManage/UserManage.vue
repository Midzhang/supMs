<template>
  <div class="user-manage">
    <!-- 头部 -->
    <Header></Header>
    <!-- 主体 -->
    <el-main>
      <el-card class="box-card">
        <!-- 面板标题 -->
        <div slot="header" class="clearfix">
          <span>账号管理</span>
        </div>
        <!-- 面板内容 -->
        <div class="text item">
          <!-- 账号管理列表 -->
          <el-table ref="userlist" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <!-- 选择框 -->
            <el-table-column type="selection">
            </el-table-column>
            <!-- 用户名称 -->
            <el-table-column prop="username" label="用户名称">
            </el-table-column>
            <!-- 用户组别 -->
            <el-table-column prop="usergroup" label="用户组">
            </el-table-column>

            <!-- 日期 -->
            <el-table-column label="日期">
              <template slot-scope="scope">{{ scope.row.cdate | formatCdate }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                  <i class="el-icon-edit"></i>修改</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                  <i class="el-icon-delete"></i>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 修改弹出的模态框 -->
          <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="40%">
            <!-- 修改用户表单 -->
            <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
              <!-- 账号 -->
              <el-form-item label="账号" prop="username">
                <el-input type="text" v-model="editForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item label="密码" prop="password">
                <el-input type="text" v-model="editForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 用户组 -->
              <el-form-item label="选择用户组" prop="usergroup">
                <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                  <el-option label="普通用户" value="普通用户"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 分页组件 -->
          <div style="margin-top: 20px">

            <el-pagination 
            @size-change="handleSizeChange"
             @current-change="handleCurrentChange" 
             :current-page="currentPage" 
             :page-sizes="[1, 4, 8, 12, 16, 20, 24]" 
             :page-size="pageSize" 
             layout="total, sizes, prev, pager, next, jumper" 
             :total="totalCount">
            </el-pagination>
          </div>

          <!-- 选择按钮 -->
          <div style="margin-top: 20px">
            <el-button type="danger" @click="batchDel">批量删除</el-button>
            <el-button @click="toggleSelection">取消选择</el-button>
          </div>
        </div>

      </el-card>
    </el-main>
    <!-- 尾部 -->
    <Footer></Footer>
  </div>
</template>
<script>
// 引入moment 事件格式化插件
import moment from "moment";
// 引入qs模块 用于处理post方式产参数
import qs from "qs";

// 引入头部组件 和 尾部组件
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
export default {
  // 注册组件
  components: {
    Header,
    Footer
  },
  data() {
    return {
      totalCount:11,
      currentPage: 1, //当前显示所在页数
      pageSize:4,//默认每页显示4条
      dialogFormVisible: false, // 控制修改模态框的显示和隐藏的变量
      tableData: [],
      seletedUser: [],
      editId: "", // 保存要修改的数据的id
      editForm: {
        username: "",
        password: "",
        usergroup: ""
      },
      rules: {
        // 验证用户名
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证用户组
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" } // 非空验证
        ]
      }
    };
  },
  methods: {
    // 编辑触发函数
    handleEdit(id) {
      // 把要修改的id 保存到一个变量里面
      this.editId = id;

      // 发送一个ajax 把需要修改的数据的id发送给后端
      this.axios
        .get(`http://127.0.0.1:3000/users/edituser?id=${id}`)
        .then(response => {
          // 一一对应 把数据回填到模态框里面
          this.editForm.username = response.data[0].username;
          this.editForm.password = response.data[0].password;
          this.editForm.usergroup = response.data[0].usergroup;

          // 回填号数据以后 再弹出模态框
          this.dialogFormVisible = true;
        });
    },

    // 删除触发的函数
    handleDelete(id) {
      // 发送一个请求 把id发送给后端
      this.axios
        .get(`http://127.0.0.1:3000/users/deluser?id=${id}`)
        .then(response => {
          // 根据后端响应的数据判断
          if (response.data.rstCode === 1) {
            // 弹出删除成功的提示
            this.$message({
              type: "success",
              message: response.data.msg
            });

            // 重新请求一下所有账号数据（刚才已经把数据删除了 所有再次请求就是只有删除后的数据）
            this.getUserListByPage();
          } else {
            this.$message.error(response.data.msg);
          }
        });
    },

    // 取消选择的函数
    toggleSelection() {
      // 取消选择
      this.$refs.userlist.clearSelection();
    },

    // 当选择状态改变 触发这个函数
    handleSelectionChange(val) {
      // 把选中的数据 保存到一个变量里面
      this.seletedUser = val;
    },

    // // 批量删除函数
    batchDel() {
      // 把需要批量删除的数据的id 取出来
      let idArr = this.seletedUser.map(v => v.id);

      // 判断 如果没有选中任何数据 那么就弹出请选择以后再操作 直接返回
      if (!idArr.length) {
        this.$message.error("请选择以后再操作!");
        return;
      }

      // 收集参数
      let param = {
        idArr: JSON.stringify(idArr) // 把数组转为字符串
      };

      // 发送一个ajax请求 把这个id数组（里面是需要批量删除的数据的id）发送给后端
      this.axios
        .post(
          "http://127.0.0.1:3000/users/batchdel",
          qs.stringify(param), // 处理参数
          { Header: { "Content-Type": "application/x-www-form-urlencoded" } } // 设置请求头
        )
        .then(response => {
          // 接收后端响应的数据 根据结果判断
          if (response.data.rstCode === 1) {
            // 成功 弹出批量删除成功的提示
            this.$message({
              type: "success",
              message: response.data.msg
            });

            // 刷新页面（重新获取一下最新数据）
            this.getUserListByPage();
          } else {
            // 失败 弹出错误信息
            this.$message.error(response.data.msg);
          }
        });
    },

    //封装一个请求所有用户账号数据的函数
    // getUserList() {
    //   // 发送ajax请求 获取所有数据
    //   this.axios.get("http://127.0.0.1:3000/users/userlist").
    //   then(response => {
    //     // 直接把请求到的所用用户账号的数据 赋值给 tableData 渲染用户账号列表
    //     this.tableData = response.data;
    //   });
    // },

    // 分页功能实现
    getUserListByPage() {
      // 当前显示页数
       let currentPage = this.currentPage;
      // 默认每页显示几条
       let pageSize = this.pageSize;
   
      // 发送ajax请求 获取所有数据
      this.axios.get
      (`http://127.0.0.1:3000/users/userlistbypage?currentPage=${currentPage}&pageSize=${pageSize}`)
      .then(response => {
        // 直接把请求到的所用用户账号的数据 赋值给 tableData 渲染用户账号列表
        this.tableData = response.data.data;
    
        this.totalCount = response.data.totalCount;
      
          // 如果当前页码 没有数据 且 不是第一页
          if (!response.data.data.length && this.currentPage !== 1) {
            // 当前页码减去 1 
            this.currentPage -= 1;
            console.log(  this.currentPage)
            // 再次调用自己
            this.getUserListByPage();
          }
      });
    },

    // 表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集修改后的新数据 和 一个原来的id
          let params = {
            username: this.editForm.username,
            password: this.editForm.password,
            usergroup: this.editForm.usergroup,
            editId: this.editId
          };

          // 发送ajax 把修改后的新数据 和 原来的id 一起发送给后端
          this.axios
            .post(
              "http://127.0.0.1:3000/users/saveedit",
              qs.stringify(params),
              {
                Header: { "Content-Type": "application/x-www-form-urlencoded" }
              }
            )
            .then(response => {
              // 根据后端响应的数据判断
              if (response.data.rstCode === 1) {
                // 成功 弹出修改成功的提示
                this.$message({
                  type: "success",
                  message: response.data.msg
                });
                // 重新调用一下获取数据的方法（刷新一遍页面 获取最新数据）
                this.getUserListByPage();
              } else {
                this.$message.error(response.data.msg);
              }
            });

          // 关闭模态框
          this.dialogFormVisible = false;
        } else {
          console.log("前端验证不通过, 不能发送");
          return false;
        }
      });
    },

   // 页面尺寸 改变就触发就是函数
    handleSizeChange(val) {
       this.pageSize = val;
     this.getUserListByPage();
      },

     //当页码改变 就触发这个函数
    handleCurrentChange(val) {
       // 重置当前页码 
         this.currentPage = val;

        this.getUserListByPage();
      }
  },

  // 生命周期钩子函数(vue实例创建完成 但是还没有挂载dom 适合请求数据) 只要进入组件 组件就会经历这个周期 会自动触发这个函数
  created() {
    // 调用请求所有数据的函数
    this.getUserListByPage();
  },
  // 过滤器
  filters: {
    // 过滤器
    formatCdate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
<style lang="less">
.user-manage {
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
        }
      }
    }
  }
}
</style>
