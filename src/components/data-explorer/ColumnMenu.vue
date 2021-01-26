<template lang="">
    <context-menu ref="ctxMenu" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" class="menu" @ctx-close="onCtxClose">
        <!--<li class="ctx-header">{{menuData && menuData.label}}</li>-->
        <template v-if="menuData && menuData.field && !menuData.field.locked">
            <li class="ctx-item" @click="$refs.dataTypeCtxMenu.open($event, {close: false})">
                <b>Change</b> data type...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <span class="fa fa-times text-danger"></span> {{$t('actions.delete')}}
            </li>
            <li class="ctx-item">
                <span class="fa fa-edit text-secondary"></span> {{$t('actions.rename')}}
            </li>
            <li class="ctx-divider"></li>
            <!--<li class="ctx-item disabled">option two (disabled)</li>-->
            <li class="ctx-item">
                <span class="fa fa-chart-bar text-info"></span> {{$t('actions.analyse')}}...
            </li>
            <li class="ctx-item">
                <span class="fa fa-cog"></span> {{$t('actions.editMetadata')}}...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <b>Convert</b> to lowercase
            </li>
            <li class="ctx-item">
                <b>Convert</b> to uppercase
            </li>
            <li class="ctx-item">
                <b>Transform</b> text
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <span class="fa fa-calendar"></span> <b>Parse</b> with numerical range ...
            </li>
            <li class="ctx-item">
                <b>Format</b> date ...
            </li>
            <li class="ctx-item">
                <b>Extract</b> date components ...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <b>Filter</b> with numerical range ...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <b>Remove</b> invalid rows for meaning <em>Integer</em>
            </li>
            <li class="ctx-item">
                <b>Clear</b> invalid cells for meaning <em>Integer</em>
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <b>Filter</b> with numerical range ...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <b>Round</b> to integer
            </li>
            <li class="ctx-item">
                <b>Process</b> with formula...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                More actions...
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <span class="fa fa-filter text-success"></span> Filter
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <span class="fa fa-palette"></span> Color column by value
            </li>
            <li class="ctx-divider"></li>
            <li class="ctx-item">
                <span class="fa fa-lock"></span> <b>Lock</b> column
            </li>
        </template>
        <template v-if="menuData && menuData.field && menuData.field.locked">
            <li class="ctx-item">
                <span class="fa fa-lock-open"></span> <b>Unlock</b> column
            </li>
        </template>
    </context-menu>
</template>
<script>
    import contextMenu from 'vue-context-menu';
    export default {
        components: {contextMenu},
        
        data() {

        },
        methods: {

        },
    }
</script>
<style scoped>
</style>