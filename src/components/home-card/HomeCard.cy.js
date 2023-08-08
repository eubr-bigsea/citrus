import HomeCard from './HomeCard.vue'

describe('<HomeCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(HomeCard)
  })
})