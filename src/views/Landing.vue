<template>
  <div>
    <v-carousel
      cycle
      height="450"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
        to="/signin"
      >
        <v-sheet
          :color="slide.color"
          height="100%"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <span class="display-3">
              {{ slide.main }}
            </span><br/>
            <span class="display-1">
              {{ slide.sub }}
            </span>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <br/>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          color="secondary"
          elevation="10"
          to="/signin"
          x-large
        >
          今すぐサインイン
        </v-btn>
      </v-col>
    </v-row>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      slides: [
        {
          main: '「Best App 2021」',
          sub: '-- IT Journal',
          color: 'lime darken-2'
        },
        {
          main: '「世紀の大発明」',
          sub: '-- 月刊 DX',
          color: 'lime darken-1'
        },
        {
          main: '「全人類向け」',
          sub: '-- TechPicks',
          color: 'lime'
        },
        {
          main: '「銀の弾丸」',
          sub: '-- 技術新聞ONLINE',
          color: 'lime lighten-1'
        },
      ],
    }
  },
}
</script>

<style>

</style>