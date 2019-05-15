import Vue from 'vue'
import ContentfulWrapper from './ContentfulWrapper'

export default class HomeController {
  constructor () {
    this.wrapper = new ContentfulWrapper()
    this.inventoryURL = process.env.INVENTORY_API
    this.accessToken = process.env.API_ACCESS_TOKEN
    this.organizationMicroData = null
    this.websiteMicroData = null
  }

  getPageContent (callback) {
    // var url = this.wrapper._entriesUrl() + '&content_type=homepage';

    this.getCollateralItem('homepage').then(response => {
      var homeData = response.homepage.data

      this.organizationMicroData = homeData['organizationMicroData']
      this.websiteMicroData = homeData['websiteMicroData']

      var homeContent = {}
      homeContent.heroTitle = homeData['homepageHeroBannerTitle']
      homeContent.heroDescription = homeData['homepageHeroBannerDescription']
      homeContent.subHeading = homeData['tourGuidesSubheading']
      homeContent.signUpDescription = homeData['homepageSignUpDescription']

      homeContent.heroImage = homeData['homepageHeroBanner']
      homeContent.featuredCities = []

      for (var index in homeData['homepageFeaturedCities']) {
        homeContent.featuredCities.push({'name': homeData['homepageFeaturedCities'][index]['name'], 'image': homeData['homepageFeaturedCities'][index]['image']})
      }

      homeContent.tourGuides = homeData['homepageFeaturedTourGuides']

      homeContent.sellingPoints = homeData['homepageSellingPoints']

      homeContent.featureTour = homeData['homepageFeaturedTour']

      homeContent.homepageMetaTitle = homeData['homepageMetaTitle']

      homeContent.homepageMetaDescription = homeData['homepageMetaDescription']
      callback(homeContent)
    }, error => {
      console.log('Home Page Content Error - ' + error)
      callback(undefined)
    })
  }

  getOrganizationMicroData (payload) {
    return new Promise((resolve, reject) => {
      resolve(this.organizationMicroData)
    })
  }

  getWebsiteMicroData (payload) {
    return new Promise((resolve, reject) => {
      console.log('getWebsiteMicroData in controller')
      console.log(this.websiteMicroData)
      resolve(this.websiteMicroData)
    })
  }

  getCollateralItem ($dataItem) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(self.inventoryURL + 'collateral/' + $dataItem).then((response) => {
        if (response.body.status === 'success') {
          console.log('Saving data name ' + $dataItem)
          // Vue.localStorage.set($dataItem, JSON.stringify(response.body.data))
          resolve(response.body.data)
        } else {
          Vue.http.options.emulateJSON = true
          reject(new Error(response.body.message))
        }
      }, error => {
        Vue.http.options.emulateJSON = true
        reject(error)
      })
    })
  }
}
