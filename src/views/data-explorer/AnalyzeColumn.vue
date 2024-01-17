<template>
    <div>
        <b-modal ref="modal"
                 size="lg"
                 body-class="analyze-modal">
            <template #modal-title>
                <b-button size="sm"
                          variant="link">
                    <font-awesome-icon icon="fa fa-chevron-left" />
                </b-button>
                <b-button size="sm"
                          variant="link">
                    <font-awesome-icon icon="fa fa-chevron-right" />
                </b-button>
                COLUMN_NAME (999 distinct values)
            </template>
            <template #footer>
                &nbsp;
            </template>
            <div>
                <b-tabs small
                        card
                        fill>
                    <b-tab title="Categorical">
                        <div class="row">
                            <div class="col-md-4 small-text">
                                <strong class="text-uppercase">Sumário</strong>
                                <QualityBar />
                                <table class="table table-condensed table-sm table-borderless">
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-ok-text" /> Valid
                                        </td>
                                        <td class="text-right">
                                            21
                                        </td>
                                        <td class="text-right">
                                            10%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-nok-text" /> Invalid
                                        </td>
                                        <td class="text-right">
                                            221
                                        </td>
                                        <td class="text-right">
                                            80%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-missing-text" />
                                            Missing
                                        </td>
                                        <td class="text-right">
                                            1
                                        </td>
                                        <td class="text-right">
                                            1%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unique</td>
                                        <td class="text-right">
                                            21
                                        </td>
                                        <td class="text-right">
                                            10%
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-8">
                                <table class="table table-sm table-striped small-text no-border-row1">
                                    <thead>
                                        <tr>
                                            <th class="w-70" />
                                            <th class="w-10 text-right">
                                                Count
                                            </th>
                                            <th class="w-10 text-right">
                                                %
                                            </th>
                                            <th class="w-10 text-right">
                                                Cumul. %
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                MG
                                                <div class="quality-other border"
                                                     style="width:72%; height: 6px">
                                                    &nbsp;
                                                </div>
                                            </td>
                                            <td class="text-right">
                                                232
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                SP
                                                <div class="quality-other"
                                                     style="width:22%; height: 6px">
                                                    &nbsp;
                                                </div>
                                            </td>
                                            <td class="text-right">
                                                232
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                RJ
                                                <div class="quality-other"
                                                     style="width:43%; height: 6px">
                                                    &nbsp;
                                                </div>
                                            </td>
                                            <td class="text-right">
                                                232
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                            <td class="text-right">
                                                13%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Numerical">
                        <div class="row">
                            <div class="col-md-4 small-text">
                                <strong class="text-uppercase">Sumário</strong>
                                <QualityBar />
                                <table class="table table-condensed table-sm table-borderless">
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-ok-text" /> Valid
                                        </td>
                                        <td class="text-right">
                                            21
                                        </td>
                                        <td class="text-right">
                                            10%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-nok-text" /> Invalid
                                        </td>
                                        <td class="text-right">
                                            221
                                        </td>
                                        <td class="text-right">
                                            80%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <font-awesome-icon icon="fa fa-circle"
                                                               class="quality-missing-text" />
                                            Missing
                                        </td>
                                        <td class="text-right">
                                            1
                                        </td>
                                        <td class="text-right">
                                            1%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unique</td>
                                        <td class="text-right">
                                            21
                                        </td>
                                        <td class="text-right">
                                            10%
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-8">
                                <Plotly :data="chart.data"
                                        :layout="chart.layout"
                                        :options="chart.options" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <table class="table table-condensed table-sm small-text">
                                    <tr>
                                        <th class="text-uppercase">
                                            Statistics
                                        </th>
                                        <th class="text-uppercase">
                                            Top values
                                        </th>
                                        <th class="text-uppercase">
                                            Outliers
                                        </th>
                                        <th class="text-uppercase">
                                            Top invalids
                                        </th>
                                    </tr>
                                    <tr class="text-center">
                                        <td>
                                            <table class="table table-sm table-borderless">
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-left">
                                                        Min
                                                    </th>
                                                    <td>12</td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table class="table table-sm table-borderless">
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                            </table>
                                        </td>

                                        <td>
                                            <table class="table table-sm table-borderless">
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-left">
                                                        Min
                                                    </td>
                                                    <td>12</td>
                                                    <td>12%</td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table class="table table-sm table-borderless">
                                                <tr>
                                                    <td class="text-left">
                                                        343434
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </b-tab>

                    <b-tab title="Group values" />
                </b-tabs>
            </div>
        </b-modal>
    </div>
</template>
<script>

import QualityBar from './QualityBar.vue';
import Plotly from '../../components/visualization/Plotly.vue';

export default {
    components: {
        QualityBar, Plotly
    },
    data() {
        return {
            chart: {
                options: { displayModeBar: false },
                data: [
                    {
                        x: ['Giraffes', 'orangutans', 'monkeys', 'Gnus',
                            'Gorillas', 'Lions'],
                        y: [20, 14, 23, 13, 5, 33],
                        type: 'bar'
                    }
                ],
                layout: {
                    autosize: true,
                    margin: {
                        l: 0,
                        r: 0,
                        b: 50,
                        t: 10,
                        pad: 1
                    },
                    width: 400,
                    height: 150,
                    displayModeBar: false
                }
            }

        };
    },
    methods: {
        show() {
            this.$refs.modal.show();
        }
    },
};
</script>
<style>
    .analyze-modal {
        padding: 0;
    }

    .small-text {
        font-size: .7em;
    }

    .w-70 {
        width: 70%;
    }

    .no-border-row1>thead>tr:first-child>th {
        border: none;
    }
</style>