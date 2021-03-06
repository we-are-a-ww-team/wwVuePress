
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
		keyPage: {
		  keys: ['e23b0ff3bedc1e823b1ad8e63dfb83c4'], // 1.3.0 版本后需要设置为密文
		  color: '#42b983', // 登录页动画球的颜色
		  lineColor: '#42b983' // 登录页动画线的颜色
		},
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
				{ text: '设计模式', link: '/designerPattern/uml' },
				{ text: '数据库', link: '/database/mysql' },
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
			  { text: '运维相关', link: '/linux/linux' },
			  { text: '项目构建', link: '/buildProject/' },
			  { text: '开发工具', link: '/developTools/idea' },
			  { text: 'Go语言', link: '/go/go' },
			  { text: 'python语言', link: '/python/python' },
			  { text: '面试', link: '/interview/' },
			  { text: '区块链', link: '/blockchain/' },
            ]
		  },
		   
        ],
		sidebarDepth: 2,
		sidebar: {
			'/blockchain/':[
				'blockchain'
			],
			'/regex/':[
				'regex'
			],'/vue/':[
				''
			],
			'/jquery/':[
				''
			],
			'/designerPattern/':[
				'uml',
				'pattern_singerton',
				'pattern_factory',
				'pattern_build',
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
				'vm',
				'docker',
				'k8s',
				'k8s2',
			],
			'/spring/':[
				'spring',
				'import',
				'springAOP',
				'springMVC'
			],'/springboot/':[
				'springboot',
				'springboot_webflux',
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
				'hashmap',
				'log'
			],'/database/':[
				'mysql',
				'mysql2',
				'oracle',
				'mongodb',
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
			],'/interview/':[
				'interview',
				'interview2'
			],'/server/':[
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


