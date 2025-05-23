<template>
  <div id="Footer" class="prevent-select cursor-default">
    <div id="FloatingInfo" class="hidden">
      <div id="ServerDate" class="text-left">Release Date: {{ serverInfo?.ngenCerf_date }}</div>
    </div>
    <div class="grid grid-rows-1 gap-1">
      <div class="row-span-1 footerColor text-sm">
        <div id="FooterData" class="version">
          <span @mouseenter="showServerInfo" @mouseleave="hideServerInfo">Version:
            {{ serverInfo?.ngenCerf_version }}</span>
        </div>
        <div class="copyright">Copyright {{ serverInfo?.ngenCerf_copyright}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";

const { serverInfo } = generalStore();

const showServerInfo = () => {
  const e = document.getElementById('FloatingInfo');
  (e as HTMLElement).style.display = "inline-block"
}

const hideServerInfo = () => {
  const e = document.getElementById('FloatingInfo');
  (e as HTMLElement).style.display = "none"
}


</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss';
@use '@/assets/styles/styles.scss';

#FloatingInfo {
  position:sticky;
  margin-left: 20px;
  height: 2em;
  font-size: 0.8em;
  z-index: 9999;
}

#AppDate, #ServerDate {
  border: 2px solid black;
  padding: 5px;
  border-radius: 10px;
  background-color: white;
}
#Footer {
  font-size: 18px;
  font-family: NeueFrutigerWorld-Book, sans-serif;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: black;
  z-index: 9;

}

#FooterData {
  height: 40px;
  z-index: 9;
}

.footerColor {
  background-color: global.$ngwcp_background;
}

.version,
.copyright {
  display: block;
  margin-top: 16px;
}

.version {
  float: left;
  margin-left: 20px;
}

.copyright {
  float: right;
  margin-right: 20px;
}
</style>
