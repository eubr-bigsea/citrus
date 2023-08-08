import SideBar from './SideBar.vue'

describe('<SideBar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(SideBar)
  })
})