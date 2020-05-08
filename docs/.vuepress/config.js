
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
              { text: 'Vue', link: '/vue/' },
			  { text: 'Jquery', link: '/jquery/' }
            ]
		  },
          {
            text: '后端技术',
            items: [
				{ text: 'Java基础', link: '/java/java' },
				{ text: 'Spring', link: '/spring/spring' },
				{ text: 'Springboot', link: '/spring/springboot' },
				{ text: 'Springcloud', link: '/spring/springcloud' },
				{ text: 'Springcloud alibaba', link: '/spring/springcloudalibaba' },
				{ text: '中间件', link: '/middleware/' },
				{ text: '分布式锁', link: '/distributedLock/distributedLock' },
				{ text: '分布式事务', link: '/distributedTransaction/distributedTransaction' },
				{ text: 'Mybatis', link: '/mybatis/mybatis' },
				{ text: 'Netty', link: '/netty/netty' },
				{ text: '设计模式', link: '/designerPattern/designerPattern' },
            ]
          },
		  { text: '功能实现',  items: [
			  { text: '手写系列', link: '/handwriting/' },
			  { text: '源码系列', link: '/sourceCode/' },  
			  { text: '接口加密解密', link: '/encrypt/' },
			  { text: '单点登录', link: '/sso/' },
			  { text: '动态数据源', link: '/dynamicDBSource/' },
			  { text: '服务器推送技术', link: '/server2client/server2client' },
			  { text: '定时任务', link: '/schedule/' },
			  { text: '辅助类', link: '/util/' },
			]
		  },
		  { text: '其他',  items: [
			  { text: 'Linux相关', link: '/linux/linux' },
			  { text: 'Docker容器', link: '/docker/docker' },
			  { text: '数据库', link: '/database/mysql' },
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
			'/jquery/':[
				''
			],
			'/docker/':[
				'docker',
				'k8s'
			],
			'/developTools/':[
				'idea'
			],
			'/middleware/':[
				'',
				'redis',
				'rocketmq',
				'elasticsearch',
				'shardingjdbc',
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
				'spring',
				'springboot',
				'springcloud',
				'springcloudalibaba'
			],'/go/':[
				'go'
			],'/java/':[
				'java',
				'jvm',
				'thread',
				'jdk8',
				'io',
				'tomcat',
				'rpc'
			],'/database/':[
				'mysql',
				'oracle',
				'mongodb'
			],'/mybatis/':[
				'mybatis'
			],'/handwriting/':[
				''
			],'/sso/':[
				''
			],'/encrypt/':[
				''
			],'/distributedLock/':[
				'distributedLock'
			],'/distributedTransaction/':[
				'distributedTransaction'
			],'/server2client/':[
				'server2client'
			],'/sourceCode/':[
				''
			]
		}
    }
}


