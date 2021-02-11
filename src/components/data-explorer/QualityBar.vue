<template>
    <div class="clearfix border">
        <div class="bar quality-ok" :style="{width: 100 * percentOk + '%'}" :title="`${$t('dataExplorer.ok')}: ${$options.filters.localePercent(percentOk)}`"></div>
        <div class="bar quality-missing" :style="{width: 100 * percentMissing + '%'}" :title="`${$t('dataExplorer.missing')}: ${$options.filters.localePercent(percentMissing)}`">
        </div>
        <div class="bar quality-nok" :style="{width: 100 * percentInvalid + '%'}" :title="`${$t('dataExplorer.invalid')}: ${$options.filters.localePercent(percentInvalid)}`">
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            attribute: {
                type: Object,
                default: () => {
                    return { count: 1, missing_count: 0, invalid_count: 0 }
                }
            }
        },
        computed: {
            percentOk() {
                return this.attribute
                    ? (this.attribute.count - this.attribute.missing_count - this.attribute.invalid_count)
                    / this.attribute.count : 0;
            },
            percentMissing() {
                return this.attribute
                    ? this.attribute.missing_count / this.attribute.count : 0;
            },
            percentInvalid() {
                return this.attribute
                    ? this.attribute.invalid_count / this.attribute.count : 0;
            }
        },
    }
</script>
<style>
    .bar {
        cursor: pointer;
        float: left;
        height: 8px;
    }

    .quality-ok {
        background: #3D9970;
    }

    .quality-ok-text {
        color: #3D9970;
    }

    .quality-nok {
        background: #FF4136;
    }

    .quality-nok-text {
        color: #FF4136;
    }

    .quality-missing {
        background: #FFDC00;
    }

    .quality-missing-text {
        color: #FFDC00;
    }

    .quality-other {
        background: #0074D9
    }
</style>