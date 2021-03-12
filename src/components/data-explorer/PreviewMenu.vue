<template>
    <div class="border-top border-left border-right preview-menu">
        <b-nav pills>
            <b-nav-item-dropdown text="Editar" toggle-class="nav-link-custom" no-caret
                :disabled="selected.key === undefined">
                <b-dropdown-item @click="trigger('renameColumn')">
                    <span class="fa fa-edit text-secondary"></span> {{$t('actions.rename')}} coluna
                </b-dropdown-item>

                <b-dropdown-item class="ctx-divider"></b-dropdown-item>

                <b-dropdown-item @click="trigger('deleteColumn')">
                    <span class="fa fa-times text-danger"></span> {{$t('actions.delete')}} coluna
                </b-dropdown-item>
                <b-dropdown-item @click="trigger('duplicateColumn')" key="actionDuplicate">
                    <span class="fa fa-copy text-secondary"></span> {{$t('actions.duplicate')}}
                    coluna
                </b-dropdown-item>
                <b-dropdown-item @click="trigger('moveColumn')" key="actionMove">
                    <span class="fa fa-arrows-alt-h "></span> {{$t('actions.move')}} coluna
                </b-dropdown-item>
                <!--
                <template v-if="selected.type === 'Array' ">
                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                    <b-dropdown-item key="parseAction">
                        <span class="fa fa-exclamation"></span> <b>Parse</b> with numerical range 
                    </b-dropdown-item>
                </template>
                <template v-if="selected.type === 'Boolean'">
                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                    <b-dropdown-item key="negateAction">
                        <span class="fa fa-exclamation"></span> <b>Negate/invert</b> boolean values 
                    </b-dropdown-item>
                </template>

                <template v-if="selected.type === 'Date' || selected.type == 'Time' ">
                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                    <b-dropdown-item>
                        <span class="fa fa-calendar"></span> <b>Parse</b> with numerical range 
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <b>Format</b> date 
                    </b-dropdown-item>
                    <b-dropdown-item v-if="selected.type === 'Date'">
                        <b>Extract</b> date components 
                    </b-dropdown-item>
                    <b-dropdown-item v-if="selected.type === 'Time'">
                        <b>Extract</b> time components 
                    </b-dropdown-item>
                </template>
                -->
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Transformar" toggle-class="nav-link-custom" no-caret
                :disabled="selected.key === undefined">
                <b-dropdown-item @click="trigger('changeColumnType')">
                    {{$t('actions.changeDataType')}} para coluna
                </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <b-dropdown-item @click="trigger('findAndReplace')" key="findReplace">
                    <span class="fa fa-search"></span> Find in coluna and replace
                </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>

                <b-dropdown-item @click="trigger('transform')" key="transformAction">
                    <span class="fa fa-cogs text-primary"></span> <b>Transform</b> coluna with
                    custom function
                </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <template v-if="selected.type === 'Integer' || selected.type == 'Decimal'">
                    <b-dropdown-item @click="trigger('redefineScale')">
                        <b>Redefine scale of</b> coluna
                    </b-dropdown-item>
                    <b-dropdown-item v-if="selected.type == 'Decimal'" @click="trigger('transform', 'round', selected.label, 0)">
                        <b>Round</b> coluna to integer
                    </b-dropdown-item>
                </template>


                <template v-if="selected.type === 'Integer' || selected.type == 'Decimal' ">
                    <b-dropdown-item>Discretize (bin) (fixed, with/without start; custom)
                    </b-dropdown-item>
                    <b-dropdown-item>Normalize values using (FIXME: MinMax, etc)
                    </b-dropdown-item>
                    <b-dropdown-item>Force numerical range
                    </b-dropdown-item>
                    <b-dropdown-item>Round numbers </b-dropdown-item>
                    <b-dropdown-item>Timestamp to date </b-dropdown-item>
                </template>
                <template v-if="selected.type === 'Text' ">
                    <b-dropdown-item value="toLowerCase" @click="trigger('transform', 'lower', selected.label)">
                        {{$t('dataExplorer.toLowerCase')}}
                    </b-dropdown-item>
                    <b-dropdown-item value="toUpperCase" @click="trigger('transform', 'upper', selected.label)">
                        {{$t('dataExplorer.toUpperCase')}}
                    </b-dropdown-item>
                    <b-dropdown-item @click="trigger('transform', 'title', selected.label)">
                        {{$t('dataExplorer.capitalizeFirst')}}
                    </b-dropdown-item>
                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>

                    <b-dropdown-item @click="trigger('transform', 'strip_accents', selected.label)">
                        {{$t('dataExplorer.removeAccents')}}
                    </b-dropdown-item>
                    <b-dropdown-item>Concatenate with... </b-dropdown-item>
                    <b-dropdown-item @click="trigger('transform', 'trim', selected.label)">Remove initial and final
                        spaces (trim) </b-dropdown-item>
                    <b-dropdown-item @click="trigger('transform', 'substring', selected.label, 0, 10)">
                        {{$t('dataExplorer.truncateToNChars')}} </b-dropdown-item>
                    <b-dropdown-item @click="trigger('transform', 'split', selected.label, '\' \'')">
                        Dividir em palavras </b-dropdown-item>
                    <b-dropdown-item>Split url </b-dropdown-item>
                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                    <b-dropdown-item>Parse to date with custom format </b-dropdown-item>

                    <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                    <b-dropdown-item>Extract numbers </b-dropdown-item>
                    <b-dropdown-item>Extract with regex </b-dropdown-item>

                </template>
                <template v-if="selected.type === 'Array' ">
                    <b-dropdown-item>Extract from array </b-dropdown-item>
                    <b-dropdown-item>Fold an array </b-dropdown-item>
                    <b-dropdown-item>Sort array </b-dropdown-item>
                </template>
                <template v-if="selected.type === 'Datetime' ">
                    <b-dropdown-item>Update hour from </b-dropdown-item>
                    <b-dropdown-item>Truncate hour to 00:00 </b-dropdown-item>
                    <b-dropdown-item>Extract date elements </b-dropdown-item>
                    <b-dropdown-item>Compute difference between dates </b-dropdown-item>
                    <b-dropdown-item>Format date with custom format </b-dropdown-item>
                    <b-dropdown-item>Force date range </b-dropdown-item>
                    <b-dropdown-item>Date to timestamp </b-dropdown-item>
                </template>

            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="(De)codificar" toggle-class="nav-link-custom" no-caret
                :disabled="selected.key === undefined">
                <!--
                <b-dropdown-item key="changeRepresentationAction">
                    <span class="fa fa-cogs text-primary"></span> <b>Change represention</b> with (One-Hot-Encoding)
                    
                </b-dropdown-item>
                -->

                <b-dropdown-item>Encode/Decode URL </b-dropdown-item>
                <b-dropdown-item>Escape XML </b-dropdown-item>
                <b-dropdown-item>Escape Unicode </b-dropdown-item>
                <b-dropdown-item>Stemming </b-dropdown-item>
                <b-dropdown-item>Generate n-grams </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <b-dropdown-item>Pseudoanonymization </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Sinalizar" toggle-class="nav-link-custom" no-caret
                :disabled="selected.key === undefined">
                <b-dropdown-item>
                    <b>Flag</b> rows on range
                </b-dropdown-item>
                <b-dropdown-item>
                    <b>Flag</b> rows with formula
                </b-dropdown-item>
                <b-dropdown-item>
                    <b>Flag</b> invalid rows
                </b-dropdown-item>
                <b-dropdown-item>
                    <b>Flag</b> rows with empty
                </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Corrigir" toggle-class="nav-link-custom" no-caret
                :disabled="selected.key === undefined">
                <template>
                    <b-dropdown-item key="removeRowsEmptyCellsAction">
                        <span class="fa fa-fill-drip text-secondary"></span> Treat <b>empty value(s)</b>
                    </b-dropdown-item>
                    <b-dropdown-item key="fillRowsEmptyCellsAction">
                        <span class="fa fa-exclamation-triangle text-warning"></span> Treat <b>invalid value(s)</b>
                    </b-dropdown-item>

                    <b-dropdown-item>
                        <b>Move</b> invalid cells for meaning Integer to column_invalid.
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <b>Remove</b> invalid cells for meaning Integer to column_invalid.
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <b>Remove</b> rows with no value
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <b>Fill</b> empty rows with
                    </b-dropdown-item>
                    <!--
                    <b-dropdown-item key="removeRowsEmptyCellsAction">
                        <span class="fa fa-times text-danger"></span> <b>Remove rows</b> with empty cell(s)
                    </b-dropdown-item>
                    <b-dropdown-item key="fillRowsEmptyCellsAction">
                        <span class="fa fa-fill-drip text-secondary"></span> <b>Fill empty cells</b> with 
                    </b-dropdown-item>
                    -->
                    <!--
                    <b-dropdown-item>
                        <b>Remove invalid rows</b> for meaning <em>{{selected.type}}</em>
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <b>Clear invalid cells</b> for meaning <em>{{selected.type}}</em>
                    </b-dropdown-item>
                    -->
                </template>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Dados" toggle-class="nav-link-custom" no-caret>

                <b-dropdown-item key="sortAsc" @click="trigger('sort', 'asc')" v-show="selected.key !== undefined">
                    <span class="fa fa-sort-alpha-up text-secondary"></span> <b>{{$t('actions.sort')}}</b> by
                    {{selected.label}} (ASC)
                </b-dropdown-item>
                <b-dropdown-item key="sortDesc" @click="trigger('sort', 'desc')" v-show="selected.key !== undefined">
                    <span class="fa fa-sort-alpha-down text-secondary"></span> <b>{{$t('actions.sort')}}</b> by
                    {{selected.label}} (DESC)
                </b-dropdown-item>
                <b-dropdown-item key="sortMultiple" @click="trigger('sortMultiple')">
                    <span class="fa fa-sort text-secondary"></span> <b>{{$t('actions.sort')}} por ...</b>
                </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <b-dropdown-item>
                    <span class="fa fa-filter text-success"></span> {{$t('actions.filter')}}
                </b-dropdown-item>
                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <b-dropdown-item>{{$t('actions.groupData')}}...</b-dropdown-item>
                <b-dropdown-item>{{$t('actions.joinData')}}...</b-dropdown-item>
                <b-dropdown-item>{{$t('actions.appendData')}}...</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>{{$t('actions.sample')}}...</b-dropdown-item>
                <b-dropdown-item>{{$t('actions.limit')}}...</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item>{{$t('actions.applyWindowFunction')}}...</b-dropdown-item>

                <b-dropdown-item class="ctx-divider"></b-dropdown-item>
                <b-dropdown-item @click="$refs.modalAnalyse.show()">
                    <span class="fa fa-chart-bar text-info"></span> Analisar
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </b-nav>
        <b-nav v-if="selected.label" class="mr-4 font-weight-bold">
            <b-nav-text><span class="fa fa-chevron-right"></span> {{selected.label}}</b-nav-text>
        </b-nav>
    </div>
</template>
<script>
    export default {
        props: {
            selected: { type: Object, default: () => ({}) }
        },
        methods: {
            trigger(action, ...params) {
                this.$emit('select', { action, params })
            }
        }
    }
</script>
<style scoped>
    .preview-menu>>>.nav-pills a.dropdown-toggle {
        border-radius: 0 !important;
        padding: 1px inherit;
        font-size: 10pt;
    }

    .preview-menu>>>li {
        font-size: 10pt;
        padding: 1px inherit;
    }

    .preview-menu>>>.dropdown-menu li {
        font-size: 10pt;
        padding: 0px;
        margin: 0px;
    }

    .preview-menu>>>.dropdown-menu li a {
        padding: 3px 24px;
    }

    .preview-menu>>>li hr {
        padding: 0;
        margin: 0;
    }

    .preview-menu {
        display: flex;
        justify-content: space-between;
    }
</style>