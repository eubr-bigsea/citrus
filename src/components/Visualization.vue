<template>
  <div class="row">
    <div class="col-md-12">
      <h3>
        Visualization
      </h3>
      <font-awesome-icon icon="spinner" pulse class="icon" size="3x" v-if="loading"/> 
      {{content}}
      <div v-if="errorState">
            {{errorMessage}}
      </div>
    </div>
  </div>
</template>

<script>
import Notifier from '../mixins/Notifier'
import axios from 'axios'
export default {
    mixins: [Notifier],
    data(){
        return {
            content: '',
            loading: false,
            errorState: false,
            errorMessage: ''
        }
    },
    props: {
        url: '',
    },
    mounted(){
        const self = this
        self.loading = true
        axios.get(this.url).then(
          (resp) => {
              this.content = resp.data
          }
      ).catch(function (e) {
          self.errorState = true;
          self.errorMessage = e.response.data
      }).finally(()=>{
        self.loading = false
      });
    }
}
</script>
