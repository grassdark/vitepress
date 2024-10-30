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