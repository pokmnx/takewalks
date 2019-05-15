import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export default class ContentfulWrapper {
  constructor () {
    this._spaceId = 'twizyp0t114t'
    // Dev Key. Content Delivery API
    this._token = 'c64e7fa2fad30d82a6d0b8a90c5c1f621aef1f0dbb7cc0aad0743346e3761e30'
    // Dev Key. Content Preview API
    // this._token = "e50a0532f2c8c6bf189f2fedaa9d93aa6683c58156df342c059eb7c3fe927ca7";

    this._apiUrl = 'https://cdn.contentful.com'
    this._spaceUrl = this._apiUrl + '/spaces/' + this._spaceId
  }

  _entriesUrl () {
    return this._spaceUrl + '/entries?access_token=' + this._token
  }

  _getUrl (url, callback) {
    return new Promise((resolve, reject) => {
      Vue.http.get(this._entriesUrl(url) + '&' + url).then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  }

  _getTourId (tour) {
    var tourId = null
    if (typeof tour === 'number') {
      tourId = tour
    } else if (Array.isArray(tour)) {
      tourId = tour['sys']['id']
    } else {
      tourId = String(tour)
    }
    return tourId
  }

  getTagsByCity (cityCid) {
    if (cityCid instanceof Object) {
      cityCid = cityCid['sys']['id']
    }
    var url = this._entriesUrl() + '&content_type=category&fields.tagPageCity.sys.id={' + cityCid + '}&order=fields.tagPageListingOrder'
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  }

  getCity (city) {
    if (city instanceof Object) {
      city = city['cityListingName']
    }
    var url = 'content_type=city&fields.cityListingName=' + encodeURI(this.ucwords(city))
    return this._getUrl(url)
  }

  getCityById (cityId) {
    var self = this
    if (cityId instanceof Object) {
      cityId = cityId['sys']['id']
    }
    return new Promise((resolve, reject) => {
      self._getUrl('content_type=city&sys.id=' + self.ucwords(cityId)).then(value => {
        if (value['items'].length > 0) {
          resolve(value['items'][0])
        } else {
          reject(new Error('Not find item'))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  getCitySlugById (cityId) {
    var self = this
    return new Promise((resolve, reject) => {
      self.getCityById(cityId).then(city => {
        var slug = city.fields.cityListingName.toLowerCase().replace(new RegExp(' ', 'g'), '-') + '-tours'
        resolve(slug)
      }, error => {
        reject(error)
      })
    })
  }

  getTourById (tourId) {
    var id = this._getTourId(tourId)
    var url = ''
    if (typeof id === 'number') {
      url = this._entriesUrl() + '&content_type=tour&fields.eventId=' + id
    } else if (Array.isArray(id)) {
      url = this._entriesUrl() + '&content_type=tour&sys.id=' + id['sys']['id']
    } else {
      url = this._entriesUrl() + '&content_type=tour&sys.id=' + id
    }
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          resolve(response.body.items[0])
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourBySlug (tourSlug) {
    var url = this._entriesUrl() + '&content_type=tour&fields.tourPageURL=' + tourSlug
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          resolve(response.body.items[0])
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getFeaturedTourReviews (tourId) {
    var url = this._entriesUrl() + '&content_type=featuredTourPageReviews&fields.tour.sys.id=' + tourId
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          var featuredReviews = []
          var data = response.body.items
          for (var ind in data) {
            featuredReviews.push(data[ind]['fields'])
          }
          resolve(featuredReviews)
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourGuidesByFeaturedTourId (tourId) {
    if (tourId instanceof Object) {
      tourId = tourId['sys']['id']
    }
    var url = this._entriesUrl() + '&content_type=tourGuideProfiles&fields.tourGuideFeaturedTour.sys.id=' + tourId
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          resolve(response.body.items[0])
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourGuidesByCityId (cityId) {
    if (cityId instanceof Object) {
      cityId = cityId['sys']['id']
    }
    var url = this._entriesUrl() + '&content_type=tourGuideProfiles&fields.tourGuideCity.sys.id=' + cityId
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          resolve(response.body.items[0])
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourGuideByName (name) {
    var url = this._entriesUrl() + '&content_type=tourGuideProfiles&fields.tourGuideName=' + this.ucwords(name)
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.items.length > 0) {
          resolve(response.body.items[0]['fields'])
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getCountryById (countryId) {
    if (countryId instanceof Object) {
      countryId = countryId['sys']['id']
    }
    var self = this
    return new Promise((resolve, reject) => {
      self._getUrl('content_type=countries&sys.id=' + countryId).then(value => {
        if (value['items'].length > 0) {
          resolve(value['items'][0])
        } else {
          reject(new Error('Not find item'))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  getImageAssetURL (asset) {
    if (asset instanceof Object) {
      asset = asset['sys']['id']
    }
    return this.getAsset(asset)
  }

  getAsset (assetId) {
    var self = this
    return new Promise(function (resolve, reject) {
      if (assetId instanceof Object) {
        assetId = assetId['sys']['id']
      }
      let url = self._spaceUrl + '/assets/' + assetId + '?access_token=' + self._token
      Vue.http.get(url).then(response => {
        var fields = response.body.fields
        if (fields) {
          resolve(fields.file.url)
        } else {
          reject(new Error('JSON Parse Error'))
        }
      }, response => {
        reject(new Error('Response Error'))
      })
    })
  }

  getEntry (assetId) {
    var self = this
    return new Promise(function (resolve, reject) {
      if (assetId instanceof Object) {
        assetId = assetId['sys']['id']
      }
      let url = self._spaceUrl + '/entries/' + assetId + '?access_token=' + self._token
      Vue.http.get(url).then(response => {
        resolve(response.body.fields)
      }, response => {
        reject(new Error('Response Error'))
      })
    })
  }

  ucwords (str) {
    return (str + '').replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase()
    })
  }
}
