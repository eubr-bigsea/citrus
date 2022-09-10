<template>
    <footer class="footer-page fixed-bottom d-print-none">
        <ul class="footer-list">
            <li>
                © 2017-2022 Lemonade Project {{$t('common.version')}} {{version}}
            </li>
            <li>
                <a href="https://docs.lemonade.org.br/" target="_blank">
                    {{$t('titles.about')}}
                </a>
            </li>
            <li>
                <a href="https://docs.lemonade.org.br/pt-br/spark/visualizacao-de-dados/tabela.html" target="_blank">
                    {{$t('titles.documentation')}}
                </a>
            </li>
            <li>
                <a href="https://github.com/eubr-bigsea/docker-lemonade" target="_blank">
                    GitHub
                </a>
            </li>
            <li v-if="instance">
                {{instance}}
            </li>
        </ul>

    </footer>
</template>

<style>
    .footer-page a,
    .footer-page {
        color: var(--forecolor-nav);
        background-color: var(--color-nav);
        padding-left: 50px;
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

    .footer-list>li {
        margin-right: 16px;
    }
</style>

<script>
    export default {
        name: 'LFooter',
        computed: {
            version() {
                return process.env.VUE_APP_VERSION || '2.0.0';
            },
            instance() {
                return process.env.VUE_APP_INSTANCE;
            }
        }
    };
</script>