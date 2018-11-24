// 引入Vue
import Vue from 'vue'
// 引入路由
import Router from 'vue-router'

// 引入需要配置路由的组件 
// 登录组件
import Login from '@/views/Login/Login.vue'
// 后端首页
import Index from '@/views/Index/Index.vue'
// Home组件
import Home from '@/views/Home/Home.vue'

//用户管理功能模块相关组件
//添加用户
import UserAdd from '@/views/UserAdd/UserAdd.vue'
//用户管理
import UserManage from '@/views/UserManage/UserManage.vue'
//修改密码
import EditPassword from '@/views/EditPassword/EditPassword.vue'

//商品管理模块相关组件
//添加商品
import GoodsAdd from '@/views/GoodsAdd/GoodsAdd.vue'
//商品管理
import GoodsManage from '@/views/GoodsManage/GoodsManage.vue'

//销售统计报表
import SalesCharts from '@/views/SalesCharts/SalesCharts.vue'
// 注册路由
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },

    {
      path: '/',
      component: Index,
      // 子路由
      children: [
        // 默认子组件
        {
          name: 'home',
          path: '',
          component: Home
        },
        //添加账户
        {
          name:'useradd',
          path:'/useradd',
          component:UserAdd
        },
         //用户管理
        {
          name:'usermanage',
          path:'/usermanage',
          component:UserManage
        },
         //修改密码
        {
          name:'editpassword',
          path:'/editpassword',
          component:EditPassword
        },
        //添加商品
        {
          name:'goodsadd',
          path:'/goodsadd',
          component:GoodsAdd
        },
        //商品管理
        {
          name:'goodsmanage',
          path:'/goodsmanage',
          component:GoodsManage
        },
        //销售统计报表
        {
          name:'salescharts',
          path:'/salescharts',
          component:SalesCharts
        },
      ]
    }
  ]
})
