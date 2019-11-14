<template>
    <footer class="footer-page fixed-bottom">
        <hr />
        <ul class="footer-list">
            <li>
                <span>© 2019 Lemonade Project</span>
            </li>
            <li>
                <a href="https://docs.lemonade.org.br/" target="_blank">About</a>
            </li>
            <li>
                <a href="https://docs.lemonade.org.br/pt-br/spark/visualizacao-de-dados/tabela.html" target="_blank">
                    Documentation
                </a>
            </li>
            <li>
                <a href="https://github.com/eubr-bigsea/docker-lemonade" target="_blank">
                    GitHub
                </a>
            </li>
        </ul>
    </footer>
</template>

<style>
    hr {
        margin: 10px -15px !important;
    }

    .footer-list {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
        font-size: 12px;
        padding-bottom: 6px;
        padding-left: 15px;
    }

    .footer-list span {
        color: #586069;
    }

    .footer-list>li {
        margin-right: 16px;
    }
</style>

<script>
    export default {
        name: 'LFooter'
    };
</script>