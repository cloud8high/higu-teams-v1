<template>
  <div>
    <v-card>
      <!-- トピック名を表示する部分 -->
      <v-card-title class="headline grey lighten-3">
        <PageTitle v-if="topic.name" :title="topic.name"></PageTitle>
      </v-card-title>

      <!-- 右上・閉じるボタン -->
      <v-btn
        absolute
        top
        right
        fab
        x-small
        elevation="0"
        color="warning"
        dark
        class="mt-6"
        @click.stop="closeTopicDialog()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- トピック作成者と投稿時間の表示 -->
      <v-card-title v-if="topic.owner" class="headline grey lighten-3">
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
      <v-divider></v-divider>

      <!-- コメント一覧部分 -->
      <v-card-text>
        <v-scroll-y-transition group>
          <template v-for="comment in sortedComments">
            <!-- 各コメントのカードは別コンポーネントで実装 -->
            <CommentCard
              :ref="comment.id"
              :key="comment.id"
              :comment="comment"
              :isCommentOwner="isCommentOwner(comment.owner)"
              @addCommentLike="addCommentLike"
              @deleteComment="deleteComment"
            ></CommentCard>
          </template>
          <!-- トピックが一つもない時は、追加するように依頼する -->
          <NoItem
            v-if="loaded && sortedComments.length===0"
            title="最初のコメントを追加しましょう"
            subtitle="画面下部のコメント入力欄から追加できます"
            height="150px"
            key="noitem"
          ></NoItem>
        </v-scroll-y-transition>
      </v-card-text>
      <v-divider></v-divider>

      <!-- コメント投稿エリア（フッター） -->
      <v-card-text>
        <CommentFooter
          @addComment="addComment"
        ></CommentFooter>
      </v-card-text>
    </v-card>
  </div>


</template>

<script>
// TopicCard.vue から呼び出される

import { API, graphqlOperation } from 'aws-amplify'
import { getTopic } from '@/graphql/queries'
import {
  createComment,
  updateComment,
  deleteComment,
} from '@/graphql/mutations'
import {
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
} from '@/graphql/subscriptions'
import moment from 'moment'
import PageTitle from '@/components/PageTitle'
import CommentCard from '@/components/CommentCard'
import CommentFooter from '@/components/CommentFooter'
import NoItem from '@/components/NoItem'
import { GET_USER } from '@/store/mutation-types'

export default {
  props: {
    topicId: {
      type: String,
      required: true,
    },
  },
  components: {
    PageTitle,
    CommentCard,
    CommentFooter,
    NoItem,
  },
  computed: {
    // 新着コメントが画面下部に表示される配列を作成
    sortedComments: function() {
      return this.comments
        .map(i => i)
        .sort((a, b) => {
          return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
        })
    },
  },
  data: function() {
    return {
      topic: {},
      userName: '',
      inputComment: '',
      updatedCommentIds: [],
      comments: [],
      loaded: false,
      onCreateCommentSubscription: null,
      onUpdateCommentSubscription: null,
      onDeleteCommentSubscription: null,
    }
  },
  created: async function () {
    this.userName = this.$store.getters[GET_USER].username

    const item = await API.graphql(
      graphqlOperation(getTopic, { id: this.topicId }),
    ).catch(err => console.error('getTopic', err))

    this.topic = item.data.getTopic
    this.comments = this.topic.comments.items

    this.onCreateCommentSubscription = API.graphql(
      graphqlOperation(onCreateComment),
    ).subscribe({
      next: data => {
        // 作成されたコメント情報を取り出す
        const savedComment = data.value.data.onCreateComment
        // 現在開いているトピックのコメントでは無かったら処理を終了
        if (!this.isTargetTopic(savedComment.topicId)) {
          return
        }
        // 作成されたコメントがコメント一覧に存在しなければ、コメント一覧へ追加する。
        // 作成されたコメントがコメント一覧に存在するというのは、自分が追加したコメントということ
        const comment = this.getComment(savedComment.id)
        if (comment === null) {
          // 作成されたコメントをコメント一覧配列へ格納する
          this.comments.push(savedComment)
        }
      }
    })

    this.onUpdateCommentSubscription = API.graphql(
      graphqlOperation(onUpdateComment),
    ).subscribe({
      next: data => {
        // 更新されたコメント情報を取り出す
        const updatedComment = data.value.data.onUpdateComment
        // 現在開いているトピックのコメントでは無かったら処理を終了
        if (!this.isTargetTopic(updatedComment.topicId)) {
          return
        }
        // すでにコメント一覧に存在するコメントだけを更新対象とする
        const updatedCommentIndex = this.getCommentIndex(updatedComment.id)
        if (updatedCommentIndex >= 0) {
          // 更新されたコメント情報を元のコメント一覧配列にて入れ替える
          this.comments.splice(updatedCommentIndex, 1, updatedComment)
        }
      },
    })

    this.onDeleteCommentSubscription = API.graphql(
      graphqlOperation(onDeleteComment),
    ).subscribe({
      next: data => {
        // 削除されたコメント情報を取り出す
        const deletedComment = data.value.data.onDeleteComment
        // 現在開いているトピックのコメントでは無かったら処理を終了
        if (!this.isTargetTopic(deletedComment.topicId)) {
          return
        }
        // 削除されたコメントをコメント一覧配列から削除する
        const deletedCommentIndex = this.getCommentIndex(deletedComment.id)
        if (deletedCommentIndex >= 0) {
          this.comments.splice(deletedCommentIndex, 1)
        }
      },
    })
    // 読み込みが完了したため、loaded フラグを true に変更
    this.loaded = true
  },
  updated: function() {
    for (const id of this.updatedCommentIds) {
      // 子コンポーネントのchangedCommentメソッドを呼び出し、CSSを変更する。
      this.$refs[id][0].changedComment()
    }
    this.updatedCommentIds = []
  },
  beforeDestroy: function() {
    if (this.onCreateCommentSubscription) {
      this.onCreateCommentSubscription.unsubscribe()
      this.onCreateCommentSubscription = null
    }

    if (this.onUpdateCommentSubscription) {
      this.onUpdateCommentSubscription.unsubscribe()
      this.onUpdateCommentSubscription = null
    }

    if (this.onDeleteCommentSubscription) {
      this.onDeleteCommentSubscription.unsubscribe()
      this.onDeleteCommentSubscription = null
    }
  },
  methods: {
    addComment: async function(inputComment) {
      if (!inputComment || inputComment.length <= 0) {
        return
      }

      const comment = {
        topicId: this.topic.id,
        name: inputComment,
        owner: this.userName,
        likes: 0
      }

      const item = await API.graphql(
        graphqlOperation(createComment, { input: comment }),
      ).catch(err => console.error('createComment', err))
      const savedComment = item.data.createComment
      this.comments.push(savedComment)

      this.pushUpdatedCommentIds(savedComment.id)
    },
    addCommentLike: async function(commentId) {
      const comment = this.getComment(commentId)
      if (comment === null) {
        return
      }
      const input = {
        id: comment.id,
        likes: comment.likes + 1,
      }
      await API.graphql(
        graphqlOperation(updateComment, { input: input }),
      ).catch(err => console.error('updateComment', err))
    },
    deleteComment: async function(commentId) {
      const index = this.getCommentIndex(commentId)
      if (index < 0) {
        return
      }

      const comment = this.getComment(commentId)
      const input = {
        id: comment.id,
      }
      await API.graphql(
        graphqlOperation(deleteComment, { input: input }),
      ).catch(err => console.error('deleteComment', err))

      this.comments.splice(index, 1)
    },
    isCommentOwner: function(commentOwner) {
      return commentOwner === this.userName
    },
    getComment: function(commentId) {
      const comment = this.comments.find(item => item.id === commentId)
      if (comment === void 0) {
        return null
      }
      return comment
    },
    getCommentIndex: function(commentId) {
      return this.comments.findIndex(item => item.id === commentId)
    },
    pushUpdatedCommentIds: function(commentId) {
      if (!this.updatedCommentIds.includes(commentId)) {
        this.updatedCommentIds.push(commentId)
      }
    },
    isTargetTopic: function(topicId) {
      return this.topic.id === topicId
    },
    closeTopicDialog: function() {
      this.$emit('closeTopicDialog')
    },
  },
}
</script>

<style>

</style>