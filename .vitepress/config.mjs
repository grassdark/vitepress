import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ]
      },
      {
        text: 'stm32',
        collapsed: true,
        items: [
          {
            text: 'h750vb',
              items: [
                { text: 'get_started', link: 'stm32/h750vb/get_started' },
                { text: 'gpio', link: 'stm32/h750vb/gpio' }
              ]
          }
        ]
      },
      {
        text: 'markdown',
        collapsed: true, 
        items: [
          { text: 'cheatsheet', link: 'markdown/cheatsheet' }
        ]
      },
      {
        text: 'git', 
        collapsed: true,
        items: [
          { text: 'cheatsheet', link: 'git/cheatsheet' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
