<template>
    <div class="autocomplete">
        <input v-model="search"
               type="text"
               @input="onChange"
               @keyup.down="onArrowDown"
               @keyup.up="onArrowUp"
               @keyup.enter="onEnter">
        <ul v-show="isOpen"
            id="autocomplete-results"
            class="autocomplete-results">
            <li v-if="isLoading"
                class="loading">
                Loading results...
            </li>
            <li v-for="(result, i) in results"
                v-else
                :key="i"
                class="autocomplete-result"
                :class="{ 'is-active': i === arrowCounter }"
                @click="setResult(result)">
                {{result}}
            </li>
        </ul>
    </div>
</template>
<script>
/**
     * Based on https://www.digitalocean.com/community/tutorials/vuejs-vue-autocomplete-component
    */
export default {
    name: "Autocomplete",
    props: {
        items: {
            type: Array,
            required: false,
            default: () => []
        },
        isAsync: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            isOpen: false,
            results: [],
            search: "",
            isLoading: false,
            arrowCounter: 0
        };
    },
    watch: {
        items: function (val, oldValue) {
            // actually compare them
            if (val.length !== oldValue.length) {
                this.results = val;
                this.isLoading = false;
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
    },
    unmounted() {
        document.removeEventListener("click", this.handleClickOutside);
    },

    methods: {
        onChange() {
            // Let's warn the parent that a change was made
            this.$emit("input", this.search);

            // Is the data given by an outside ajax request?
            if (this.isAsync) {
                this.isLoading = true;
            } else {
                // Let's search our flat array
                this.filterResults();
                this.isOpen = true;
            }
        },

        filterResults() {
            // first uncapitalize all the things
            this.results = this.items.filter(item => {
                return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
            });
        },
        setResult(result) {
            this.search = result;
            this.isOpen = false;
        },
        onArrowDown() {
            if (this.arrowCounter < this.results.length) {
                this.arrowCounter = this.arrowCounter + 1;
            }
        },
        onArrowUp() {
            if (this.arrowCounter > 0) {
                this.arrowCounter = this.arrowCounter - 1;
            }
        },
        onEnter() {
            this.search = this.results[this.arrowCounter];
            this.isOpen = false;
            this.arrowCounter = -1;
        },
        handleClickOutside(evt) {
            if (!this.$el.contains(evt.target)) {
                this.isOpen = false;
                this.arrowCounter = -1;
            }
        }
    }
};
</script>
<style>
    .autocomplete {
        position: relative;
        width: 130px;
    }

    .autocomplete-results {
        padding: 0;
        margin: 0;
        border: 1px solid #eeeeee;
        height: 120px;
        overflow: auto;
        width: 100%;
    }

    .autocomplete-result {
        list-style: none;
        text-align: left;
        padding: 4px 2px;
        cursor: pointer;
    }

    .autocomplete-result.is-active,
    .autocomplete-result:hover {
        background-color: #4aae9b;
        color: white;
    }
</style>
