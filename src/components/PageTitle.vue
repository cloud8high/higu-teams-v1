<template>
  <span class="text-h4 text-md-h2">{{ title }}</span>
</template>

<script>
// TopicList.vue, CommentList.vue の両方から呼び出される。

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style>

</style>