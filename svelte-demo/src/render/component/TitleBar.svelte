<script lang="ts">
  let { ipcRenderer } = require("electron");
  let winToolHandle = (e: MouseEvent) => {
    let dom = e.currentTarget as HTMLElement;
    let className = dom.firstElementChild.classList[1].replace("icon", "");
    ipcRenderer.invoke("windowToolCall", className);
  };
  let settingToolHandle = (e) => {
    //todo
  };
  let maxmizeIcon = `restore`;
  ipcRenderer.on("windowResize", (e, param) => {
    maxmizeIcon = param.isMaximized ? `restore` : `maxsize`;
  });
</script>

<div class="TitleBar">
  <div class="title">赤星</div>
  <div class="articleTitle">title</div>
  <div class="tool">
    <div on:click={settingToolHandle}>
      <i class="iconfont iconsetting" />
    </div>
    <div on:click={winToolHandle}>
      <i class="iconfont iconminisize" />
    </div>
    <div on:click={winToolHandle}>
      <i class={`iconfont icon${maxmizeIcon}`} />
    </div>
    <div on:click={winToolHandle} class="closeBtn">
      <i class="iconfont iconclose" />
    </div>
  </div>
</div>

<style lang="scss">
  .TitleBar {
    height: 30px;
    line-height: 30px;
    background: rgb(229, 229, 229);
    -webkit-app-region: drag;
    display: flex;
    color: #636363;
  }
  .title {
    width: 200px;
    padding-left: 16px;
  }
  .articleTitle {
    text-align: center;
    flex: 1;
  }
  .tool {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    div {
      width: 38px;
      text-align: center;
      -webkit-app-region: no-drag;
      cursor: pointer;
      &:hover {
        background: rgb(198, 198, 198);
      }
      i {
        font-size: 12px !important;
      }
    }
    .closeBtn:hover {
      background-color: red !important;
      color: #fff;
    }
  }
</style>
