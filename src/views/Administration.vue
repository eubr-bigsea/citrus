<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col-md-12">
            <b-tabs>
              <b-tab active>
                <template slot="title">
                  <font-awesome-icon icon="fa fa-user" />
                  {{$tc('titles.user', 2)}}
                </template>
                <br>I'm the first fading tab
              </b-tab>
              <b-tab title="second">
                <br>I'm the second tab content
              </b-tab>
              <b-tab title="disabled" disabled>
                <br>Disabled tab!
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {};
</script>

