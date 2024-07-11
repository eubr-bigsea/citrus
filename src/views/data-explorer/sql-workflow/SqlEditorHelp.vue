<template>
    <b-tabs>
        <b-tab title="SQL" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="p-2 builder-help">
                <p>
                    O Lemonade oferece as seguintes funções que podem ser usadas em comandos SQL:
                <dl>
                    <dt>validate_codes(texto): boolean</dt>
                    <dd>Valida se um <code>texto</code> é CPF ou CNPN válido</dd>
                    <dt>physical_or_legal_person(texto): string</dt>
                    <dd>Identifica, a partir do <code>texto</code>, é uma pessoa física (<code>texto</code> é CPF) ou
                        pessoa jurídica (<code>texto</code> é CNPN)</dd>
                    <dt>date_patterning(texto): string</dt>
                    <dd>Formata <code>texto</code> representando uma data para o formato dd/MM/yyyy</dd>
                    <dt>strip_accents(texto): string</dt>
                    <dd>Remove todos os acentos de <code>texto</code></dd>
                </dl>
                </p>
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
        <b-tab title="Python" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="p-2 builder-help">
                <p>
                    Ao usar um comando do tipo Python, você tem acesso aos seguintes objetos e funções:
                <dl>
                    <dt>spark_session</dt>
                    <dd>Sessão do Apache Spark.</dd>
                    <dt>get_hwc_connection()</dt>
                    <dd>Retorna uma conexão ao Hive Warehouse Connector e permite usar os métodos
                        <code>execute()</code>,
                        <code>executeQuery()</code> e <code>executeUpdate()</code> do Hive.
                    </dd>
                    <dt>notify(message: string, type: string)</dt>
                    <dd>Permite enviar notificações para a interface. Por exemplo, você pode enviar um texto de
                        depuração usando:
                        <p><code>notify(message=f'O valor do atributo é {valor}', type='TEXT')</code></p>
                    </dd>

                </dl>
                </p>
            </div>
        </b-tab>
        <b-tab :title="$tc('common.attribute', 2)" :title-link-class="'small-nav-link'" title-item-class="small-tab">
            <div class="help-div scroll-area">
                <table class="table table-small table-sm">
                    <tbody>
                        <template v-for="ds in dataSources">
                            <tr>
                                <th class="bg-light text-black" colspan="2">
                                    {{ ds.name }}
                                    <br />{{ ds.alias }}
                                </th>
                            </tr>
                            <tr v-for="attr in ds.attributes">
                                <td>{{ attr.name }}</td>
                                <td>{{ attr.type }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </b-tab>
    </b-tabs>
</template>
<script setup>
import { defineProps } from 'vue'

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
    font-size: 1em
}
</style>