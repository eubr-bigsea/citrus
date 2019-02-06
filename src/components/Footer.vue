<template>
  <div>
    <hr>
    <ul class="footer-list">
      <li>
        <span>© 2019 Lemonade Project</span>
      </li>
      <li>
        <a href="http://www.lemonade.org.br/" target="_blank">About</a>
      </li>
      <li>
        <a href="http://www.lemonade.org.br/reference" target="_blank">Documentation</a>
      </li>
      <li>
        <a href="https://github.com/eubr-bigsea/docker-lemonade" target="_blank">GitHub</a>
      </li>
    </ul>
  </div>
</template>

<style>
.footer-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-bottom: 40px;
}

.footer-list span {
  color: #586069;
}

.footer-list > li {
  margin-right: 16px;
}
</style>

<script>
export default {
  name: "l-footer"
}
</script>

