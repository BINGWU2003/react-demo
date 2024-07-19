const routes = [
  {
      path: '/',
      name: 'index',
      title: '首页',
      redirect:'/form',
      component: () => import('@/views/login.vue'), //.vue不能省略
      children:[ // 嵌套子路由
          {
              path:'form', // 子页面1
              component:() => import('@/views/login/form.vue'),
          },
          {
              path:'company', // 子页面2
              component:() => import('@/views/login/company.vue'),
          },
          {
              path:'print', // 子页面2
              component:() => import('@/views/login/print.vue'),
          },
      ]
  }
]
export default routes