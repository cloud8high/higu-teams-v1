<template>
  <v-container>
    <v-row>
      <!-- テーマ名を表示する部分 -->
      <v-col cols="10" md="11">
        <PageTitle v-if="theme.name" :title="theme.name"></PageTitle>
      </v-col>
      
      <!-- 右上・トピック追加ボタン（押下するとダイアログが表示される） -->
      <v-col cols="2 " md="1">
        <v-btn
          fixed
          fab
          color="primary"
          @click="showAddTopicDialog = !showAddTopicDialog"
          style="z-index:10"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- トピック一覧部分 -->
    <v-scroll-y-transition group>
      <template v-for="topic in sortedTopics">
        <!-- 各トピックのカードは別コンポーネントで実装 -->
        <TopicCard
          :ref="topic.id"
          :key="topic.id"
          :topic="topic"
          :isTopicOwner="isTopicOwner(topic.owner)"
          @addTopicLike="addTopicLike"
          @deleteTopic="deleteTopic"
        ></TopicCard>
      </template>
      <!-- トピックが一つもない時は、追加するように依頼する -->
      <NoItem
        v-if="loaded && sortedTopics.length===0"
        title="最初のトピックを追加しましょう"
        subtitle="画面右上の「+」ボタンから追加します"
        height="400px"
        key="noitem"
      ></NoItem>
    </v-scroll-y-transition>
    
    <!-- トピック追加ダイアログ -->
    <AddDialog
      title="トピックを追加"
      label="トピック名"
      :visible="showAddTopicDialog"
      @addBody="addTopic"
      @closeDialog="closeAddTopicDialog"
    ></AddDialog>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { getTheme } from '@/graphql/queries'
import {
  createTopic,
  updateTopic,
  deleteTopic,
} from '@/graphql/mutations'
import {
  onCreateTopic,
  onUpdateTopic,
  onDeleteTopic,
} from '@/graphql/subscriptions'
import moment from 'moment'
import PageTitle from '@/components/PageTitle'
import TopicCard from '@/components/TopicCard'
import AddDialog from '@/components/AddDialog'
import NoItem from '@/components/NoItem'
import { GET_USER } from '@/store/mutation-types'

export default {
  props: {
    themeId: {
      type: String,
      required: true,
    }
  },
  components: {
    PageTitle,
    TopicCard,
    AddDialog,
    NoItem,
  },
  computed: {
    // 新着トピックが画面上部に表示される配列を作成
    sortedTopics: function() {
      return this.topics
        .map(i => i)
        .sort((a, b) => {
          return moment(a.createdAt) < moment(b.createdAt) ? 1 : -1
        })
    },
  },
  data: function() {
    return {
      showAddTopicDialog: false,
      theme: {},
      userName: '',
      updatedTopicIds: [],
      topics: [],
      loaded: false,
      onCreateTopicSubscription: null,
      onUpdateTopicSubscription: null,
      onDeleteTopicSubscription: null,
    }
  },
  // created だと、ルートパラメーターだけが異なるページ遷移の際に、インスタンスの再利用がされてしまいページが遷移しないため。
  // 例：theme/1 -> theme/2 への遷移の際、theme/1 が表示されたままになってしまう。
  watch: {
    themeId: {
      async handler() {
        this.userName = this.$store.getters[GET_USER].username

        const item = await API.graphql(
          graphqlOperation(getTheme, { id: this.themeId }),
        ).catch(err => console.error('getTheme', err))

        this.theme = item.data.getTheme
        this.topics = this.theme.topics.items

        this.onCreateTopicSubscription = API.graphql(
          graphqlOperation(onCreateTopic)
        ).subscribe({
          next: data => {
            // 作成されたトピック情報を取り出す
            const savedTopic = data.value.data.onCreateTopic
            // 現在開いているテーマのトピックでは無かったら処理を終了
            if (!this.isTargetTheme(savedTopic.themeId)) {
              return
            }
            // 作成されたトピックがトピック一覧に存在しなければ、トピック一覧へ追加する。
            // 作成されたトピックがトピック一覧に存在するというのは、自分が追加したトピックということ
            const topic = this.getTopic(savedTopic.id)
            if (topic === null) {
              // 作成されたトピックをトピック一覧配列へ格納する
              this.topics.push(savedTopic)
            }
          }
        })

        this.onUpdateTopicSubscription = API.graphql(
          graphqlOperation(onUpdateTopic),
        ).subscribe({
          next: data => {
            // 更新されたトピック情報を取り出す
            const updatedTopic = data.value.data.onUpdateTopic
            // 現在開いているテーマのトピックでは無かったら処理を終了
            if (!this.isTargetTheme(updatedTopic.themeId)) {
              return
            }
            // すでにトピック一覧に存在するトピックだけを更新対象とする
            const updatedTopicIndex = this.getTopicIndex(updatedTopic.id)
            if (updatedTopicIndex >= 0) {
              // 更新されたトピック情報を、元のトピック一覧配列にて入れ替える
              this.topics.splice(updatedTopicIndex, 1, updatedTopic)
            }
          },
        })

        this.onDeleteTopicSubscription = API.graphql(
          graphqlOperation(onDeleteTopic),
        ).subscribe({
          next: data => {
            // 削除されたトピック情報を取り出す
            const deletedTopic = data.value.data.onDeleteTopic
            // 現在開いているテーマのトピックでは無かったら処理を終了
            if (!this.isTargetTheme(deletedTopic.themeId)) {
              return
            }
            // 削除されたトピックをトピック一覧配列から削除する
            const deletedTopicIndex = this.getTopicIndex(deletedTopic.id)
            if (deletedTopicIndex >= 0) {
              this.topics.splice(deletedTopicIndex, 1)
            }
          },
        })
        // 読み込みが完了したため、loaded フラグを true に変更
        this.loaded = true
      },
      immediate:true
    }
  },
  updated: function() {
    for (const id of this.updatedTopicIds) {
      // 子コンポーネントのchangedTopicメソッドを呼び出し、CSSを変更する。
      this.$refs[id][0].changedTopic()
    }
    this.updatedTopicIds = []
  },
  beforeDestroy: function() {
    if (this.onCreateTopicSubscription) {
      this.onCreateTopicSubscription.unsubscribe()
      this.onCreateTopicSubscription = null
    }

    if (this.onUpdateTopicSubscription) {
      this.onUpdateTopicSubscription.unsubscribe()
      this.onUpdateTopicSubscription = null
    }

    if (this.onDeleteTopicSubscription) {
      this.onDeleteTopicSubscription.unsubscribe()
      this.onDeleteTopicSubscription = null
    }
  },
  methods: {
    addTopic: async function(inputBody) {
      if (!inputBody || inputBody.length <= 0) {
        return
      }

      const topic = {
        themeId: this.theme.id,
        name: inputBody,
        owner: this.userName,
        likes: 0,
      }

      const item = await API.graphql(
        graphqlOperation(createTopic, { input: topic }),
      ).catch(err => console.error('createTopic', err))
      const savedTopic = item.data.createTopic
      this.topics.push(savedTopic)

      // トピック追加用ダイアログを閉じる（CommentList には無く、TopicList 特有の処理）
      this.showAddTopicDialog = false

      this.pushUpdatedTopicIds(savedTopic.id)
    },
    addTopicLike: async function(topicId) {
      const topic = this.getTopic(topicId)
      if (topic === null) {
        return
      }
      const input = {
        id: topic.id,
        likes: topic.likes + 1,
      }
      await API.graphql(
        graphqlOperation(updateTopic, {input: input}),
      ).catch(err => console.error('updateTopic', err))
    },
    deleteTopic: async function(topicId) {
      const index = this.getTopicIndex(topicId)
      if (index < 0) {
        return
      }

      const topic = this.getTopic(topicId)
      const input = {
        id: topic.id,
      }
      await API.graphql(
        graphqlOperation(deleteTopic, { input: input }),
      ).catch(err => console.error('deleteTopic', err))

      this.topics.splice(index, 1)
    },
    isTopicOwner: function(topicOwner) {
      return topicOwner === this.userName
    },
    getTopic: function(topicId) {
      const topic = this.topics.find(item => item.id === topicId)
      if (topic === void 0) {
        return null
      }
      return topic
    },
    getTopicIndex: function(topicId) {
      return this.topics.findIndex(item => item.id === topicId)
    },
    pushUpdatedTopicIds: function(topicId) {
      if (!this.updatedTopicIds.includes(topicId)) {
        this.updatedTopicIds.push(topicId)
      }
    },
    isTargetTheme: function(themeId) {
      return this.theme.id === themeId
    },
    closeAddTopicDialog: function() {
      // トピック追加用ダイアログを閉じる（CommentList には無く、TopicList 特有の処理）
      this.showAddTopicDialog = false
    },
  },
}
</script>

<style>

</style>