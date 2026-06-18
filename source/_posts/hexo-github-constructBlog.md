---
title: Hexo + GitHub Pages：个人博客先把发布链路跑通
date: 2019-07-09 16:59:17
tags: [Blog, Github]
---

个人博客最重要的第一步不是主题多漂亮，而是发布链路是否稳定：本地能写，静态站能生成，GitHub Pages 能托管，域名能访问，后续文章能持续更新。

Hexo + GitHub Pages 的价值在于把这个链路压到足够轻：Markdown 写作、Node.js 生成静态页面、GitHub 托管、域名解析到 Pages。

<!--more-->

## 要解决的问题

自建博客常见失败点不是不会写文章，而是发布路径太重。服务器、数据库、后台、主题和域名同时上，很容易让写作被运维打断。

静态博客的思路是把动态能力降到最低：文章在本地生成 HTML，远端只托管静态文件。这样就不需要自建数据库和后端服务。

## 最小抽象

一条最小发布链路如下：

```text
Markdown posts
  -> Hexo generate
  -> Git commit / deploy
  -> GitHub Pages
  -> Custom domain
```

先在 GitHub 创建 `username.github.io` 仓库，再安装 Git、Node.js 和 Hexo CLI。

![](hexo-github-constructBlog/gitbash.png)

Git 身份和 SSH key 的作用是让本地可以稳定推送到 GitHub：

```bash
git config --global user.name "your-github-name"
git config --global user.email "your-email@example.com"
ssh-keygen -t rsa -C "your-email@example.com"
```

![](hexo-github-constructBlog/ssh.jpg)

![](hexo-github-constructBlog/newSSHKey.jpg)

![](hexo-github-constructBlog/SSHTest.jpg)

Node.js 安装完成后确认 `node` 和 `npm` 可用：

![](hexo-github-constructBlog/NodeJsTest.jpg)

Hexo 最小命令集：

```bash
npm install -g hexo-cli
hexo init blog
hexo new my-post
hexo clean
hexo generate
hexo server
hexo deploy
```

## 工程闭环

部署要变成可重复动作，而不是一次性教程。

首先在 `_config.yml` 中配置 deploy 目标和基础站点信息：

![](hexo-github-constructBlog/BlogConfig1.jpg)

![](hexo-github-constructBlog/BlogConfig2.jpg)

然后安装部署插件：

```bash
npm install hexo-deployer-git --save
hexo clean
hexo generate
hexo deploy
```

绑定域名时，关键是两边都要配置：域名解析指向 GitHub Pages，仓库或生成目录中保留 `CNAME` 文件。

![](hexo-github-constructBlog/domain1.jpg)

![](hexo-github-constructBlog/domain2.jpg)

![](hexo-github-constructBlog/domain3.jpg)

![](hexo-github-constructBlog/domain4.jpg)

如果长时间未更新后 `hexo server` 报错，通常是依赖漂移或本地服务包缺失，可以在博客根目录重新安装服务依赖：

```bash
npm install hexo-server --save
```

## 直接结论

Hexo + GitHub Pages 的核心价值是把个人博客的发布成本降到最低。先保证“写作 -> 生成 -> 预览 -> 部署 -> 域名访问”这条链路稳定，再考虑主题、评论、搜索和自动化。

博客系统不需要一开始就复杂。真正值得长期维护的是可重复发布、可备份、可迁移和可验证。

下一步阅读：[Agentic Coding 工程治理：多模型协作的角色、权限与验证闭环](/2026/06/10/Agentic-Coding-Governance/)

### References

[1] [Hexo 建站参考](https://zhuanlan.zhihu.com/p/26625249)
