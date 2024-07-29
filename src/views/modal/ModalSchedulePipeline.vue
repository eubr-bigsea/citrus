<template>
    <b-modal ref="scheduleModal" title="Agendar pipeline" button-size="sm" @ok="confirm" :ok-disabled="!month || !year" size="lg">
        <h6>{{ id }} - {{ name }}</h6>
        <p>
            Informe o mês de referência de agendamento da pipeline.
            Atualmente, você deve usar esta função apenas se a periodicidade
            da pipline é mensal. Desta forma, informe como data inicial e a
            data final como o primeiro e último dias do mês, respectivamente.

        </p>
        <div class="row">
            <div class="col-6">
                <select class="form-control form-control-sm" v-model.number="month">
                    <option></option>
                    <option v-for="m, i in getMonthNames" :value="i + 1">
                        {{ m }}
                    </option>
                </select>
            </div>
            <div class="col-3">
                <select class="form-control form-control-sm" v-model.number="year">
                    <option></option>
                    <option v-for="year in getYears" :value="year">
                        {{ year }}
                    </option>
                </select>

            </div>
        </div>

        <!--
        <b-form-group>
            <label>Data inicial de referência</label>
            <b-form-datepicker :date-disabled-fn="dateDisabled('first')" locale="pt" />
        </b-form-group>
        <b-form-group>
            <label>Data final de referência</label>
            <b-form-datepicker :date-disabled-fn="dateDisabled('last')" locale="pt" />
        </b-form-group>
        -->
    </b-modal>
</template>

<script>
import axios from 'axios';
import { BModal } from 'bootstrap-vue';
import { pt } from 'date-fns/locale';
import { format } from 'date-fns';

export default {
    components: {
        BModal,
    },
    emits: ['on-schedule-pipeline'],
    data() {
        return {
            month: null,
            year: null,
            name: null,
            id: null,
        }
    },
    computed: {
        getMonthNames() {
            const monthNames = [];
            for (let i = 0; i < 12; i++) {
                const date = new Date(2021, i, 1); // Using any year, 2021 here
                const monthName = format(date, 'MMMM', { locale: pt });
                monthNames.push(monthName);
            }
            return monthNames;
        },
        getYears() {
            const years = [];
            let currentYear = new Date().getYear();
            let maxYears = 5;
            do {
                years.push(currentYear + 1900); //First year in JS is 1900!
                currentYear--;
                maxYears--;
            } while (maxYears > 0);
            return years;
        }
    },
    methods: {
        show(id, name) {
            this.id = id;
            this.name = name;
            this.$refs.scheduleModal.show();
        },
        confirm() {
            this.$emit('on-schedule-pipeline', this.id,
                new Date(this.year, this.month, 1),
                new Date(this.year, this.month + 1, 0));
        },
        dateDisabled(type) {
            function f(ymd, date) {
                const day = date.getDate();
                const month = date.getMonth();
                if (type === 'first') {
                    return day !== 1;
                } else if (type === 'last') {
                    const nextDay = new Date(date.getTime());
                    nextDay.setDate(nextDay.getDate() + 1);
                    return (nextDay.getMonth() === month);
                }
            };
            return f;
        },
    }

};

</script>
