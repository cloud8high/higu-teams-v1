<template>
  <!-- イベントやテーマの追加用ダイアログを設定 -->
  <v-dialog v-model="visible" :max-width="600" @keydown.esc="cancel">
    <v-card>
      <v-card-title dense text>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputBody"
          :label="label"
          autofocus
          clearable
          @keydown.enter="ok"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="cancel" outlined>Cancel</v-btn>
        <v-btn color="primary" @click.native="ok">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    }
  },
  data: () => ({
    inputBody: '',
  }),
  methods: {
    ok: function() {
      if (!this.inputBody || this.inputBody.length <= 0) {
        return
      }
      this.$emit('addBody', this.inputBody)
      this.inputBody = ''
    },
    cancel: function() {
      this.$emit('closeDialog')
      this.inputBody = ''
    }
  }
}
</script>

<style>

</style>