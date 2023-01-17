import { shallowMount } from '@vue/test-utils'
import TrainTest from '$SRC/views/data-explorer/model-builder/TrainTest.vue'
import Vue from 'vue';

describe('TrainTest.vue', () => {
    const fieldsMap = new Map();
    const tasks = ['binary-classification',
        'multiclass-classification', 'regression', 'clustering'];
    fieldsMap.set('task_type', { values: tasks.map(t => { return { key: t } }) });

    const strategies = ['split', 'cross_validation'];

    const setFieldMapValues = (fm, fmName, values) => {
        fm.set(fmName, {
            values: values.map(t => { return { key: t } })
        });
    }
    setFieldMapValues(fieldsMap, 'strategy', strategies);

    const getSelectOptionValues = (select) => {
        const options = select.findAll('option');
        const selectValues = [];

        //console.debug(select.element.innerHTML)
        for (let i = 0; i < options.length; i++) {
            selectValues.push(options.at(i).element.value);
        }
        return selectValues;
    }

    test('renders train/test form', () => {
        const wrapper = shallowMount(TrainTest, {
            propsData: {
                split: {
                    forms: { strategy: { value: '' } },
                    operation: { fieldsMap }
                }
            }
        });

        const selectValues = getSelectOptionValues(wrapper.find("select"));
        expect(selectValues).toEqual(strategies);
        expect(wrapper.find("[data-test='ratio']").exists()).toBe(false);
        expect(wrapper.find("[data-test='seed']").exists()).toBe(false);
    });
    test('renders train/test form with "split" value selected', () => {
        const wrapper = shallowMount(TrainTest, {
            propsData: {
                split: {
                    forms: {
                        strategy: { value: 'split' },
                        ratio: { value: null },
                        seed: { value: null }

                    },
                    operation: { fieldsMap }
                }
            }
        });

        const selectValues = getSelectOptionValues(wrapper.find("select"));
        expect(selectValues).toEqual(strategies);
        expect(wrapper.find("[data-test='ratio']").exists()).toBe(true);
        expect(wrapper.find("[data-test='seed']").exists()).toBe(true);
    });
    test('renders train/test form with "cross_validation" value selected', () => {
        const wrapper = shallowMount(TrainTest, {
            propsData: {
                split: {
                    forms: {
                        strategy: { value: 'cross_validation' },
                        folds: { value: null },
                        seed: { value: null }

                    },
                    operation: { fieldsMap }
                }
            }
        });
        const selectValues = getSelectOptionValues(wrapper.find("select"));
        expect(selectValues).toEqual(strategies);
        expect(wrapper.find("[data-test='folds']").exists()).toBe(true);
        expect(wrapper.find("[data-test='seed']").exists()).toBe(true);
    });
    test('renders train/test form with "cross_validation" value selected and shows/hides example', async () => {
        const propsData = {
            split: {
                forms: {
                    strategy: { value: 'cross_validation' },
                    folds: { value: 5 },
                    seed: { value: null }

                },
                operation: { fieldsMap }
            }
        };
        const wrapper = shallowMount(TrainTest, {
            propsData
        });
        const selectValues = getSelectOptionValues(wrapper.find("select"));
        expect(selectValues).toEqual(strategies);
        const folds = wrapper.find("[data-test='folds']");
        expect(folds.exists()).toBe(true);
        expect(wrapper.find("[data-test='seed']").exists()).toBe(true);
        const example = wrapper.find("[data-test='example']");
        expect(example.exists()).toBe(true);
        expect(example.find("div.row").length === 6);

        wrapper.setProps({
            split: {
                forms: {
                    folds: { value: 22 },
                    strategy: { value: 'cross_validation' },
                    seed: {value: 300}
                },
                operation: { fieldsMap }
            }
        });
        await Vue.nextTick();
        expect(wrapper.find("[data-test='example']").exists()).toBe(false);
    });
})
