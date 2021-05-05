<template>
  <v-container>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-content class="title grey--text text--darken-2">
          テーマ 一覧
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <!-- 動的に変わるテーマ情報 -->
    <v-list dense nav>
      <v-list-item link v-for="nav_list in nav_lists_float" :key="nav_list.name" :to="nav_list.link">
        <v-list-item-icon>
          <v-icon>{{ nav_list.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- 動的に変わらない部分 -->
    <v-list dense nav>
      <v-list-item link v-for="nav_list in nav_lists_fixed" :key="nav_list.name" :to="nav_list.link">
        <v-list-item-icon>
          <v-icon>{{ nav_list.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { listThemes } from '@/graphql/queries'
import {
  // createTheme,
  // updateTheme,
  // deleteTheme,
} from '@/graphql/mutations'
import {
  onCreateTheme,
  onUpdateTheme,
  onDeleteTheme,
} from '@/graphql/subscriptions'
import { graphqlOperation } from '@aws-amplify/api-graphql'

export default {
  data() {
    return {
      themes: [],
      nav_lists_float: [],
      nav_lists_fixed:[
        {name: 'テーマの追加・削除',icon: 'mdi-cogs', link: '/edittheme'},
      ],
      onCreateThemeSubscription: null,
      onUpdateThemeSubscription: null,
      onDeleteThemeSubscription: null,
    }
  },
  created: async function() {
    const items = await API.graphql(
      graphqlOperation(listThemes)
    ).catch(err => console.error('listThemes', err))

    this.themes = items.data.listThemes.items

    this.onCreateThemeSubscription = API.graphql(
      graphqlOperation(onCreateTheme)
    ).subscribe({
      next: data => {
        // 作成されたテーマ情報を取り出す
        const savedTheme = data.value.data.onCreateTheme
        
        // 作成されたテーマがテーマ一覧に存在しなければ、テーマ一覧へ追加する
        // 作成されたテーマがテーマ一覧に存在するというのは、自分が追加したテーマということ
        const theme = this.getTheme(savedTheme.id)
        if (theme === null) {
          // 作成されたテーマをテーマ一覧配列へ格納する
          this.themes.push(savedTheme)
        }
      }
    })

    this.onUpdateThemeSubscription = API.graphql(
      graphqlOperation(onUpdateTheme)
    ).subscribe({
      next: data => {
        // 更新されたテーマ情報を取り出す
        const updatedTheme = data.value.data.onUpdateTheme

        // 既にテーマ一覧に存在するテーマだけを更新対象とする
        const updatedThemeIndex = this.getThemeIndex(updatedTheme.id)
        if (updatedThemeIndex >= 0) {
          // 更新されたテーマ情報を、元のテーマ一覧配列にて入れ替える
          this.themes.splice(updatedThemeIndex, 1, updatedTheme)
        }
      }
    })

    this.onDeleteThemeSubscription = API.graphql(
      graphqlOperation(onDeleteTheme)
    ).subscribe({
      next: data => {
        // 削除されたテーマ情報を取り出す
        const deletedTheme = data.value.data.onDeleteTheme

        // 削除されたテーマをテーマ一覧配列から削除する
        const deletedThemeIndex = this.getThemeIndex(deletedTheme.id)
        if (deletedThemeIndex >= 0) {
          this.themes.splice(deletedThemeIndex, 1)
        }
      }
    })
  },
  watch: {
    themes: {
      handler: function() {
        let themesList = []
        for (let i = 0; i < this.themes.length; i++) {
          let theme = {}
          theme.name = this.themes[i].name
          theme.icon = 'mdi-account-multiple'
          theme.link = '/theme/' + this.themes[i].id
          themesList.push(theme)
        }
        // 昇順に並べ替え
        themesList.sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
        this.nav_lists_float = themesList
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy: function() {
    if (this.onCreateThemeSubscription) {
      this.onCreateThemeSubscription.unsubscribe()
      this.onCreateThemeSubscription = null
    }

    if (this.onUpdateThemeSubscription) {
      this.onUpdateThemeSubscription.unsubscribe()
      this.onUpdateThemeSubscription = null
    }

    if (this.onDeleteThemeSubscription) {
      this.onDeleteThemeSubscription.unsubscribe()
      this.onDeleteThemeSubscription = null
    }
  },
  methods: {
    getTheme: function(themeId) {
      const theme = this.themes.find(item => item.id === themeId)
      if (theme === void 0) {
        return null
      }
      return theme
    },
    getThemeIndex: function(themeId) {
      return this.themes.findIndex(item => item.id === themeId)
    },
  }
}
</script>

<style>

</style>