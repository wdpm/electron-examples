# Auto updater
Action：点击检测更新。

【发现更新，是否立即下载？】
- 是 => 下载更新,测试通过
- 否 => NOOP 测试通过
- 直接X关闭对话框 => NOOP， 测试通过

【更新已下载完毕, 退出并安装, 或暂不安装？】
- 退出并安装 => 退出App，自动打开安装对话框，安装成功后自动打开App。测试通过
- 暂不安装 => NOOP, App退出后保持 NOOP
- 直接X关闭对话框 => NOOP, App退出后保持 NOOP