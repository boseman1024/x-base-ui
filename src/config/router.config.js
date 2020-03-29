// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView, IframeView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '分析页', icon: 'warning', keepAlive: false}
      },

      // 异常页
      {
        path: '/exception',
        name: 'exception',
        hidden: true,
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning'},
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // 个人页
      {
        path: '/account',
        hidden: true,
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true},
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true}
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true},
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置' }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置' }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置'}
              }
            ]
          }
        ]
      },
      // 系统管理
      {
        path: '/system',
        component: PageView,
        meta: { title: '系统管理', icon: 'layout' },
        redirect: '/system/user-list',
        name: 'system',
        children: [
          {
            path: '/system/user-list',
            name: 'UserList',
            component: () => import('@/views/system/UserList'),
            meta: { title: '用户列表', keepAlive: true }
          },
          {
            path: '/system/dept-list',
            name: 'DeptList',
            component: () => import('@/views/system/DeptList'),
            meta: { title: '部门列表', keepAlive: true }
          },
          {
            path: '/system/role-list',
            name: 'RoleList',
            component: () => import('@/views/system/RoleList'),
            meta: { title: '角色列表', keepAlive: true }
          },
          {
            path: '/system/menu-list',
            name: 'MenuList',
            component: () => import('@/views/system/MenuList'),
            meta: { title: '资源列表', keepAlive: true }
          },
          {
            path: '/system/dict-list',
            name: 'DictList',
            component: () => import('@/views/system/DictList'),
            meta: { title: '字典列表', keepAlive: true }
          }
        ]
      },
      // 消息推送
      {
        path: '/message',
        component: PageView,
        meta: { title: '消息推送', icon: 'layout' },
        redirect: '/message/message-list',
        name: 'message',
        children: [
          {
            path: '/message/message-list',
            name: 'MessageList',
            component: ()=> import('@/views/message/Message'),
            meta: { title: '消息列表', keepAlive: true }
          },
          {
            path: '/message/send',
            name: 'MessageSend',
            component: ()=> import('@/views/message/Send'),
            meta: { title: '消息发布' }
          },
          {
            path: '/message/success',
            name: 'MessageSuccess',
            hidden: true,
            component: ()=> import('@/views/message/Success'),
            meta: { title: '操作成功' }
          }
        ]
      },
      // 工作流
      {
        path: '/workflow',
        component: PageView,
        meta: { title: '工作流', icon: 'layout' },
        redirect: '/workflow/process-definition',
        name: 'workflow',
        children: [
          {
            path: '/workflow/process-definition',
            name: 'ProcessDefinition',
            component: ()=> import('@/views/workflow/ProcessDefinition'),
            meta: { title: '流程管理', keepAlive: true }
          }
        ]
      },
      {
        path: '/admin',
        component: IframeView,
        meta: { title: '监控台', icon: 'layout', link:'/wallboard' },
        name: 'admin'
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
