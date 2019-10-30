<template>
    <div class="footer-container">
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
    </div>
</template>

<style>
    .footer-container {
        position: absolute;
        bottom: 0;
        width: calc(100% - 30px);
        background-color: white;
    }

    hr {
        margin-right: -15px;
        margin-left: -15px;
    }

    .footer-list {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
        font-size: 12px;
        margin-bottom: 20px;
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