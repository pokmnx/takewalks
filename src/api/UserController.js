import Vue from 'vue'
import ContentfulWrapper from './ContentfulWrapper'

Vue.http.options.emulateJSON = true

var wrapper = new ContentfulWrapper()

export default class UserController {
  constructor () {
    this.baseURL = process.env.USER_API
    this.userURL = process.env.USER_API
    this.userToken = process.env.USER_TOKEN
    this.isLogged = false
    this.user = null
  }

  adestraTransaction (data) {
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.userToken
      Vue.http.post(this.baseURL + '/user/adestraTransaction', data).then(response => {
        if (response.body.status === 'success') {
          resolve()
        } else {
          reject(new Error(response.body.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  signUpEmail (data) {
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.userToken
      Vue.http.post(this.baseURL + '/user/signup', data).then(response => {
        if (response.body.status === 'success') {
          resolve()
        } else {
          reject(new Error(response.body.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  loginWithSocial (data) {
    var self = this
    return new Promise((resolve, reject) => {
      this.getAccessToken().then(token => {
        Vue.http.post(this.userURL + 'login/social', data).then(response => {
          if (response.body.success === true) {
            console.log('user - ' + response.body.results.data.user)
            self.isLogged = true
            self.user = response.body.results.data.user
            self.addSocialProvider(self.user.id, data.provider, data.socialUserId).then((response) => {
              resolve(self.user)
            }, error => {
              reject(error)
            })
          } else {
            reject(new Error(response.body.message))
          }
        }, error => {
          reject(error)
        })
      }, error => reject(error))
    })
  }

  loginWithEmail (email, password) {
    var self = this
    var url = this.baseURL + '/user/login?email=' + email + '&password=' + password
    return new Promise((resolve, reject) => {
      this.getAccessToken().then(token => {
        Vue.http.get(url).then(response => {
          if (response.body.code === 200) {
            self.isLogged = true
            self.user = response.body.data.user
            resolve(response.body.data.user)
          } else {
            reject(new Error(response.body.message))
          }
        }, error => {
          reject(error)
        })
      }, error => reject(error))
    })
  }

  registerWithEmail (firstName, lastName, email, password) {
    var self = this
    var data = {
      'fname': firstName,
      'lname': lastName,
      'email': email,
      'password': password
    }
    return new Promise((resolve, reject) => {
      this.getAccessToken().then(token => {
        Vue.http.post(this.baseURL + '/user', data).then(response => {
          if (response.body.code === 200) {
            self.isLogged = true
            self.user = response.body.data.user
            resolve(response.body.data.user)
          } else {
            reject(new Error(response.body.message))
          }
        }, error => {
          reject(error)
        })
      }, error => reject(error))
    })
  }

  isLogged () {
    return this.isLogged
  }

  logOut () {
    var self = this
    if (this.user === null) {
      return new Promise((resolve, reject) => {
        self.isLogged = false
        self.user = {}
        resolve()
      })
    } else {
      var url = this.baseURL + '/user/logout?email=' + this.user.email
      return new Promise((resolve, reject) => {
        this.getAccessToken().then(token => {
          Vue.http.get(url).then(response => {
            if (response.body.code === 200) {
              self.isLogged = false
              self.user = {}
              resolve()
            } else {
              reject(new Error(response.body.message))
            }
          }, error => {
            reject(error)
          })
        }, error => {
          reject(error)
        })
      })
    }
  }

  getTourList (userId) {
    var url = this.baseURL + '/user/' + userId + '/tourlist'
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.status === 'success') {
          resolve(response.body.data)
        } else {
          reject(new Error(response.body.message))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  getWishList (userId) {
    var url = this.baseURL + '/user/' + userId + '/wishlist'
    return new Promise((resolve, reject) => {
      Vue.http.get(url).then(response => {
        if (response.body.status === 'success') {
          if (response.body.data.length !== 0 && response.body.data.tours.length > 0) {
            var tours = response.body.data.tours
            var promises = []
            tours.forEach(tour => {
              var promise = new Promise((resolve, reject) => {
                wrapper.getTourById(tour.tourEventId).then(value => {
                  var content = value.fields
                  wrapper.getImageAssetURL(content.tourListingImage).then(url => {
                    wrapper.getCitySlugById(content.tourCity).then(slug => {
                      var wish = {
                        event_id: tour.tourEventId,
                        price: tour.price,
                        image: url,
                        title: content.tourTitleLong,
                        description: content.tourPageShortDescriptionComparative,
                        citySlug: slug,
                        slug: content.tourPageURL
                      }
                      resolve(wish)
                    }, reason => {
                      reject(reason)
                    })
                  }, reason => {
                    reject(reason)
                  })
                }, reason => reject(reason))
              })
              promises.push(promise)
            })
          } else {
            resolve([])
          }
          Promise.all(promises).then(values => {
            resolve(values)
          }, reason => reject(reason))
        } else {
          reject(new Error(response.body.message))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  addToWishList (userId, eventId) {
    var url = this.baseURL + '/user/' + userId + '/wishlist?events_id=' + eventId
    return new Promise((resolve, reject) => {
      Vue.http.post(url).then(response => {
        if (response.body.status === 'success') {
          resolve(response.body.data)
        } else {
          reject(new Error(response.body.message))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  removeFromWishList (userId, eventId) {
    var url = this.baseURL + '/user/' + userId + '/wishlist?events_id=' + eventId
    return new Promise((resolve, reject) => {
      Vue.http.delete(url).then(response => {
        if (response.body.status === 'success') {
          resolve(response.body.data)
        } else {
          reject(new Error(response.body.message))
        }
      }, reason => {
        reject(reason)
      })
    })
  }

  getUpcomingTours (userId) {
    var self = this
    return new Promise((resolve, reject) => {
      self.getTourList(userId).then(data => {
        if (data.tours.length > 0) {
          var tours = data.tours
          var promises = []
          tours.forEach(tour => {
            var promise = new Promise((resolve, reject) => {
              var price = tour.exchange_amount > 0 ? tour.exchange_amount : 0
              wrapper.getTourById(tour.tourEventId).then(content => {
                var tourContentful = content.fields
                if (tourContentful === undefined) {
                  reject(new Error('empty conent'))
                } else {
                  var upcomingTour = {
                    citySlug: wrapper.getCitySlugById(tourContentful.tourCity),
                    slug: tourContentful.tourPageURL,
                    name: tour.name,
                    tourDateTime: tour.tourDateTime,
                    bookingTime: tour.booking_time,
                    bookingDetailsId: tour.bookingDetailsId,
                    guests: tour.number_adults + tour.number_students + tour.number_children + tour.number_seniors + tour.number_infants,
                    price: price
                  }
                  resolve(upcomingTour)
                }
              }, error => {
                reject(error)
              })
            })
            promises.push(promise)
            Promise.all(promises).then(values => {
              resolve(values)
            }, reason => {
              reject(reason)
            })
          })
        } else {
          resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getSocialProvider (userId) {
    var self = this
    var url = this.baseURL + '/user/' + userId + '/social'
    return new Promise((resolve, reject) => {
      self.getAccessToken().then(response => {
        Vue.http.get(url).then(response => {
          if (response.body.status === 'success') {
            resolve(response.body.data.socialProviders)
          } else {
            resolve([])
          }
        }, reason => {
          resolve([])
        })
      }, error => {
        console.log(error)
        resolve([])
      })
    })
  }

  addSocialProvider (userId, provider, socialUserId) {
    var url = this.baseURL + '/user/' + userId + '/social'
    var data = {
      'provider': provider,
      'socialUserId': socialUserId
    }
    var self = this
    return new Promise((resolve, reject) => {
      self.getAccessToken().then(token => {
        self.getSocialProvider(userId).then(providers => {
          var bFind = false
          providers.forEach(prov => {
            if (prov.provider === provider && prov.socialUserId === socialUserId) {
              bFind = true
            }
          })
          if (bFind === false) {
            Vue.http.post(url, data).then(response => {
              if (response.body.status === 'success') {
                resolve(response.body.data.socialProvider.id)
              } else {
                reject(response.body.status)
              }
            }, reason => {
              reject(reason)
            })
          } else {
            resolve()
          }
        })
      })
    })
  }

  removeSocialProvider (userId, socialProviderId) {
    var self = this
    var url = this.baseURL + '/user/' + userId + '/social?socialProviderId=' + socialProviderId
    return new Promise((resolve, reject) => {
      self.getAccessToken().then(token => {
        Vue.http.delete(url).then(response => {
          if (response.body.status === 'success') {
            resolve()
          } else {
            reject(new Error(response.body.status))
          }
        }, reason => {
          resolve(reason)
        })
      })
    })
  }

  updateUser (userId, firstName, lastName, email, phone) {
    var url = this.baseURL + '/user/' + userId
    var data = {}
    if (firstName !== '') data.fname = firstName
    if (lastName !== '') data.lname = lastName
    if (email !== '') data.email = email
    if (phone !== '') data.mobile_number = phone

    var self = this
    return new Promise((resolve, reject) => {
      self.getAccessToken().then(token => {
        Vue.http.post(url, data).then(response => {
          if (response.body.status === 'success') {
            resolve(response.body.data)
          } else {
            reject(new Error(response.body.message))
          }
        }, reason => {
          reject(reason)
        })
      })
    })
  }

  updatePassword (userId, oldPassword, newPassword) {
    var data = {
      passwordCurrent: oldPassword,
      passwordNew: newPassword,
      passwordNewVerify: newPassword
    }
    var url = this.baseURL + '/user/' + userId + '/password/change'
    var self = this
    return new Promise((resolve, reject) => {
      self.getAccessToken().then(token => {
        Vue.http.post(url, data).then(response => {
          if (response.body.status === 'success') {
            resolve()
          } else {
            reject(new Error(response.body.message))
          }
        }, error => {
          reject(error)
        })
      })
    })
  }
}
