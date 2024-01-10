<script>
import {h} from 'vue';

export default {
    setup(props, { slots }) {
        return () => h('style', slots.default());
    }
}
</script>