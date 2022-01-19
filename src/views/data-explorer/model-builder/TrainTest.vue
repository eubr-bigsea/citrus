<template lang="">
    <div>
        <h5>Divisão entre treino e teste</h5>
        <hr />
        <label for="">Estratégia de particionamento:</label> &nbsp;
        <select name="" id="" class="form-control w-50 form-control-sm">
            <option>Dividir aleatoriamente</option>
            <option>Dividir estratificado</option>
        </select>
        <small class="form-text text-muted">
            Como dividir os dados de entrada entre treino e teste.
        </small>

        <label for="">Razão treino/teste:</label> &nbsp;
        <input type="number" class="form-control form-control-sm w-10" min="0.01" max="0.99" step="0.01">
        <small class="form-text text-muted">
            Entre 0,01 e 0,99 (1% e 99%). Por exemplo, 0,8 significa 80% dos
            dados destinados ao treino e 20% ao teste.
        </small>

        <label for="">Semente para números aleatórios (seed):</label> &nbsp;
        <input type="number" class="form-control form-control-sm w-10" min="0">
        <small class="form-text text-muted">
            Semente usada para poder repetir o experimento.
        </small>
    </div>
</template>
<script>
    export default {

    }
</script>