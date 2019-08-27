
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/app/A/:room', component: () => import('pages/LiveAppA.vue') },
      { path: '/app/B/:room', component: () => import('pages/LiveApp.vue') },
      { path: '/control/:design/:room', component: () => import('pages/LiveControl.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
