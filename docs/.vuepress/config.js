
module.exports = {
    title: 'Hello World',
    description: 'Hello, my friend!',
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }]
    ],
    dest: './docs/.vuepress/dist',
	base:'/docs/',
    ga: '',
    evergreen: true,
	themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
		  { text: '前端技术', 
			items: [
              { text: 'Vue', link: '/vue/' }
            ]
		  },
          {
            text: '后端技术',
            items: [
				{ text: 'spring', link: '/spring/' },
				{ text: 'springboot', link: '/spring/springboot' },
				{ text: 'springcloud', link: '/spring/springcloud' },
				{ text: 'springcloud alibaba', link: '/spring/springcloudalibaba' },
				{ text: '中间件', link: '/middleware/' },
				{ text: '分布式锁', link: '/middleware/' },
				{ text: '分布式事务', link: '/middleware/' }
            ]
          },
		  { text: '其他',  items: [
			  { text: '开发工具', link: '/developTools/idea' },
			  { text: '项目构建', link: '/buildProject/' },
			  { text: 'Linux相关', link: '/linux/linux' },
			  { text: 'Docker容器', link: '/docker/docker' },
			  { text: 'go语言', link: '/go/' },
            ]
		  }
        ],
		sidebarDepth: 2,
		sidebar: {
			'/vue/':[
				''
			],
			'/docker/':[
				'docker',
				'docker-redis',
				'docker-jenkins',
				'docker-mysql'
			
			],
			'/developTools/':[
				'idea'
			],
			'/middleware/':[
				'',
				'redis',
				'rocketmq',
				'elasticsearch',
				'mongodb',
				'kafka'
			],
			'/buildProject/':[
				'',
				'git',
				'maven',
				'gradle',
				'jenkins'
			],
			'/linux/':[
				'linux',
				'nginx',
				'vm'
			],
			'/spring/':[
				'',
				'spring',
				'springboot',
				'springcloud',
				'springcloudalibaba'
			],'/go/':[
				'',
				'go'
			]
		}
    }
}


