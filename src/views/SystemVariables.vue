<template>
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
        <dd>Data de referência para uma execução de pipeline. Só existe no contexto de um fluxo em uma
            pipeline.</strong>
            Caso queira simular uma execução no contexto de uma pipeline, defina
            uma variável de usuário com o nome <code>ref</code>, um valor compatível com data/hora
            e informe o tipo como sendo "Data".
            Possui os mesmos recursos de formatação que a variável
            <code>${date}</code>.
        </dd>
        <dt><code>${run_start}</code></dt>
        <dd>Data de referência (somente quando executado no contexto de uma pipeline)</dd>
        <dt><code>${now}</code></dt>
        <dd>Data atual, no formato aaaa-mm-dd hh:MM:ss</dd>
        <dt><code>${user_login}, ${user_name}, ${user_email} e ${user_id}</code></dt>
        <dd>Respectivamente, o login do usuário, seu nome, e-mail e identificador.</dd>
        <dt><code>${workflow_id} e ${workflow_name}</code></dt>
        <dd>Identificador e nome do fluxo</dd>

    </dl>
</template>
<script>
export default {
    props: {
        otherVariables: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        allVariables() {
            return [...this.variables, ...this.otherVariables];
        },
    },
    data() {
        return {
            variables: [
                'date', 'date_at_min', 'date_at_max', 'now', 'user_id',
                'user_login', 'user_name'],
        };
    },
}
</script>
<style>
dl {
    font-size: .9em;
    line-height: 1.5;

}
</style>