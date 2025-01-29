<script lang="ts" setup>

</script>

<template>
  <div class="main">
    <div class="top">
      <slot name="top" />
    </div>
    <div class="content" id="main">
      <slot name="content" />
    </div>
    <div class="bottom">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
.main{
  height: 100%;
  width: 100%;
}

.top, .bottom {
  width: 100%;
  overflow: visible;
}

.top{
  position: sticky;
  top: 0;
  z-index: 100;
}

.bottom{
  position: fixed;
  bottom: 0;
  z-index: 100;
}

.content{
  width: 100%;
}
</style>