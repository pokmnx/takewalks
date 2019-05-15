const Common = {
  state: {
    currency: 'USD',
    status: {}
  },
  actions: {

  },
  mutations: {
    setCurrency: (state, cur) => {
      state.currency = cur
    },
    setStatus: (state, status) => {
      state.status = status
    }
  },
  getters: {
    currency: state => {
      return state.currency
    },
    status: state => {
      return state.status
    }
  }
}

export default Common
