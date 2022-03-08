<template>
    <div>
        <h5>Geração de features</h5>
        <hr />
        <hr />
        <div class="row">
            <div class="col-md-12">
                <b-list-group>
                    <b-list-group-item class="p-0 pl-2">
                        <div class="d-flex w-100 justify-content-between p-1">
                            <b-form-checkbox switch>Combinação linear par a par
                            </b-form-checkbox>
                            This generator generates A+B and A-B features, for each pair
                            of
                            numerical features.

                        </div>
                        <div class="d-flex w-100 justify-content-between p-1">
                            <b-form-checkbox switch>Combinação polinomial par a par
                            </b-form-checkbox>
                            This generator generates A*B features, for each pair of
                            numerical features.

                        </div>
                        <div class="d-flex w-100 justify-content-between p-1">
                            <b-form-checkbox switch>Combinação explícita par a par
                            </b-form-checkbox>
                            This generator generates pairwise interactions between
                            features:
                            <ul>
                                <li>Numerical features will be multiplied</li>
                                <li>Numerical and categorical features will produce a
                                    dummies
                                    multiplied by the numerical feature.</li>
                                <li>Two categorical features will produce dummies in the
                                    cross-product of the two features</li>
                            </ul>

                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </div>
    </div>
</template>
<script>
    export default {

    }
</script>