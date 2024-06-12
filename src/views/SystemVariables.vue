<template>
    <div>
        <div class="col-md-12 mt-1">
            <table class="table table-sm table-bordered" style="font-size:.8em">
                <tr v-for="v in allVariables" :key="v">
                    <td style="width:20%">
                        <code v-html="'${' + v + '}'" />
                    </td>
                    <td>
                        {{$tc('variables.names.' + v)}}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        otherVariables : {
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
                'second', 'minute', 'hour', 'day', 
                'week_day', 'month', 'year', 'year2',
                'date', 'date_at_min', 'date_at_max',
                'now', 'user_id', 'user_login', 
                'user_email', 'user_name'],
        };
    },
}
</script>