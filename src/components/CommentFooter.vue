<template>
  <v-card outlined color="white">
    <v-text-field
      label="コメント"
      outlined
      autofocus
      clearable
      v-model="inputComment"
      append-outer-icon="mdi-send"
      @keydown.enter="addComment"
      @click:append-outer="addComment"
      class="mb-n6"
    ></v-text-field>
  </v-card>
</template>

<script>
// CommentList.vue から呼び出される。

export default {
  data: function() {
    return {
      inputComment: '',
    }
  },
  methods: {
    addComment: function() {
      if (!this.inputComment || this.inputComment.length <= 0) {
        return
      }
      this.$emit('addComment', this.inputComment)
      this.inputComment = ''
    },
  },
}
</script>

<style>

</style>