<template>
  <!-- 削除処理などの確認ダイアログを設定 -->
  <v-dialog v-model="dialog" :max-width="400" @keydown.esc="cancel">
    <v-card>
      <v-card-title dense text>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-card-title>
      <v-card-text v-show="!!message" style="text-subtitle-1">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="cancel" outlined>Cancel</v-btn>
        <v-btn color="primary" @click.native="ok">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
    }),
    methods: {
      open: function(title, message) {
        this.dialog = true
        this.title = title
        this.message = message
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      ok: function() {
        this.resolve(true)
        this.dialog = false
      },
      cancel: function() {
        this.resolve(false)
        this.dialog = false
      }
    }
  }
</script>