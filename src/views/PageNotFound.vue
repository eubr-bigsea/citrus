<template>
    <div>
        <h1>{{$t('titles.pageNotFound')}}.</h1>
        <p class="border-top mt-2 pt-2">
        <router-link :to="{name: 'home'}" class="btn btn-primary btn-sm">{{$t('actions.back')}}</router-link>
        </p>
    </div>
</template>
export default {
}
