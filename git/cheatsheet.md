::: code-group

```sh [设置全局代理]
$ git config --global http.proxy 192.168.2.6:7890
$ git config --global https.proxy 192.168.2.6:7890
```

```sh [取消全局代理]
$ git config --global --unset http.proxy
$ git config --global --unset https.proxy
```

```sh [查看全局代理]
$ git config --global http.proxy
$ git config --global https.proxy
```

:::

::: code-group

```sh [创建本地分支]
$ git branch feature
```

```sh [切换当前分支]
$ git checkout feature
```

```sh [提交到远程仓库]
$ git push origin feature
```

:::

::: code-group

```sh [克隆指定分支]
$ git clone -b branch_name repository_url
```

:::