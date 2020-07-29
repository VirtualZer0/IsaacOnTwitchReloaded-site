<template>
  <div class="chatScreen">
    
    <div class="panel-container">
      <div class="panel">
        <h2>{{"status" | t($store.state.locale)}}</h2>
        <div class="textline">{{"connected" | t($store.state.locale)}}</div>
        <div>00:00</div>
      </div>

      <div class="panel">
        <h2>{{"viewers" | t($store.state.locale)}}</h2>
        <div class="textline">0 {{"total" | t($store.state.locale)}}</div>
        <div class="textline">0 {{"active" | t($store.state.locale)}}</div>
      </div>

      <div class="panel">
        <h2>{{"services" | t($store.state.locale)}}</h2>
        <div class="textline youtube">YouTube: {{"no" | t($store.state.locale)}}</div>
        <div class="textline twitch">Twitch: {{"no" | t($store.state.locale)}}</div>
      </div>

    </div>

  </div>
</template>