
<template>
  <v-row justify="center" align-content="center">
    <v-col cols="11" md="7">
      <br/>
      <!-- テーマ一覧カード -->
      <v-card outlined elevation="5">
        <v-card-title>
          テーマ一覧
        </v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  テーマ名
                </th>
                <th class="text-left">
                  作成者（管理者）
                </th>
                <th class="text-left">
                  削除（管理者限定）
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="theme in sortedThemes"
                :key="theme.id"
              >
                <td>{{ theme.name }}</td>
                <td>{{ theme.owner }}</td>
                <td>
                  <v-btn
                    color="error"
                    :disabled="!isThemeOwner(theme.owner)"
                    @click="deleteThemeConfirmDialog(theme.id)"
                    outlined
                  >
                    削除
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      <br/>
      <!-- テーマ追加カード -->
      <v-card outlined elevation="5">
        <v-card-title dense text>
          <v-toolbar-title>テーマを追加</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="inputBody"
            label="テーマ名"
            clearable
            @keydown.enter="addTheme"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="cancelAddTheme" outlined>Cancel</v-btn>
          <v-btn color="primary" @click="addTheme">Save</v-btn>
        </v-card-actions>
      </v-card>
      <br/>

      <!-- 削除確認のダイアログコンポーネント -->
      <ConfirmDialog ref="confirm"></ConfirmDialog>
    </v-col>
  </v-row>
</template>

<script>
// テーマの追加・削除用画面

import { API } from 'aws-amplify'
import { listThemes } from '@/graphql/queries'
import {
  createTheme,
  // updateTheme,
  deleteTheme,
} from '@/graphql/mutations'
import {
  onCreateTheme,
  onUpdateTheme,
  onDeleteTheme,
} from '@/graphql/subscriptions'
import { graphqlOperation } from '@aws-amplify/api-graphql'
import { GET_USER } from '@/store/mutation-types'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  data: function() {
    return {
      inputBody: '',
      themes: [],
      userName: '',
      onCreateThemeSubscription: null,
      onUpdateThemeSubscription: null,
      onDeleteThemeSubscription: null,
    }
  },
  components: {
    ConfirmDialog,
  },
  computed: {
    // 昇順に並び替え
    sortedThemes: function() {
      return this.themes
        .map(i => i)
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
    }
  },
  created: async function() {
    this.userName = this.$store.getters[GET_USER].username

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
    addTheme: async function() {
      if (!this.inputBody || this.inputBody.length <= 0) {
        return
      }
      const theme = {
        name: this.inputBody,
        owner: this.userName,
      }

      const item = await API.graphql(
        graphqlOperation(createTheme, { input: theme })
      ).catch(err => console.error('createTheme', err))
      const savedTheme = item.data.createTheme
      this.themes.push(savedTheme)

      this.inputBody = ''
    },
    deleteThemeConfirmDialog: async function(themeId) {
      if (await this.$refs.confirm.open('削除', 'テーマを削除します。よろしいですか？')) {
        await this.deleteThemeLogic(themeId)
      }
    },
    deleteThemeLogic: async function(themeId) {
      const index = this.getThemeIndex(themeId)
      if (index < 0) {
        return
      }

      const theme = this.getTheme(themeId)
      const input = {
        id: theme.id,
      }
      await API.graphql(
        graphqlOperation(deleteTheme, { input: input }),
      ).catch(err => console.error('deleteTheme', err))

      this.themes.splice(index, 1)
    },
    cancelAddTheme: function() {
      this.inputBody = ''
    },
    isThemeOwner: function(themeOwner) {
      return themeOwner === this.userName
    },
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