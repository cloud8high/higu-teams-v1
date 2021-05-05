<template>
  <v-app>
    <!-- バナー部分 -->
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon v-if="logedin" @click="drawer=!drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn to="/" color="primary" x-large depressed title class="text-h5">ひぐチームす</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!logedin" to="/signin" text small class="pr-0">
        <span class="mr-2"><v-icon>mdi-login-variant</v-icon></span>
      </v-btn>
      <v-btn v-else to="/signin" text small class="pr-0">
        <span class="mr-2"><v-icon>mdi-logout-variant</v-icon></span>
      </v-btn>
    </v-app-bar>

    <!-- ナビゲーションリスト部分 -->
    <template v-if="logedin">
    <v-navigation-drawer app v-model="drawer" clipped>
      <!-- テーマ一覧を表示するコンポーネント -->
      <ThemeNavigation></ThemeNavigation>
      <!-- サインアウトボタン -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="secondary" to="/signin">
            SignOut
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    </template>

    <!-- メインコンテンツ部分 -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { GET_USER } from '@/store/mutation-types'
import ThemeNavigation from '@/components/ThemeNavigation'

export default {
  name: 'App',
  components: {
    ThemeNavigation
  },
  data() {
    return {
      drawer: null,
    }
  },
  computed: {
    // ログイン状態の判断に利用
    logedin: function() {
      return this.$store.getters[GET_USER] !== null
    },
  },
  
};
</script>
