import UserController from '../../api/UserController'
var controller = new UserController()

const User = {
  state: {
    googleAuth2: '',
    gUserAction: '',
    fbUserAction: '',
    user: {},
    isLogged: '',
    upcomingTours: [],
    wishList: [],
    socialProvider: {
      facebook: {
        socialProviderId: 0,
        socialUserId: '',
        status: 'not connected',
        class: ''
      },
      google: {
        socialProviderId: 0,
        socialUserId: '',
        status: 'not connected',
        class: ''
      }
    }
  },
  actions: {
    googleLogin: (context, payload) => {
      var user = payload.googleUser
      var profile = user.getBasicProfile()
      var data = {
        provider: 'google',
        socialUserId: profile.getId()
      }
      return controller.loginWithSocial(data)
    },
    googleRegister: (context, payload) => {
      return controller.googleRegister(payload.googleUser)
    },
    fbLogin: (context, user) => {
      var data = {
        provider: 'facebook',
        socialUserId: user.fbUser.id
      }
      return controller.loginWithSocial(data)
    },
    fbRegister: (context, payload) => {
      return controller.fbRegister(payload.googleUser)
    },
    login: (context, payload) => {
      return controller.loginWithEmail(payload.email, payload.password)
    },
    register: (context, payload) => {
      return controller.registerWithEmail(payload.firstName, payload.lastName, payload.email, payload.password)
    },
    logout: context => {
      return new Promise((resolve, reject) => {
        controller.logOut().then(() => {
          context.commit('setUser')
          resolve()
        }, reason => {
          context.commit('setUser')
          reject(reason)
        })
      })
    },
    getUpcomingTours: ({state}) => {
    },
    getWishList: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        controller.getWishList(state.user.id).then(tours => {
          console.log(tours)
          commit('setWishList', {tours})
          resolve()
        }, reason => {
          console.log(reason)
          reject(reason)
        })
      })
    },
    removeWishList: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.removeFromWishList(state.user.id, payload.eventId).then(data => {
          console.log(data)
          commit('removeFromWishList', payload.eventId)
          resolve()
        }, reason => {
          console.log(reason)
          reject(reason)
        })
      })
    },
    addToWishList: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.addToWishList(state.user.id, payload.eventId).then(data => {
          console.log(data)
          resolve()
        }, reason => {
          console.log(reason)
          reject(reason)
        })
      })
    },
    getSocialProvider: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        controller.getSocialProvider(state.user.id).then(providers => {
          var facebook = {
            socialProviderId: 0,
            socialUserId: '',
            status: 'not connected',
            class: ''
          }
          var google = {
            socialProviderId: 0,
            socialUserId: '',
            status: 'not connected',
            class: ''
          }
          providers.forEach(provider => {
            if (provider.provider.toLowerCase() === 'facebook') {
              facebook.socialProviderId = provider.id
              facebook.socialUserId = provider.socialUserId
              facebook.status = 'Connected'
              facebook.class = 'connected'
            } else if (provider.provider.toLowerCase() === 'google') {
              google.socialProviderId = provider.id
              google.socialUserId = provider.socialUserId
              google.status = 'Connected'
              google.class = 'connected'
            }
          })
          commit('setSocialProvider', {
            facebook: facebook,
            google: google
          })
          resolve()
        })
      })
    },
    addSocialProvider: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.addSocialProvider(state.user.id, payload.provider, payload.socialUserId).then((id) => {
          if (payload.provider === 'facebook') {
            state.socialProvider.facebook = {
              socialProviderId: id,
              socialUserId: payload.socialUserId,
              status: 'Connected',
              class: 'connected'
            }
            resolve()
          } else if (payload.provider === 'google') {
            state.socialProvider.google = {
              socialProviderId: id,
              socialUserId: payload.socialUserId,
              status: 'Connected',
              class: 'connected'
            }
            resolve()
          } else {
            reject(new Error('not found provider'))
          }
        }, error => reject(error))
      })
    },
    removeSocialProvider: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.removeSocialProvider(state.user.id, payload.socialProviderId).then(() => {
          if (state.socialProvider.facebook.socialProviderId === payload.socialProviderId) {
            state.socialProvider.facebook = {
              socialProviderId: 0,
              socialUserId: '',
              status: 'not connected',
              class: ''
            }
          } else if (state.socialProvider.google.socialProviderId === payload.socialProviderId) {
            state.socialProvider.google = {
              socialProviderId: 0,
              socialUserId: '',
              status: 'not connected',
              class: ''
            }
          }
          resolve()
        }, reason => reject(reason))
      })
    },
    updateUserInfo: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.updateUser(state.user.id, payload.firstName, payload.lastName, payload.email, payload.phone).then(data => {
          state.user = data.user
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    updatePassword: ({state, commit}, payload) => {
      return new Promise((resolve, reject) => {
        controller.updatePassword(state.user.id, payload.currentPassword, payload.newPassword).then(() => {
          resolve()
        }, error => {
          reject(error)
        })
      })
    },
    signUpEmail: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.signUpEmail(payload).then(() => {
          resolve()
        }, error => {
          reject(error)
        })
      })
    },
    adestraTransaction: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.adestraTransaction(payload).then(() => {
          resolve()
        }, error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    setGoogleAuth2: (state, auth2) => {
      state.googleAuth2 = auth2
    },
    setGUserAction: (state, action) => {
      state.gUserAction = action
    },
    setFBUserAction: (state, action) => {
      state.fbUserAction = action
    },
    setUser: state => {
      state.isLogged = controller.isLogged
      state.user = controller.user
    },
    setUpcomingTours: (state, tours) => {
      state.upcomingTours = tours
    },
    setWishList: (state, tours) => {
      state.wishList = tours
    },
    removeFromWishList: (state, eventId) => {
      state.wishList.tours.forEach(tour => {
        if (tour.event_id === eventId) {
          const index = state.wishList.tours.indexOf(tour)
          state.wishList.tours.splice(index, 1)
        }
      })
    },
    setSocialProvider: (state, providers) => {
      state.socialProvider = providers
    }
  },
  getters: {
    isLogged: state => {
      return state.isLogged
    },
    user: state => {
      return state.user
    },
    upcomingTours: state => {
      return state.upcomingTours
    },
    wishList: state => {
      return state.wishList
    },
    socialProvider: state => {
      return state.socialProvider
    }
  }
}

export default User
