export default {
    methods: {
        toggleLoading(target) {
            if (target.getAttribute('disabled') === 'disabled') {
                event.target.removeAttribute('disabled');
                event.target.classList.add('btn-spinner');
            } else {
                target.setAttribute('disabled', 'disabled');
                target.classList.remove('btn-spinner');
            }
        }
    }
};