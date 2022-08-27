<script setup lang="ts">
</script>

<template>
  <div>
    <ul class="album">
      <li>
        <div>08</div>
        <div></div>
        <div></div>
        <div>2022</div>
      </li>
      <li>
        <ul>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
        </ul>
      </li>
    </ul>
    <ul class="album">
      <li>
        <div>07</div>
        <div></div>
        <div></div>
        <div>2022</div>
      </li>
      <li>
        <ul>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
        </ul>
      </li>
    </ul>
    <ul class="album">
      <li>本周新碟</li>
      <li>
        <ul>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
          <li>11111111</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.album {
  display: flex;

  &>li:nth-child(1) {
    width: 7.5rem;
    height: 100%;
    position: sticky;
    top: 0;
    text-align: center;

    div {
      font-family: serif;
      line-height: 1;

      &:nth-child(1) {
        font-size: 3.5rem;
        font-weight: bolder;
      }

      &:nth-child(2) {
        position: absolute;
        width: 7rem;
        height: 7rem;
        left: 1rem;
        border-radius: 20%;
        transform: translate(2px, -6.5px) rotate(-20deg);
        box-shadow: 0 2px 10px 1px black;
        z-index: 1;
      }

      &:nth-child(3) {
        position: absolute;
        width: 11rem;
        height: 11rem;
        z-index: 1;
        border-radius: 20%;
        transform: translateY(-8.5px) rotate(-20deg);
        background: white;
      }

      &:nth-child(4) {
        font-size: 2.2rem;
        font-weight: bolder;
        position: relative;
        z-index: 2;
      }
    }
  }

  li:nth-child(2) {
    flex: 1;
    position: relative;
    z-index: 3;

    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, 8rem);
      justify-content: space-around;
      gap: 0 1rem;

      li {
        width: 8rem;
        height: 8rem;
      }
    }
  }
}
</style>