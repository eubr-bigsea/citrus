<template>
    <div class="home-card-item">
        <dd>
            <b>
                <slot name="head"></slot>
            </b>
        </dd>
        <dd>
            <slot name="body"></slot>
        </dd>
        <dd>
            <slot name="footer"></slot>
        </dd>
        <hr>
    </div>
</template>

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
}

.home-card-item a:hover {
    text-decoration: none;
    color: #007bff;
}

.home-card-item b {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
}

.home-card-item dd:last-of-type {
    display: flex;
    justify-content: space-between;
}

.home-card-item .badge {
    text-transform: uppercase;
}
</style>

<script>

export default {
    name: 'home-card-item-base',
}
</script>