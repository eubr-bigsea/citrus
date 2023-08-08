import CodeLibrary from './CodeLibrary.vue'

describe('<CodeLibrary />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(CodeLibrary)
  })
})