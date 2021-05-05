<template>
  <v-col>
    <!-- コメント単位のカード -->
    <v-card outlined elevation="5">
      <div :class="commentClass()">
        <!-- コメント作成者の アイコン・ユーザー名・投稿日時 を表示 -->
        <v-card-title>
          <v-avatar :color="comment.owner | avatarColor" size="32">
            <span class="white--text hadline">
              {{ comment.owner | avatarName }}
            </span>
          </v-avatar>
          <div class="ma-md-3">
            {{ comment.owner }}
          </div>
          <div class="text-subtitle-1 font-italic">
            {{ comment.createdAt | localTime }}
          </div>
        </v-card-title>

        <!-- コメント本体部分 -->
        <v-card-text class="text-h6">{{ comment.name }}</v-card-text>
        
        <!-- 右上・削除ボタン -->
        <v-btn
          v-if="isCommentOwner"
          absolute
          top
          right
          fab
          x-small
          elevation="0"
          color="error lighten-1"
          class="mt-6"
          @click="deleteComment(comment.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <!-- 左下・いいねボタン -->
        <v-btn
          text
          @click="addCommentLike(comment.id)">
          <v-icon>mdi-thumb-up-outline</v-icon>
        </v-btn>:
        <span>{{ comment.likes }}</span>
      </div>
    </v-card>

    <!-- 削除確認のダイアログコンポーネント -->
    <ConfirmDialog ref="confirm"></ConfirmDialog>
  </v-col>
</template>

<script>
// コメント単位のカード
// CommentList.vue から呼び出される。

import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    isCommentOwner: {
      type: Boolean,
      required: true,
    }
  },
  data: function() {
    return {
      changed: false,
    }
  },
  components: {
    ConfirmDialog,
  },
  methods: {
    addCommentLike: function(commentId) {
      this.$emit('addCommentLike', commentId)
    },
    deleteComment: async function(commentId) {
      if (await this.$refs.confirm.open('削除', 'コメントを削除します。よろしいですか？')) {
        this.$emit('deleteComment', commentId)
      }
    },
    changedComment: function() {
      this.changed = true
      setTimeout(() => {
        this.changed = false
      }, 1000)
    },
    commentClass: function() {
      return this.changed ? 'comment' : ''
    },
  },
}
</script>

<style>
.comment {
  background-color: rgba(0, 0, 0, 0);
  animation-name: new-comment;
  animation-duration: 1500ms;
}

@keyframes new-comment {
  0% {
    background-color: rgba(30, 140, 230, 0.5);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>