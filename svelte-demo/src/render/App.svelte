<script lang="ts">
  import Category from "./component/Category.svelte";
  import TitleBar from "./component/TitleBar.svelte";
</script>

<div class="pageBody">
  <TitleBar />
  <div class="mainBody">
    <Category />
    <div>title list</div>
    <div class="articleContent">title content</div>
  </div>
</div>

<style lang="scss">
  .pageBody {
    height: 100%;
  }
  .mainBody {
    height: calc(100% - 30px);
    display: flex;
    flex: 1;
    .articleContent {
      flex: 1;
    }
  }
</style>
