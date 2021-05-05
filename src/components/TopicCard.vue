<template>
  <v-row>
    <v-col cols="12">
      <!-- トピック単位のカード -->
      <v-card @click="isDialog = !isDialog">
        <div :class="topicClass()">
          <!-- トピック作成者の アイコン・ユーザー名・投稿日時 を表示 -->
          <v-card-title>
            <v-avatar :color="topic.owner | avatarColor" size="32">
              <span class="white--text headline">
                {{ topic.owner | avatarName }}
              </span>
            </v-avatar>
            <div class="ma-3">
              {{ topic.owner }}
            </div>
            <div class="text-subtitle-1 font-italic">
              {{ topic.createdAt | localTime }}
            </div>
          </v-card-title>

          <!-- トピック本体部分 -->
          <v-card-text class="text-h6">{{ topic.name }}</v-card-text>
          
          <!-- 右上・削除ボタン -->
          <v-btn
            v-if="isTopicOwner"
            absolute
            top
            right
            fab
            x-small
            elevation="0"
            color="error lighten-1"
            class="mt-6"
            @click.stop="deleteTopic(topic.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          
          <!-- 左下・いいねボタン -->
          <v-btn
            text
            @click.stop="addTopicLike(topic.id)">
            <v-icon>mdi-thumb-up-outline</v-icon>
          </v-btn>:
          <span>{{ topic.likes }}</span>
        </div>
      </v-card>

      <!-- トピックカード選択時にトピック詳細ページ（コメントリストページ）のダイアログを開く） -->
      <v-dialog
        scrollable
        v-model="isDialog"
        overlay-opacity="0.95"
        overlay-color="white"
        max-width="900px"
      >
        <CommentList
          :topicId="topic.id"
          v-on:closeTopicDialog="isDialog = !isDialog"
        ></CommentList>
      </v-dialog>
      
      <!-- 削除確認のダイアログコンポーネント -->
      <ConfirmDialog ref="confirm"></ConfirmDialog>
    </v-col>
  </v-row>

</template>

<script>
// トピック単位のカードと、選択時にトピック詳細ページ（コメントリストページ）のダイアログが表示されるフロー
// TopicList.vue から呼び出される。

import CommentList from '@/views/CommentList'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  props: {
    topic: {
      type: Object,
      required: true,
    },
    isTopicOwner: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
    return {
      isDialog: false,
      changed: false,
    }
  },
  components: {
    CommentList,
    ConfirmDialog,
  },
  methods: {
    addTopicLike: function(topicId) {
      this.$emit('addTopicLike', topicId)
    },
    deleteTopic: async function(topicId) {
      if (await this.$refs.confirm.open('削除', 'トピックを削除します。よろしいですか？')) {
        this.$emit('deleteTopic', topicId)
      }
    },
    changedTopic: function() {
      this.changed = true
      setTimeout(() => {
        this.changed = false
      }, 1000)
    },
    topicClass: function() {
      return this.changed ? 'topic' : ''
    },
  },
}
</script>

<style>
.topic {
  background-color: rgba(0, 0, 0, 0);
  animation-name: new-topic;
  animation-duration: 1500ms;
}

@keyframes new-topic {
  0% {
    background-color: rgba(30, 140, 230, 0.5);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>