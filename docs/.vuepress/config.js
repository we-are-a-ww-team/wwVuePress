
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
				{ text: 'Java基础', link: '/java/java' },
				{ text: 'Spring', link: '/spring/' },
				{ text: 'Springboot', link: '/spring/springboot' },
				{ text: 'Springcloud', link: '/spring/springcloud' },
				{ text: 'Springcloud alibaba', link: '/spring/springcloudalibaba' },
				{ text: '中间件', link: '/middleware/' },
				{ text: '分布式锁', link: '/middleware/' },
				{ text: '分布式事务', link: '/middleware/' },
				{ text: 'Mybatis', link: '/go/mybatis' },
            ]
          },
		  { text: '功能实现',  items: [
			  { text: '手写系列', link: '/handwriting/' },
			  { text: '接口加密解密', link: '/encrypt/' },
			  { text: '单点登录', link: '/sso/' },
			]
		  },
		  { text: '其他',  items: [
			  { text: 'Linux相关', link: '/linux/linux' },
			  { text: 'Docker容器', link: '/docker/docker' },
			  { text: '数据库', link: '/mysql/mysql' },
			  { text: '开发工具', link: '/developTools/idea' },
			  { text: '项目构建', link: '/buildProject/' },
			  { text: 'Go语言', link: '/go/go' },
			  
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
				'go'
			],'/java/':[
				'java',
				'thread',
				'lock'
			],'/mysql/':[
				'mysql'
			],'/mybatis/':[
				'mybatis'
			],'/handwriting/':[
				''
			],'/sso/':[
				''
			],'/encrypt/':[
				''
			]
		}
    }
}


