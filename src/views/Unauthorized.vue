<template>
    <div class="d-flex mt-4">

        <div class="">
            <svg width="250" height="250" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="red" stroke="white"
                    stroke-width="3" />
                <polygon points="33,10 67,10 90,33 90,67 67,90 33,90 10,67 10,33" fill="none" stroke="white"
                    stroke-width="3" />
                <text x="50" y="55" font-size="20" font-weight="bold" fill="white" text-anchor="middle"
                    font-family="Arial">
                    {{ $tc('titles.stop').toUpperCase() }}
                </text>
            </svg>
        </div>
        <div class="ml-4 mt-5">
            <h1>403</h1>
            <p>{{ $t('titles.unauthorized') }}</p>
            <div>
                <router-link :to="{ name: 'home' }" class="btn btn-primary btn-sm">
                    {{ $tc('actions.back') }}
                </router-link>
            </div>
        </div>
    </div>
</template>
