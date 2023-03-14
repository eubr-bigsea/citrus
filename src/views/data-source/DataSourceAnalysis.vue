<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="title">
                        <h1>{{ $tc('titles.dataSource', 1) }}</h1>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <data-source-options selected="dataSourceAnalysis" />
                        </div>
                        <div class="col-md-10">
                            FIXME
                            {{ dataSource.format === 'CSV' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios';
import DataSourceOptions from '../../components/data-source/DataSourceOptions.vue';
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
  components: {
      DataSourceOptions
  },
  data() {
      return {
          dataSource: null,
      }
  },
  mounted() {
      this.load();
  },
  methods: {
      async load() {
          const resp = await axios.get(
              `${limoneroUrl}/datasources/${this.$route.params.id}`);
          this.dataSource = resp.data;
      },
  },
}
</script>