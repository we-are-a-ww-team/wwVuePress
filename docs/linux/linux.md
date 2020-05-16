# Linux

## 文件操作

**ls用法**

```
ls -lrS  按大小反序显示文件详细信息
ls *    列出当前目录，子级目录下所有文件（不包含子级的子级）
```

**文件操作**

```
mkdir　　创建目录
touch　　创建一个空文件

rm		删除
	（rm -rf 强制遍历删除文件）
mv 		移动,重命名
cp 		复制
	（cp -r 	递归复制目录）
```

**文件查找**

```
find ./ -name nginx
find /etc -name　'init*'　　在/etc目录找init开头的文件
```

**文件压缩，解压**

```
打包命令： 	tar -zcvf test.tar.gz test 	将test文件夹压缩成test.tar.gz
解压命令：	tar -zxvf test.tar.gz 		将test.tar.gz 文件解压为test目录。

打包命令：	zip -r test.zip test 		将目录打包，生成test.zip文件
解压命令：	unzip test.zip 				解压为test目录
```

## 文本操作

**vi命令**

```
i	切换编辑模式
ESC 切换命令模式
:	切换底行命令模式
	(:wq!  强制保存  	:q!  强制退出)
	(:set nu 显示行号)
```

**文本查看**

```
tail -n 1000 aaa.log　　显示/etc/services文件最后1000行
tail -f　aaa.log　监视文件变化

less aaa.log (pageUp上一页，pageDown下一页)
-i  忽略搜索时的大小写
-N  显示每行的行号

/字符串：向下搜索“字符串”的功能
?字符串：向上搜索“字符串”的功能
n：重复前一个搜索（与 / 或 ? 有关）
N：反向重复前一个搜索（与 / 或 ? 有关）
[pagedown]： 向下翻动一页
[pageup]：   向上翻动一页
```



## 查看线程

```
ps -ef | grep nginx   查看进程
ps -aux
jps 	查看进程

netstat -natp  	查看网络端口

man 2 select  查看linux内核方法
```

## 查看容量

```
df -h 
查看系统容量占用

du -sh * 
查看当前目录文件夹的 容量占用情况
```



## 防火墙firewall

在centos7中firewall取代了iptables，在此之前则主要是通过iptables来控制。

```
1、查看firewall服务状态
systemctl status firewalld
出现Active: active (running)切高亮显示则表示是启动状态。
出现 Active: inactive (dead)灰色表示停止，看单词也行。

2、查看firewall的状态
firewall-cmd --state

3、开启、重启、关闭、firewalld.service服务
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop

4、查看防火墙规则
firewall-cmd --list-all

5、查询、开放、关闭端口
查看开放的端口：
firewall-cmd --list-port
# 开放80端口
firewall-cmd --permanent --add-port=80/tcp
# 移除端口
firewall-cmd --permanent --remove-port=8080/tcp

6、重启防火墙(修改配置后要重启防火墙)
firewall-cmd --reload

# 参数解释
1、firwall-cmd：是Linux提供的操作firewall的一个工具；
2、--permanent：表示设置为持久；
3、--add-port：标识添加的端口；
```