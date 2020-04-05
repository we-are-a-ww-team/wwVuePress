## docker安装jenkins

-- 拉取海洋版jenkins的docker
docker pull jenkinsci/blueocean



--创建docker实例	
docker run --name jenkinsci-blueocean -u root --rm  -d -p 7005:8080 -p 50000:50000 -v /data/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean