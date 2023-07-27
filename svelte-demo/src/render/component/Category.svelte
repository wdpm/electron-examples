<script>
  import { Category } from "../model/Category";
  let categorys = [];
  let id = 0;
  for (let i = 0; i < 6; i++) {
    let obj = new Category();
    obj.id = id;
    obj.idPath = id;
    obj.parentId = -1;
    obj.level = 0;
    obj.title = "这是我的父级分类" + i;
    obj.hasChild = true;
    obj.isFold = false;
    categorys.push(obj);
    id += 1;
    for (let j = 0; j < 6; j++) {
      let obj1 = new Category();
      obj1.id = id;
      obj1.idPath = `${obj.id}_${obj1.id}`;
      obj1.parentId = i;
      obj1.level = 1;
      obj1.title = "这是我的子级分类" + i + " " + j;
      obj1.hasChild = true;
      obj.isFold = false;
      categorys.push(obj1);
      id += 1;
      for (let x = 0; x < 6; x++) {
        let obj2 = new Category();
        obj2.id = id;
        obj2.idPath = `${obj.id}_${obj1.id}_${obj2.id}`;
        obj2.parentId = j;
        obj2.level = 2;
        obj2.title = "这是我的子级分类" + i + " " + j + " " + x;
        obj2.hasChild = false;
        obj2.isFold = false;
        categorys.push(obj2);
        id += 1;
      }
    }
  }
  categorys = categorys;
  let cancelSelecte = () => {
    for (let index = 0; index < categorys.length; index++) {
      if (categorys[index].isSelected) {
        categorys[index].isSelected = false;
        break;
      }
    }
  };
  let addCategory = () => {};
  let addArticle = () => {};
  let onContextMenu = () => {};
  let categoryClick = (index) => {
    let flag = categorys[index].isSelected;
    cancelSelecte();
    categorys[index].isSelected = !flag;
    if (!categorys[index].hasChild) return;
    if (categorys[index].isFold) {
      // 这里应该展开它的下一级别的所有子元素，可以参考IDE左侧文件导航的效果
      console.log('TODO expand: ', index)
    } else {
      // 这里不应该是删除所有子元素，而是折叠它的所有子元素
      let patten = `[id^='c_${categorys[index].idPath}_']`;
      let domArr = document.querySelectorAll(patten);
      domArr.forEach((element) => {
        element.remove();
      });
    }
  };
</script>

<div class="Category">
  <div class="topBar">
    <div class="label">知识分类</div>
    <div class="toolBox">
      <div title="新建分类" on:click={addCategory}>
        <i class="iconfont iconaddCategory" />
      </div>
      <div title="新建知识" on:click={addArticle}>
        <i class="iconfont iconaddAriticle" />
      </div>
    </div>
  </div>
  <div class="categoryTree" on:contextmenu={onContextMenu}>
    {#each categorys as category, index}
      <div
        id={`c_${category.idPath}`}
        on:click={() => categoryClick(index)}
        style={`padding-left:${category.level * 24 + 6}px`}
        class:categoryItemSelected={category.isSelected}
        class="categoryItem"
      >
        <div class="categoryFold">
          <i class="iconfont iconunfold" />
        </div>
        <div class="categoryTitle">{category.title}</div>
        <div class="articleCount">12</div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .Category {
    width: 260px;
    height: 100%;
    background: rgb(243, 243, 243);
    font-size: 12px;
  }
  .topBar {
    height: 36px;
    line-height: 36px;
    display: flex;
    padding-left: 12px;
    padding-right: 8px;
    .label {
      flex: 1;
      color: #898989;
    }
    .toolBox {
      display: flex;
      div {
        width: 28px;
        line-height: 20px;
        margin: 8px 0;
        text-align: center;
        cursor: pointer;
        &:hover {
          background: rgb(225, 225, 225);
          border-radius: 4px;
        }
        i {
          font-size: 14px;
        }
      }
    }
  }
  .categoryTree {
    height: calc(100% - 36px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .categoryItem {
    display: flex;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    &:hover {
      background: rgb(232, 232, 232);
    }
    .categoryFold {
      width: 18px;
      color: #aaa;
      i {
        font-size: 12px;
      }
    }
    .categoryTitle {
      flex: 1;
    }
    .articleCount {
      width: 22px;
      font-size: 11px;
      color: #888;
    }
  }
  .categoryItemSelected {
    background: rgb(0, 96, 192) !important;
    color: #fff !important;
    i {
      color: #fff !important;
    }
    .articleCount {
      color: #ddd !important;
    }
  }
</style>
