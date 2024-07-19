const routes = [
    {
        path: '/',
        name: 'index',
        title: '首页',
        redirect: '/print',
        component: () => import('@/views/index.vue'),
        children: [ // 嵌套子路由
            {
                path: 'login',
                component: () => import('@/views/index/login.vue'),
            },
            {
                path: 'company',
                component: () => import('@/views/index/company.vue'),
            },
            {
                path: 'print',
                component: () => import('@/views/index/print.vue'),
            },
        ]
    }
]
export default routes