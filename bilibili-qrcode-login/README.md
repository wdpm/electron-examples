## steps

- 检测会话中是否含有登录相关的cookie数据
    - 如果含有，那就跳过扫码登录步骤。
    - 否则，需要预备二维码，显示到前端，接着引导用户扫码登录。登录后，从响应中提取有关login的cookie数据，将这些cookie数据设置到浏览器会话中，并持久化到外部存储。
- 到这里，已经确保了用户为已登录状态，浏览器窗口实例的cookie tab能看到有关login的cookie字段。

> Q1: 上述的会话，应该选择全局会话，还是局部单一会话实例？

不管是window的session还是defaultSession，只要合理设置了expirationDate 字段，electron就会自动持久化这些 cookies 。

> Q2：cookie数据是否需要持久化到外部存储中，例如独立的settings.json。

如果持久化到外部存储，后续假设用户不小心删了浏览器cookie，那么能够从外部备份中恢复浏览器的登录cookie。
这里就理清了程序的两个功能需求：1.浏览器login cookie的管理；2.外部备份的login cookie的管理。

- 浏览器登录cookie被删，外部有备份 => 可以从外部备份恢复，恢复前先检测外部保存的cookie是否还可用，不可用就引导登录。
- 浏览器登录cookie被删，外部无备份 => 不可以从外部备份恢复，引导登录。
- 浏览器登录cookie存在 => 提供检测cookie是否还可用的API。

全新登录：刷新浏览器cookie，刷新外部cookie备份。