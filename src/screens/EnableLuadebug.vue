<template>
  <div class="luadebugScreen">
    <h1>{{"enableLuadebug" | t($store.state.locale)}}</h1>
    <p>{{"luadebugMainDesc" | t($store.state.locale)}}</p>

    <p>{{"luadebugDesc1" | t($store.state.locale)}}</p>
    <img :src="getImg(1)"/>
    <br>

    <p>{{"luadebugDesc2" | t($store.state.locale)}}</p>
    <img :src="getImg(2)"/>
    <br>

    <p>{{"luadebugDesc3" | t($store.state.locale)}} <pre>--luadebug</pre> :</p>
    <img :src="getImg(3)"/>
    <br>

    <p>{{"luadebugDesc4" | t($store.state.locale)}}</p>
    <img :src="getImg(4)"/>
    <br>

    <big-button @onClick="$router.push('/')">{{"back" | t($store.state.locale)}}</big-button>
  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue'

export default {
  components: { BigButton },
  name: 'luadebugScreen',

  methods: {
    getImg(num) {
      return require(`../assets/luadebug/${this.$store.state.locale}/${num}.jpg`)
    }
  }
}
</script>

<style lang="scss">
.luadebugScreen {
  max-width: 930px;
  margin: 0 auto;
  p {
    text-align: left;
    padding-left: 20px;
    font-size: 21px;
  }

  img {
    margin-bottom: 21px;
    object-fit: contain;
    width: inherit;
  }

  pre {
    display: inline;
  }
}

</style>
