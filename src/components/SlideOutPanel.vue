<template>
    <transition name="slide">
        <div v-if="opened"
             class="slideout">
            <slot />
        </div>
    </transition>
</template>

<script>
export default {
    name: 'SlideOutPanel',
    props: {
        opened: {type: Boolean, default: false},
    },
    data: () => ({
        openerText: 'Open',
        menu: ['Home', 'Work', 'Contact'],
        smallMenu: ['Tips', 'Resources', 'Shenanigans']
    }),
    methods: {
        open() {
            this.openerText = 'Close';
            this.isOpen = true;
        },
        close() {
            this.openerText = 'Open';
            this.isOpen = false;
        },
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
    }
}
</script>
<style scoped>
    .slideout {
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1000;
    }

    .slide-leave-active,
    .slide-enter-active {
        transition: .5s;
    }

    .slide-enter {
        transform: translate(100%, 0);
    }

    .slide-leave-to {
        transform: translate(100%, 0);
    }

    .opened {
        display: block !important
    }
</style>
