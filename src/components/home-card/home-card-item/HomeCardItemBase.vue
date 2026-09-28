<template>
    <div class="home-card-item">
        <div>
            <b>
                <slot name="head" />
            </b>
        </div>
        <div>
            <small>
                <slot name="body" />
            </small>
        </div>
        <div>
            <slot name="footer" />
        </div>
        <hr>
    </div>
</template>

<script>

export default {
    name: 'HomeCardItemBase',
};
</script>

<style scoped>
    .home-card-item img {
        width: 21px;
        height: 21px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: middle;
        border: 1px solid #ccc;
    }

    .home-card-item a {
        color: black;
        color: #77a640;
    }

    .home-card-item a:hover {
        text-decoration: none;
        color: #007bff;
        color: #558420;
    }

    .home-card-item b {
        white-space: nowrap;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
    }

    .home-card-item div:last-of-type {
        display: flex;
        justify-content: space-between;
    }

    .home-card-item .badge {
        text-transform: uppercase;
    }

    .home-card-item .text-muted::first-letter {
        text-transform: uppercase;
    }
</style>