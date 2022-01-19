<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <h5>Algoritmos</h5>
                <hr />
                <b-list-group>
                    <b-list-group-item v-for="op in algorithms" :key="op.id" class="p-0 pl-2"
                        :class="{'active-item': selectedAlgorithm === op }">
                        <div class="d-flex w-100 p-1" @click="selectAlgorithm(op)" role="button">
                            <b-form-checkbox switch>
                            </b-form-checkbox>
                            {{op.name}}
                        </div>
                    </b-list-group-item>
                </b-list-group>

            </div>
            <div class="col-md-8 col-lg-6 text-justify border-left">
                <h6>{{selectedAlgorithm.name}}</h6>
                <div class="text-justify border-bottom p-2 mb-2">
                    {{selectedAlgorithm.description}}</div>

                <!--
                <div
                    v-for="field in selectedAlgorithm.forms.find(f => f.name === 'Execution').fields">
                    {{field.label}} - {{field.type}}
                    <small class="form-text text-muted">
                        {{field.help}}
                    </small>
                </div>
            -->
                <div v-for="(form, index) in getExecutionForm()" v-bind:key="form.id">
                    <div v-for="field in form.fields" class="mb-2 property clearfix" v-bind:key="field.name"
                        :data-name="field.name"
                        v-if="getWidget(field) !== 'attribute-selector-component' && !unsupportedParameters.has(field.name) ">
                        <keep-alive>
                            <component :is="getWidget(field)" :field="field" :value="getFieldValue(field)"
                                :language="$root.$i18n.locale" :type="field.suggested_widget" :small="true"
                                :read-only="!field.editable" context="context">
                            </component>
                        </keep-alive>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        props: {
            algorithms: {type: Array},
        },
        data(){
            return {selectedAlgorithm: {}}
        },
        methods: {
            getExecutionForm() {
                if (this.selectedAlgorithm && this.selectedAlgorithm.forms) {
                    const result = this.selectedAlgorithm.forms.filter(f => f.category === 'execution');
                    return result;
                } else {
                    console.debug(this.selectedAlgorithm, this.selectedAlgorithm.forms);
                    return [];
                }
            },
        },
    }
</script>