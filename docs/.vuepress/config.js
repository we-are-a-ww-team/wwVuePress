
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
	base:'/',
    ga: '',
    evergreen: true,
	plugins: ["vuepress-plugin-@vuepress/plugin-blog"],
	theme: 'reco',
	themeConfig: {
		author: 'wwei',
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
				{ text: 'Springboot', link: '/springboot/springboot' },
				{ text: 'Springcloud', link: '/springcloud/springcloud' },
				{ text: 'Springcloud alibaba', link: '/springcloudalibaba/springcloudalibaba' },
				{ text: '中间件', link: '/middleware/' },
				{ text: '分布式锁', link: '/distributedLock/distributedLock' },
				{ text: '分布式事务', link: '/distributedTransaction/distributedTransaction' },
				{ text: 'Mybatis', link: '/mybatis/mybatis' },
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
			  { text: '正则表达式', link: '/regex/regex' },
			  { text: 'Go语言', link: '/go/go' },
			  { text: 'python语言', link: '/python/python' },
			  
            ]
		  },
		   
        ],
		sidebarDepth: 2,
		sidebar: {
			'/regex/':[
				'regex'
			],'/vue/':[
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
				'kafka',
				'zookeeper',
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
				'import',
				'springAOP',
				'springMVC'
			],'/springboot/':[
				'springboot'
			],'/springcloud/':[
				'springcloud'
			],'/springcloudalibaba/':[
				'springcloudalibaba',
				'nocos',
				'sentinel',
				'seata'
			],'/go/':[
				'go'
			],'/java/':[
				'java',
				'jvm',
				'thread',
				'jdk8',
				'io',
				'tomcat',
				'rpc',
				'hashmap'
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
		},
		blogConfig: {
		  category: {
			location: 2,     // 在导航栏菜单中所占的位置，默认2
			text: 'Category' // 默认文案 “分类”
		  },
		  tag: {
			location: 3,     // 在导航栏菜单中所占的位置，默认3
			text: 'Tag'      // 默认文案 “标签”
		  }
		}
    }
}


