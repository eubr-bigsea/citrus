<template>
    <div class="row lemonade">
        <div class="col-md-3 col-sm-12">
            <div class="jumbotron ">
                <h1 class="display-4">{{$t('titles.lemonadePlatform')}}</h1>
                <p class="lead text-justify">A platform for data science</p>
                <hr class="my-4">
                <p class="text-justify">{{$t('home.welcome')}}</p>
                <p class="lead">
                    <a class="btn btn-primary btn-lg" href="http://www.lemonade.org.br" role="button">{{$t('home.learnMore')}}</a>
                </p>
            </div>
        </div>
        <div class="col-sm-12 col-md-3 border">
            <div class="card text-white mb-3">
                <div class="card-header bg-secondary ">
                    <h5 class="card-title">Recently updated workflows</h5>
                </div>
                <div class="card-body">
                    
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>

        </div>
        <div class="col-sm-12 col-md-3 border">
            <div class="card text-white mb-3">
                <div class="card-header bg-secondary ">
                    <h5 class="card-title">Recently updated data sources</h5>
                </div>
                <div class="card-body">
                    
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-3 border">
            <div class="card text-white mb-3" id="latest-jobs">
                <div class="card-header bg-secondary ">
                    <h5 class="card-title">Latest jobs</h5>
                </div>
                <div class="card-body">
                    
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'home',
        components: {

        },
        mounted(){

        }
    }
</script>
<style scoped>
    .lemonade>div {
        max-height: 95vh;
        overflow: auto;
    }
    .card {
        height: 98%;
        font-size: 2em;
    }
</style>