# Git

```
#列出所有本地分支
git branch	
#查看日志
git log

```

免密提交代码

```
git config --global credential.helper store
```



```
# .git 文件夹就是 repo
git init
# tmp 目录下载远程仓库
git clone git@gitlab.dxy.net:runzhliu/git-sharing.git
# 切出工作分支/开发分支
git checkout -b dev_{邮箱地址}
git checkout -b dev_lrz@dxy.cn
# 增加文件
touch test
vim test
# 查看 Git 文件系统的情况
git status
# 提交到 git 索引
git add -A
# 提交到 repo，并撰写 commit message
git commit
# 查看提交记录
git log
# 修改文件内容
vim test
# 再次提交到 git 索引并且提交到 repo
git add -A
git commit
# 推向远程
git push -u orgin dev_{邮箱地址}
# 切换分支到 master
git checkout master
# 拉取远程仓库，可以看到有很多分支生成了
# orgin 代表远程仓库
git fetch orgin
# 切回自己的分支，删除文件，提交到索引和仓库
rm test
git add -A
git commit
# 回滚找到之前的文件
# 确定文件在哪个 commit_id 上
git log
# 回滚的几种方式 soft/mixed/hard
git reset --soft commit_id
git reset --hard commit_id
# 合并操作 merge，本地分支的代码 merge 进去 master
git merge dev_{邮箱}
# 另一种合并操作
git rebase master
# 合并是有可能会有冲突的
# master 和 dev_{邮箱} 同时修改 test 的最后一行
git rebase master
# 远程合并提交 pull request/merge request，本地 master 拉取远程 master
git pull
```



git flow 流程：

参考：https://www.cnblogs.com/wish123/p/9785101.html