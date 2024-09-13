<template>
    <b-tabs>
        <b-tab title="SQL" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="p-2 builder-help scroll-area">
                <p>
                    O Lemonade oferece as seguintes funções que podem ser usadas em comandos SQL:
                </p>
                <div>
                    <dl>
                        <dt><code>validate_codes(texto): boolean</code></dt>
                        <dd>Valida se um <code>texto</code> é CPF ou CNPJ válido</dd>
                        <dt><code>physical_or_legal_person(texto): string</code></dt>
                        <dd>
                            Identifica, a partir do <code>texto</code>, é uma pessoa física (<code>texto</code> é CPF)
                            ou
                            pessoa jurídica (<code>texto</code> é CNPJ)
                        </dd>
                        <dt><code>date_patterning(texto): string</code></dt>
                        <dd>Formata <code>texto</code> representando uma data para o formato dd/MM/yyyy</dd>
                        <dt><code>strip_accents(texto): string</code></dt>
                        <dd>Remove todos os acentos de <code>texto</code></dd>
                    </dl>
                </div>
                <p class="border-top pt-2">
                    Para uma lista completa sobre funções suportadas pelo Apache Spark, consulte sua
                    <a href="https://spark.apache.org/docs/latest/api/sql/index.html" target="_blank">
                        documentação.</a>
                </p>
                <!--
                <div style="display:flex; gap: 2px;flex-wrap: wrap;">
                    <span v-for="f in functions" :key="f" ><a class="" :href="`#${f}`">{{ f }}</a> | </span>
                </div>
                -->
            </div>
        </b-tab>
        <b-tab title="Variáveis" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="p-2 builder-help scroll-area">
                <p>
                    Variáveis (do fluxo) são expressões que são substituídas durante a execução pelos respectivos
                    valores, sejam eles informados pelo usuário ou definidos pelo sistema.

                    São identificadas pelo texto <code>${nome}</code>.
                    <br>
                    As variáveis de fluxo também podem aparecer nas informações das fontes de dados.
                    <br> A seguir, a lista de variáveis suportadas:
                </p>
                <dl>
                    <dt><code>${date}</code></dt>
                    <dd>
                        Data atual, no formato aaaa-mm-dd. Para aplicar outros
                        formatos, use a sintaxe: <code>${date|fmt}</code>
                        , onde <code>fmt</code> é um formato compatível com a formatação
                        de datas da linguagem Python. Por exemplo:
                        <code>${date|%Y}</code> imprime somente o ano;
                        <code>${date|%H:M:S}</code> imprime a hora, minuto e segundo;
                        <code>${date|%d%m%y}</code> Imprime dia, mês e ano (com 2 dígitos).
                        Para mais informações, consulte a
                        <a href="https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes">lista
                            de
                            formatos</a> suportados.
                    </dd>
                    <dt><code>${ref}</code></dt>
                    <dd>
                        Data de referência para uma execução de pipeline. Só <strong>existe no contexto de um fluxo em
                            uma
                            pipeline.</strong>.
                        Caso queira simular uma execução no contexto de uma pipeline, defina
                        uma variável de usuário com o nome <code>ref</code>, um valor compatível com data/hora
                        e informe o tipo como sendo "Data".
                        Possui os mesmos recursos de formatação que a variável
                        <code>${date}</code>.
                    </dd>
                    <dt><code>${now}</code></dt>
                    <dd>Data atual, no formato aaaa-mm-dd hh:MM:ss</dd>
                    <dt><code>${user_login}</code></dt>
                    <dd>Login do usuário</dd>
                    <dt><code>${user_name}</code></dt>
                    <dd>Nome do usuário que executa o fluxo</dd>
                    <dt><code>${user_email}</code></dt>
                    <dd>Email do usuário que executa o fluxo</dd>
                    <dt><code>${user_id}</code></dt>
                    <dd>Id do usuário que executa o fluxo</dd>
                    <dt><code>${workflow_name}</code></dt>
                    <dd>Nome do fluxo</dd>
                    <dt><code>${workflow_id}</code></dt>
                    <dd>Id do fluxo</dd>
                    <dt><code>${run_start}</code></dt>
                    <dd>Data de referência</dd>
                    <dt><code>${workflow_id}</code></dt>
                    <dd>Id do fluxo</dd>
                </dl>
            </div>
        </b-tab>

        <b-tab title="Python" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="p-2 builder-help scroll-area">
                <p>
                    Ao usar um comando do tipo Python, você tem acesso aos seguintes objetos e funções:
                </p>
                <dl>
                    <dt><code>spark_session</code></dt>
                    <dd>Sessão do Apache Spark.</dd>
                    <dt><code>get_hwc_connection()</code></dt>
                    <dd>
                        Retorna uma conexão ao Hive Warehouse Connector e permite usar os métodos
                        <code>execute()</code>,
                        <code>executeQuery()</code> e <code>executeUpdate()</code> do Hive.
                    </dd>
                    <dt><code>context[nome] = valor</code></dt>
                    <dd>
                        Define uma variável de contexto chamada <code>nome</code>, com o valor <code>valor</code>.
                        Posteriormente, esta variável poderá ser referenciada nas demais células usando a sintaxe
                        <code>{nome}</code>. Note que estas variáveis não devem ser confundidas com as variáveis
                        do fluxo, identificadas por <code>${nome}</code>.
                    </dd>
                    <dt><code>notify(message: string, type: string)</code></dt>
                    <dd>
                        Permite enviar notificações para a interface. Por exemplo, você pode enviar um texto de
                        depuração usando:
                        <p><code>notify(message=f'O valor do atributo é {valor}', type='TEXT')</code></p>
                    </dd>
                </dl>
            </div>
        </b-tab>
        <b-tab :title="$t('common.attribute', 2)" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="help-div scroll-area">
                <table class="table table-small table-sm">
                    <tbody>
                        <template v-for="ds in dataSources" :key="ds.id">
                            <tr>
                                <th class="bg-light text-black" colspan="2">
                                    {{ds.name}}
                                    <br>{{ds.alias}}
                                </th>
                            </tr>
                            <tr v-for="attr in ds.attributes" :key="attr.name">
                                <td>{{attr.name}}</td>
                                <td>{{attr.type}}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </b-tab>
    </b-tabs>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    dataSources: { type: Array, default: () => [] },
    functions: { type: Array, default: () => [] },
    customFunctions: { type: Array, default: () => [] },
});
</script>
<style>
.small-tab {
    padding: 0;
    margin: 0
}
</style>
<style scoped>
div.help-div {
    max-height: 70vh;
    overflow-y: auto;
    font-size: 1em
}

.builder-help {
    font-size: 1em;
    height: 70vh;
    overflow-y: auto;
}

dt {
    border-bottom: 1px solid#aaa;
    font-weight: bolder !important;
}
</style>