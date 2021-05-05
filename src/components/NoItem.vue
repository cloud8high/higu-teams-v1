<template>
  <v-row align="center" :style="style" justify="center" align-content="center">
    <v-col cols="11" md="7">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>{{ subtitle }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
      default: '150px',
    }
  },
  computed: {
    style: function() {
      return 'height:' + this.height
    }
  }
}
</script>

<style>

</style>