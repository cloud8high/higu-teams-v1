<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <!-- ログインしていない時 -->
        <amplify-authenticator>
          <amplify-sign-up
            slot="sign-up"
            :form-fields.prop="formFields"
          ></amplify-sign-up>
        </amplify-authenticator>
        <!-- ログインしている時 -->
        <div v-if="authState === 'signedin' && user">
          <p>{{ user.username }} でサインインしています。</p>
          <amplify-sign-out></amplify-sign-out>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth, Hub } from 'aws-amplify'
import { SET_USER } from '@/store/mutation-types'
import { I18n } from "aws-amplify"
import { Translations, onAuthUIStateChange } from "@aws-amplify/ui-components"
const ja = require("@aws-amplify-jp/vocabulary-ja")
I18n.putVocabulariesForLanguage("ja-JP", ja(Translations));
I18n.setLanguage('ja-JP');


export default {
  data: function() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      formFields: [
        {
          type: 'username',
          // label: 'Username',
          // placeholder: 'Username',
          required: true,
        },
        {
          type: 'password',
          // label: 'Username',
          // placeholder: 'Password',
          required: true,
        },
        {
          type: 'email',
          // label: 'Email Address',
          // placeholder: 'Email',
          required: true
        },
      ],
    }
  },
  created: function() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authDate) => {
      this.authState = authState
      this.user = authDate
    })
    Hub.listen('auth', this.changeState)
  },
  beforeDestroy: function() {
    this.unsubscribeAuth()
    Hub.remove('auth', this.changeState)
  },
  methods: {
    // ログインが完了した場合に、状態の変化を検知してイベント一覧画面へ自動的に遷移させるもの
    // ユーザー情報を Vuex に保持したりクリアしたりしている
    changeState: async function(data) {
      const user = await Auth.currentUserInfo()
      switch (data.payload.event) {
        case 'signIn':
          this.$store.dispatch(SET_USER, user)
          this.$router.push('/theme')
          break
        case 'signOut':
          this.$store.dispatch(SET_USER, user)
          this.$router.push('/landing')
          break
      }
    },
  },
}
</script>

<style>
:root {
  --amplify-primary-color: #00897B;
  --amplify-primary-tint: #00897B;
  --amplify-primary-shade: #00897B;
}
</style>