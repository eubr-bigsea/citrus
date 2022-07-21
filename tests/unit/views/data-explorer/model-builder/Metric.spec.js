import { shallowMount } from '@vue/test-utils'
import Metric from '@/views/data-explorer/model-builder/Metric.vue'

describe('Metric.vue', () => {
    const fieldsMap = new Map();
    const tasks = ['binary-classification',
        'multiclass-classification', 'regression', 'clustering'];
    fieldsMap.set('task_type', { values: tasks.map(t => { return { key: t } }) });

    const binClassMetrics = ['areaUnderROC', 'areaUnderPR'];
    const multiClassMetrics = ['accuracy', 'f1', 'weightedPrecision', 'weightedRecall'];
    const clusteringMetrics = ['silhouette'];
    const regressionMetrics = ['rmse', 'mse', 'mae', 'mape', 'r2'];

    const setFieldMapValues = (fm, fmName, values) => {
        fm.set(fmName, {
            values: values.map(t => { return { key: t } })
        });
    }
    setFieldMapValues(fieldsMap, 'multi_metric', multiClassMetrics);
    setFieldMapValues(fieldsMap, 'bin_metric', binClassMetrics);
    setFieldMapValues(fieldsMap, 'reg_metric', regressionMetrics);
    setFieldMapValues(fieldsMap, 'clust_metric', clusteringMetrics);
    
    const getSelectOptionValues = (select) => {
        const options = select.findAll('option');
        const selectValues = [];

        for (let i = 0; i < options.length; i++) {
            selectValues.push(options.at(i).element.value);
        }
        return selectValues;
    }

    it('renders task', () => {
        const wrapper = shallowMount(Metric, {
            propsData: {
                evaluator: {
                    forms: {
                        task_type: { value: '' }
                    },
                    operation: { fieldsMap }
                }
            }
        });
        const selectValues = getSelectOptionValues(
            wrapper.find("[data-test='type']"));
        expect(selectValues).toEqual(tasks);
        expect(wrapper.find("[data-test='metric']").exists()).toBe(false);
    });
    it('renders binary classification metric', () => {
        const wrapper = shallowMount(Metric, {
            propsData: {
                evaluator: {
                    forms: {
                        task_type: { value: 'binary-classification' },
                        bin_metric: { value: '' }
                    },
                    operation: { fieldsMap, }
                }
            }
        });
        const selectValues = getSelectOptionValues(
            wrapper.find("[data-test='bin-classification']"));
        expect(selectValues).toEqual(binClassMetrics);
    });
    it('renders multiclass classification metric', () => {
        const wrapper = shallowMount(Metric, {
            propsData: {
                evaluator: {
                    forms: {
                        task_type: { value: 'multiclass-classification' },
                        multi_metric: { value: '' }
                    },
                    operation: { fieldsMap, }
                }
            }
        });
        
        const selectValues = getSelectOptionValues(
            wrapper.find("[data-test='multiclass-classification']"));
        expect(selectValues).toEqual(multiClassMetrics);
    });
    it('renders clustering metric', () => {
        const wrapper = shallowMount(Metric, {
            propsData: {
                evaluator: {
                    forms: {
                        task_type: { value: 'clustering' },
                        clust_metric: { value: '' }
                    },
                    operation: { fieldsMap, }
                }
            }
        });
        const selectValues = getSelectOptionValues(
            wrapper.find("[data-test='clustering']"));
        expect(selectValues).toEqual(clusteringMetrics);
    });
    it('renders regression metric', () => {
        const wrapper = shallowMount(Metric, {
            propsData: {
                evaluator: {
                    forms: {
                        task_type: { value: 'regression' },
                        reg_metric: { value: '' }
                    },
                    operation: { fieldsMap, }
                }
            }
        });
        const selectValues = getSelectOptionValues(
            wrapper.find("[data-test='regression']"));
        expect(selectValues).toEqual(regressionMetrics);
    });
})
