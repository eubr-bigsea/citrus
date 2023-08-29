import HomeCard from './HomeCard.vue'

describe('<HomeCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(HomeCard, {
        propsData:
            items: [
                {label:'Data sources', id: 1}
            ], total: 10, type: 'dataSource'
        }
    })
  })
})
