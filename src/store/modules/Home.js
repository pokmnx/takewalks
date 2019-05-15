import HomeController from '../../api/HomeController'

var homeController = new HomeController()

const Home = {
  state: {
    bAllLoaded: false,
    heroImage: '',
    heroVideo: '',
    heroTitle: '',
    heroDescription: '',
    subHeading: '',
    tourGuides: [],
    featuredCities: [],
    sellingPoints: [],
    signUpDescription: '',
    featureTour: {},
    organizationMicroData: {},
    websiteMicroData: {},
    homepageMetaTitle: '',
    homepageMetaDescription: ''
  },
  actions: {
    getHomeData: context => {
      return new Promise((resolve, reject) => {
        homeController.getPageContent(data => {
          context.commit('setHomeData', data)
          resolve()
        }, error => reject(error))
      })
    },
    getOrganizationMicroData: (context, payload) => {
      return new Promise((resolve, reject) => {
        homeController.getOrganizationMicroData(payload).then(data => {
          context.commit('setOrganizationMicroData', data)
          resolve()
        }, error => reject(error))
      })
    },
    getWebsiteMicroData: (context, payload) => {
      return new Promise((resolve, reject) => {
        homeController.getWebsiteMicroData(payload).then(data => {
          console.log('getWebsiteMicroData homejs')
          console.log(data)
          context.commit('setWebsiteMicroData', data)
          resolve()
        }, error => reject(error))
      })
    }
  },
  mutations: {
    setHomeData: (state, data) => {
      state.heroTitle = data.heroTitle
      state.heroDescription = data.heroDescription
      state.heroImage = data.heroImage
      state.tourGuides = data.tourGuides
      state.subHeading = data.subHeading
      state.featuredCities = data.featuredCities
      state.sellingPoints = data.sellingPoints
      state.signUpDescription = data.signUpDescription
      state.featureTour = data.featureTour
      state.homepageMetaTitle = data.homepageMetaTitle
      state.homepageMetaDescription = data.homepageMetaDescription
    },
    setAllLoaded: (state, data) => {
      state.bAllLoaded = data
    },
    setOrganizationMicroData: (state, data) => {
      state.organizationMicroData = data
    },
    setWebsiteMicroData: (state, data) => {
      state.websiteMicroData = data
    }
  },
  getters: {
    heroTitle: state => {
      return state.heroTitle
    },
    organizationMicroData: state => {
      return state.organizationMicroData
    },
    websiteMicroData: state => {
      return state.websiteMicroData
    },
    heroDescription: state => {
      return state.heroDescription
    },
    heroImage: state => {
      return state.heroImage
    },
    tourGuides: state => {
      return state.tourGuides
    },
    subHeading: state => {
      return state.subHeading
    },
    featuredCities: state => {
      return state.featuredCities
    },
    sellingPoints: state => {
      return state.sellingPoints
    },
    signUpDescription: state => {
      return state.signUpDescription
    },
    featureTour: state => {
      return state.featureTour
    },
    bAllLoaded: state => {
      return state.bAllLoaded
    },
    homepageMetaTitle: state => {
      return state.homepageMetaTitle
    },
    homepageMetaDescription: state => {
      return state.homepageMetaDescription
    }
  }
}

export default Home
