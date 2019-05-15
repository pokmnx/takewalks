import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import ContentfulWrapper from './ContentfulWrapper'
import $ from 'jquery'

Vue.use(VueResource)
Vue.use(Vuex)

export default class TourListController {
  constructor () {
    this.wrapper = new ContentfulWrapper()
    this.inventoryURL = process.env.INVENTORY_API
    this.productURL = this.inventoryURL + 'products/'
    this.tourURL = this.inventoryURL + 'tours/'
    this.tagURL = this.inventoryURL + 'tags/'
    this.availURL = this.inventoryURL + 'availability'
    this.bookingURL = process.env.BOOKING_API
    this.baseURL = process.env.APP_BASE_URL
    this.feedbackURL = process.env.FEEDBACK_API
    this.accessToken = process.env.API_ACCESS_TOKEN
    this.delay = 3000
    this.microData = null
    this.cityData = null
  }

  _citySlugToName (slug) {
    var city = slug.replace('-tours', 'g')
    city = city.replace(new RegExp('-', 'g'), ' ')
    return city
  }
  getListContent (citySlug) {
    if (Vue.localStorage.get(this.productURL + citySlug)) {
      return new Promise((resolve, reject) => {
        var tags = JSON.parse(Vue.localStorage.get(this.productURL + citySlug + '-tours'))
        resolve(tags)
      })
    } else {
      var self = this
      return new Promise((resolve, reject) => {
        Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
        Vue.http.get(this.productURL + citySlug + '-tours').then(response => {
          if (response.body.status === 'success') {
            var tagsData = response.body.data.tags
            self.microData = response.body.data.microData
            self.cityData = response.body.data.city.data

            Vue.localStorage.set(self.productURL + citySlug + '-microData', JSON.stringify(self.microData))
            Vue.localStorage.set(self.productURL + citySlug + '-cityData', JSON.stringify(self.cityData))

            var tags = []
            for (var tagIndex in tagsData) {
              var tagData = tagsData[tagIndex]
              var toursData = tagData.tours.data
              var tours = []

              for (var tourInd in toursData) {
                var tourData = toursData[tourInd]
                tours.push({
                  event_id: tourData['event_id'],
                  citySlug: tourData['citySlug'],
                  slug: tourData['slug'],
                  discount: tourData['discount'],
                  image: tourData['featuredImage'],
                  medal: tourData['medal'],
                  price: tourData['price'],
                  flag: tourData['flag'],
                  name: tourData['name'],
                  titleShort: tourData['titleShort'],
                  listingText: tourData['listingText'],
                  review_status: tourData['review_status'],
                  duration: tourData['duration'],
                  groupSize: tourData['groupSize'],
                  priceDiscount: tourData['priceDiscount']
                })
              }

              tags.push({
                name: tagData.data['cityListingTagPageTitle'] ? tagData.data['cityListingTagPageTitle'] : '',
                description: tagData.data['cityListingTagPageShortText'] ? tagData.data['cityListingTagPageShortText'] : '',
                icon: tagData.data['cityListingTagPageTitle'].replace(' ', '-').toLowerCase(),
                tagIcon: tagData.data['tagIcon'],
                slug: tagData.data['tagPageURL'] ? tagData.data['tagPageURL'] : '',
                tours: tours
              })
            }
            Vue.localStorage.set(self.productURL + citySlug + '-tours', JSON.stringify(tags))
            resolve(tags)
          } else {
            console.log('Api error')
            reject(new Error(response.body.error.message))
          }
        }, error => {
          console.log('Front End')
          reject(error)
        })
      })
    }
  }
  getListMicroData (citySlug) {
    return new Promise((resolve, reject) => {
      var microData = JSON.parse(Vue.localStorage.get(this.productURL + citySlug + '-microData'))
      resolve(microData)
    })
  }
  getListCityData (citySlug) {
    return new Promise((resolve, reject) => {
      var cityData = JSON.parse(Vue.localStorage.get(this.productURL + citySlug + '-cityData'))
      resolve(cityData)
    })
  }
  buildBreadCrumbs (data) {
    var items = []
    for (var i = 0; i < data.urls.length; i++) {
      let name = 'Take Walks'
      if (i > 0) {
        let path = data.urls[i].split('/')
        if (data.urls[i].match(/\/$/)) {
          name = path[path.length - 2]
        } else {
          name = path[path.length - 1]
        }
        name = name.replace(/-/g, ' ').toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
      }
      items.push({
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@id': data.urls[i],
          'name': name
        }
      })
    }
    var breadCrumbs = JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items
    })
    return new Promise((resolve, reject) => {
      resolve(breadCrumbs)
    })
  }
  // getAvailability (tags, startDate, endDate) {
  //   console.log('############################### getAvailability ############################### ')
  //   return new Promise((resolve, reject) => {
  //     if (startDate != null && endDate != null) {
  //       var tagPromises = []
  //       for (var tagIndex in tags) {
  //         var tag = tags[tagIndex]
  //         var tourPromises = []
  //         for (var tourIndex in tag.tours) {
  //           var tour = tag.tours[tourIndex]
  //           var tourPromise = new Promise((resolve, reject) => {
  //             var data = {
  //               'tour_id': tour.event_id,
  //               'start_date': startDate,
  //               'end_date': endDate
  //             }
  //             Vue.http.post(this.availURL, data).then(response => {
  //               if (response.body.data.tour_id !== null || response.body.data.tour_id !== undefined) {
  //                 console.log('Resolve - Tour IDs ' + response.body.data.tour_id)
  //                 resolve(response.body.data.tour_id)
  //               } else {
  //                 resolve(null)
  //               }
  //             })
  //           })
  //           tourPromises.push(tourPromise)
  //         }
  //         var tagPromise = new Promise((resolve, reject) => {
  //           Promise.all(tourPromises).then(eventIds => {
  //             var tours = []
  //             var tagInd = 0
  //             for (var idIndex in eventIds) {
  //               if (eventIds[idIndex] !== null) {
  //                 for (var i in tags) {
  //                   for (var j in tags[i].tours) {
  //                     var eventID = tags[i].tours[j].event_id
  //                     if (eventID === parseInt(eventIds[idIndex])) {
  //                       tours.push(tags[i].tours[j])
  //                       tagInd = i
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             if (tours.length > 0) {
  //               console.log('Resolve Tag - ' + tags[tagInd].name + ' ' + tags[tagInd].slug + ' ' + tours.length)
  //               resolve({
  //                 name: tags[tagInd].name,
  //                 description: tags[tagInd].description,
  //                 icon: tags[tagInd].icon,
  //                 slug: tags[tagInd].slug,
  //                 tours: tours
  //               })
  //             } else {
  //               resolve(null)
  //             }
  //           })
  //         })
  //         tagPromises.push(tagPromise)
  //       }
  //       Promise.all(tagPromises).then(tags => {
  //         var finalTags = []
  //         for (var ind in tags) {
  //           if (tags[ind] !== null) {
  //             finalTags.push(tags[ind])
  //           }
  //         }
  //         if (finalTags.length > 0) {
  //           console.log('Resolve Final Tags - ' + finalTags.length)
  //           resolve(finalTags)
  //         } else {
  //           reject(new Error('Not Found Any Tags'))
  //         }
  //       })
  //     } else {
  //       resolve(tags)
  //     }
  //   })
  // }

  getAvailability (productLocator, startDate, endDate) {
    console.log(productLocator)
    return new Promise((resolve, reject) => {
      var data = {
        'productCode': productLocator,
        'start_date': startDate,
        'end_date': endDate
      }
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.post(this.availURL, data).then(response => {
        if (productLocator !== null || productLocator !== undefined) {
          var dateGroups = response.body.data.products
          for (var date in dateGroups) {
            for (var time in dateGroups[date]) {
              // remove object if the status is unavailable
              if (dateGroups[date] && dateGroups[date][time].status && dateGroups[date][time].status === 'Unavailable') {
                delete dateGroups[date][time]
                if (Object.getOwnPropertyNames(dateGroups[date]).length === 0) {
                  delete dateGroups[date]
                }
              }
            }
          }
          // console.log('Fetching availability from ' + startDate + ' to ' + endDate)
        }
        // delete dateGroups.tour_id
        resolve(JSON.stringify(dateGroups))
      })
    })
  }
  checkReserved (bookingId) {
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.bookingURL + bookingId).then(response => {
        var stageIdsReserved = []
        var stageIdsTemp = []
        var indexList = []
        var redFlag = false
        // array of stage ids from the back end
        for (var i in response.data.data) {
          if (response.data.data[i].pax_status === 'reserved') {
            stageIdsReserved.push(response.data.data[i].stage_id)
          } else if (response.data.data[i].pax_status === 'confirmed') {
            redFlag = true
          }
        }
        // array of stage ids from front end
        for (var j in JSON.parse(Vue.localStorage.get('Carts'))) {
          console.log(JSON.parse(Vue.localStorage.get('Carts'))[j].staging_id)
          stageIdsTemp.push(JSON.parse(Vue.localStorage.get('Carts'))[j].staging_id)
        }
        var finalArray = arrDiff(stageIdsReserved, stageIdsTemp)
        var newCart = JSON.parse(Vue.localStorage.get('Carts'))
        for (var a = 0; a < newCart.length; a++) {
          for (j = 0; j < finalArray.length; j++) {
            if (newCart[a].staging_id === finalArray[j]) {
              indexList.push(a)
            }
          }
        }
        Vue.localStorage.set('stageIdsTemp', JSON.stringify(stageIdsTemp))
        // this function compares the stage ids saved in the local storage against the most updated list of stage ids and update the local storage if there is any difference
        function arrDiff (a1, a2) {
          var a = []
          var diff = []
          for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true
          }
          for (i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
              delete a[a2[i]]
            } else {
              a[a2[i]] = true
            }
          }
          for (var k in a) {
            diff.push(k)
          }
          return diff
        }
        var data = {
          indexList: indexList,
          redFlag: redFlag
        }
        resolve(data)
      })
    })
  }
  getTour (city, tourSlug) {
    console.log('############################### getTour ############################### ')

    // TODO: get this from local storage, we are calling it twice
    // once in TourList.js and then in index.js

    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug).then((response) => {
        console.log(response.body)
        var tourData = response.body.data.tour.data
        var tour = {}
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth()
        // Vue.localStorage.set('Month', JSON.stringify(m))
        // Vue.localStorage.set('CurrentMonth', JSON.stringify(m))
        var firstDay = new Date(y, m, 1) // start at the first day of the monthg
        var lastDay = new Date(y, m + 3, 0) // end at the last day of the month
        var data = {
          'product_locator': tourData['productCode'],
          'start_date': firstDay.toISOString().split('T')[0],
          'end_date': lastDay.toISOString().split('T')[0]
        }
        var calendarSetup = {
          selectedMonth: m,
          minMonth: m,
          maxMonth: m + 13
        }
        tour = {
          eventID: tourData['event_id'],
          citySlug: tourData['citySlug'],
          tourSlug: tourSlug,
          cityName: tourData['cityName'],
          shortTitle: tourData['shortTitle'],
          title: tourData['title'],
          duration: tourData['duration'],
          maxGroupSize: tourData['maxGroupSize'],
          reviewsAverage: tourData['review_status']['data']['feedback_average'],
          intro: tourData['intro'],
          video: tourData['video'] ? tourData['video'] : '',
          sitesVisited: tourData['sitesVisited'],
          tourIncludes: tourData['tourIncludes'],
          descriptionTitle: tourData['descriptionTitle'],
          description: tourData['description'],
          faqs: tourData['faqs']['data'],
          tourGuides: tourData['tourGuides']['data'],
          similarTours: tourData['similarTours']['data'],
          twitterShare: 'https://twitter.com/intent/tweet?url=$canonicalURL&amp;text=',
          facebookShare: 'https://www.facebook.com/share.php?u=',
          emailShare: 'mailto:info@walks.com?cc=info@walks.com&bcc=info@walks.com',
          gallery: tourData['gallery'],
          videoThumbnail: tourData['listingImage'],
          featuredReviews: tourData['featuredReviews']['data'],
          reviewsCount: tourData['review_status']['data']['feedback_count'],
          price: tourData['price']['data'],
          priceDiscount: tourData['priceDiscount']['data'],
          discount: tourData['discount'],
          metaTitle: tourData['tourPageMetaTitle'],
          metaDescription: tourData['tourPageMetaDescription'],
          meetingPointAddress: (tourData['meetingPoints'].data.length > 0 ? tourData['meetingPoints'].data[0].meetingPointAddress : ''),
          meetingPointMapImage: (tourData['meetingPoints'].data.length > 0 ? tourData['meetingPoints'].data[0].meetingPointMapImage.fields.file.url : ''),
          meetingPointMapUrl: tourData['meetingPointMapUrl'],
          product_locator: tourData['productCode'],
          product_locator_type: tourData['productType'],
          time_select_required: tourData['time_select_required'],
          highlights: tourData['highlights'],
          introTitle: tourData['introTitle'],
          tagPageUrl: tourData['tagPageUrl'],
          microData: tourData['microData'],
          review_status: tourData['review_status'],
          countryName: tourData['countryName']
        }
        console.log(tour.meetingPointAddress)
        if (window._didAsyncInjectGoogleAnalytics) {
          window.dataLayer.push({
            'event': 'EC',
            'ecommerce': {
              'detail': {
                'products': [{
                  'id': tourData['citySlug'],
                  'name': tourData['shortTitle']
                }]
              }
            }
          })
        }
        this.getAvailability(data.product_locator, data.start_date, data.end_date)
        .then(response => {
          Vue.localStorage.set(this.tourURL + tourSlug, JSON.stringify(tour))
          // update the minMonth to the first date of availability for the calendarSetup payload
          if (typeof response === 'object') {
            var firstDateAvailable = Object.keys(response)[0]
            var firstDate = new Date(firstDateAvailable + 'T00:00:00')
            calendarSetup.minMonth = firstDate.getMonth()
          }
          // resolves to getTour on Tourlist.js
          resolve({ 'tour': tour, 'availability': response, 'calendarSetup': calendarSetup })
        })
      }, error => {
        reject(error)
      })
    })
  }

  getTourFaq (tourSlug) {
    console.log('############################### getTourFaq ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug + '/faqs').then((response) => {
        if (response.body.status === 'success') {
          var faqData = response.body.data.faq.data
          var faqs = []
          for (var index = 0; index < faqData.length; index++) {
            faqs.push({
              question: faqData[index]['question'],
              answer: faqData[index]['answer']
            })
          }
          setTimeout(() => {
            resolve(faqs)
          }, this.delay)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourReviews (eventId, offset, limit) {
    console.log('############################### tourSlug ############################### ')
    return new Promise((resolve, reject) => {
      var payload = {
        offset: offset,
        limit: limit
      }

      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.post(this.feedbackURL + eventId + '/feedback/paginated', payload).then((response) => {
        if (response.body.status === 'success') {
          console.log(response)
          var reviewData = response.body.data
          var reviews = []
          for (var index in reviewData) {
            reviews.push({
              reviewTitle: reviewData[index]['event_title'],
              reviewContent: reviewData[index]['comment_stuff_edited'],
              customerName: reviewData[index]['first_name'] + ' ' + reviewData[index]['last_name'],
              date: reviewData[index]['feedback_date'],
              numberOfStars: reviewData[index]['event_rating']
            })
          }
          resolve(reviews)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourReviewStatus (eventId) {
    console.log('############################### getTourReviewStatus ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.feedbackURL + eventId + '/feedback/stats').then((response) => {
        if (response.body.status === 'success') {
          console.log(response)
          var reviewStatus = []
          reviewStatus.push({
            feedback_count: response.body.data.feedback_count,
            feedback_average: response.body.data.feedback_average,
            feedback_count_five_stars: response.body.data.feedback_count_five_stars,
            feedback_count_four_stars: response.body.data.feedback_count_four_stars,
            feedback_count_three_stars: response.body.data.feedback_count_three_stars,
            feedback_count_two_stars: response.body.data.feedback_count_two_stars,
            feedback_count_one_star: response.body.data.feedback_count_one_star
          })
          resolve(reviewStatus)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourAssets (tourSlug) {
    console.log('############################### getTourAssets ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug + '/assets').then((response) => {
        if (response.body.status === 'success') {
          var assetsData = response.body.data.assets.data.gallery.data
          var assets = []
          for (var index in assetsData) {
            assets.push({
              url: assetsData[index]['file']['url'].replace('downloads.contentful', 'images.contentful'),
              description: assetsData[index]['description']
            })
          }
          setTimeout(() => {
            resolve(assets)
          }, this.delay)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourGuides (tourSlug) {
    console.log('############################### getTourGuides ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug + '/guides').then((response) => {
        if (response.body.status === 'success') {
          var guideData = response.body.data.guides.data
          var guides = []
          for (var index in guideData) {
            guides.push({
              name: guideData[index]['tourGuideName'],
              city: guideData[index]['tourGuideCity'],
              country: guideData[index]['tourGuideCountry'],
              description: guideData[index]['tourGuideFeaturedDescription'],
              avatar: guideData[index]['tourGuideImage'][0]['url']
            })
          }
          setTimeout(() => {
            resolve(guides)
          }, this.delay)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getTourPrices (tourSlug) {
    console.log('############################### getTourPrices ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug + '/prices').then((response) => {
        if (response.body.status === 'success') {
          console.log(response.body)
          resolve(response.body.data)
        } else {
          reject(new Error(response.body.error.message))
          // resolve([])
        }
      }, error => {
        reject(error)
      })
    })
  }

  getFeaturedReview (tourSlug) {
    console.log('############################### getFeaturedReview ############################### ')
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tourURL + tourSlug + '/featured_reviews').then((response) => {
        if (response.statusText === 'OK') {
          console.log(response.body)
          var reviews = []
          var reviewData = response.body
          for (var index in reviewData) {
            reviews.push({
              reviewTitle: reviewData[index]['fields']['reviewTitle'],
              reviewContent: reviewData[index]['fields']['reviewContent'],
              customerName: reviewData[index]['fields']['customerName'],
              date: reviewData[index]['fields']['date'],
              numberOfStars: reviewData[index]['fields']['numberOfStars']
            })
          }
          resolve(reviews)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getUpcomingTours (tagSlug) {
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.baseURL + tagSlug).then((response) => {
        console.log(response.body)
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  }

  getTag (tagSlug) {
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(this.tagURL + tagSlug).then((response) => {
        if (response.body.status === 'success') {
          var tagData = response.body.data.tag.data
          var highlights = []
          highlights.push({
            title: tagData['tagPageHighlightTitle1'],
            image: tagData['tagPageHighlightImage1']['data']['url'],
            pullQuote: tagData['highlightPullQuote1'],
            description: tagData['tagPageHighlightDescription1']
          })
          highlights.push({
            title: tagData['tagPageHighlightTitle2'],
            image: tagData['tagPageHighlightImage2']['data']['url'],
            pullQuote: tagData['highlightPullQuote2'],
            description: tagData['tagPageHighlightDescription2']
          })
          highlights.push({
            title: tagData['tagPageHighlightTitle3'],
            image: tagData['tagPageHighlightImage3']['data']['url'],
            pullQuote: tagData['highlightPullQuote3'],
            description: tagData['tagPageHighlightDescription3']
          })
          highlights.push({
            title: tagData['tagPageHighlightTitle4'],
            image: tagData['tagPageHighlightImage4']['data']['url'],
            pullQuote: tagData['highlightPullQuote4'],
            description: tagData['tagPageHighlightDescription4']
          })
          highlights.push({
            title: tagData['tagPageHighlightTitle5'],
            image: tagData['tagPageHighlightImage5']['data']['url'],
            pullQuote: tagData['highlightPullQuote5'],
            description: tagData['tagPageHighlightDescription5']
          })
          var tag = {
            heroImage: tagData['tagPageHeroBanner'],
            title: tagData['tagPageTitle'],
            description: tagData['tagPageIntroText'],
            tagPageNotes: tagData['tagPageNotes'],
            highlights: highlights,
            faqs: tagData['faqs']['data'],
            relatedTours: tagData['relatedTours']['data'],
            sitesVisited: tagData['sitesVisited'],
            metaTitle: tagData['tagPageMetaTitle'],
            metaDescription: tagData['tagPageMetaDescription']
          }
          resolve(tag)
        } else {
          reject(new Error(response.body.error.message))
        }
      }, error => {
        reject(error)
      })
    })
  }

  getGuideProfile (name) {
    return new Promise((resolve, reject) => {
      this.wrapper.getTourGuideByName(name).then(info => {
        var promises = []
        promises.push(this.wrapper.getCityById(info['tourGuideCity']['sys']['id']))
        promises.push(this.wrapper.getCountryById(info['tourGuideCountry']['sys']['id']))
        promises.push(this.wrapper.getImageAssetURL(info['tourGuideImage'][0]['sys']['id']))
        if (info['tourGuideFeaturedTour'] !== undefined) {
          for (var index in info['tourGuideFeaturedTour']) {
            var feature = info['tourGuideFeaturedTour'][index]
            promises.push(this.wrapper.getTourById(feature['sys']['id']))
          }
        }
        Promise.all(promises).then(values => {
          var city = values[0]['fields']['cityListingName']
          var country = values[1]['fields']['countryName']
          var assetURL = values[2]
          var tours = []
          var slugPromises = []
          for (var index = 0; index < values.length - 3; index++) {
            var tour = values[index + 3]
            slugPromises.push(this.wrapper.getCitySlugById(tour['fields']['tourCity']['sys']['id']))
          }
          Promise.all(slugPromises).then(slugs => {
            for (var index = 0; index < slugs.length; slugs++) {
              var tour = values[index + 3]
              tours.push({
                citySlug: slugs[index],
                slug: tour['fields']['tourPageURL'],
                titleShort: tour['fields']['tourPageTitleShort']
              })
            }
            resolve({
              fullName: info['tourGuideName'],
              tourGuideImage: assetURL,
              country: country,
              city: city,
              description: info['tourGuideFeaturedDescription'],
              quote: info['guidePullQuote'],
              descriptionLong: info['guideLongCopy'],
              tours: tours
            })
          }, error => reject(error))
        }, error => {
          reject(error)
        })
      }, error => {
        reject(error)
      })
    })
  }

  getCompareDetail (slug, selectedTours) {
    return new Promise((resolve, reject) => {
      let compareTags = Vuex.Store.compareTags
      var detail = {
        slug: slug,
        tagName: compareTags.title
      }
      resolve(detail)
    })
  }
  // eslint-disable-next-line
  removeCart (stageId, bookingid) {
    var self = this
    return new Promise((resolve, reject) => {
      var payload = {
        sales_channel: 'takewalks',
        booking_id: bookingid,
        stage_id: stageId
      }
      Vue.http.headers.common['Authorization'] = 'Bearer ' + self.accessToken
      Vue.http.post(self.bookingURL + 'product/cancel', payload).then((response) => {
        if (response.body.status === 'success') {
          Vue.localStorage.set('Discounts', JSON.stringify(response.body.data))
        } else {
          console.log('error removing item from cart')
        }
      }, error => {
        Vue.http.options.emulateJSON = true
        reject(error)
      })
    })
  }
  removeOptionCart (stageId, bookingid) {
    var self = this
    return new Promise((resolve, reject) => {
      var payload = {
        sales_channel: 'takewalks',
        booking_id: bookingid,
        stage_id: stageId.split(',')
      }
      Vue.http.headers.common['Authorization'] = 'Bearer ' + self.accessToken
      Vue.http.post(self.bookingURL + 'product/cancel', payload).then((response) => {
        if (response.body.status === 'success') {
          Vue.localStorage.set('Discounts', JSON.stringify(response.body.data))
        } else {
          console.log('error removing item from cart')
        }
      }, error => {
        Vue.http.options.emulateJSON = true
        reject(error)
      })
    })
  }
  addCart (bookingID, cart) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      var adults = 0
      var seniors = 0
      var students = 0
      var children = 0
      var infants = 0

      for (var index in cart.guests) {
        var guest = cart.guests[index]
        switch (guest.type) {
          case 'adults':
            adults = guest.count
            break
          case 'infants':
            infants = guest.count
            break
          case 'children':
            children = guest.count
            break
          case 'students':
            students = guest.count
            break
          default:
            seniors = 0
            break
        }
      }

      var data = {
        date: cart.datetime,
        productLocatorType: cart.productLocatorType.toLowerCase(),
        productCode: cart.productLocator,
        number_adults: adults,
        number_seniors: seniors,
        number_students: students,
        number_children: children,
        number_infants: infants,
        productLocatorOptions: cart.productLocatorOptions,
        currency_code: 'USD',
        'sales_channel': 'takewalks'
      }

      if (bookingID != null) {
        data.booking_id = bookingID
      }
      Vue.http.options.emulateJSON = false
      Vue.http.post(self.bookingURL + 'product', data).then((response) => {
        if (response.body.status === 'success') {
          console.log(response.body)
          var bookingData = response.body.data
          Vue.localStorage.set('Discounts', JSON.stringify(bookingData))
          Vue.http.options.emulateJSON = true
          resolve(bookingData)
        } else {
          Vue.http.options.emulateJSON = true
          if (response.body.message !== undefined) {
            reject(new Error(response.body.message))
            $('.span-booking-error-message').html(response.body.message)
            $('.booking-error-message').show()
            $('.btn-book-now').show()
            $('.book-now-loading').hide()
          } else {
            reject(new Error(response.body.error.message))
          }
        }
      }, error => {
        Vue.http.options.emulateJSON = true
        reject(error)
      })
    })
  }

  bookingDetailIds (bookingId) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(self.bookingURL + bookingId).then((response) => {
        var ids = []
        console.log(response.body.data)
        for (var i = 0; i < response.body.data.length; i++) {
          console.log(i)
          console.log(response.data)
          ids.push(response.body.data[i].booking_detail_id)
        }
        Vue.localStorage.set('BookingDetailIds', ids)
        resolve(ids)
      }, error => {
        reject(error)
      })
      resolve()
    })
  }
  bookInitialize (info) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.post(self.bookingURL + 'process/initialize', info).then((response) => {
        if (response.body.status === 'success') {
          console.log(response.body)
          var data = {
            bookingID: response.body.data.booking_id,
            stageIds: response.body.data.stage_ids
          }
          Vue.http.options.emulateJSON = true
          resolve(data)
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

  bookFinalize (info) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.post(self.bookingURL + 'process/finalize', info).then((response) => {
        if (response.body.status === 'success') {
          Vue.http.options.emulateJSON = true
          Vue.localStorage.set('BookingDetailIds', response.body.data.booking_detail_ids)
          console.log(response.body.data.booking_detail_ids)
          resolve()
        } else {
          Vue.http.options.emulateJSON = true
          $('.error-message-booking').html(response.body.message).stop(1, 1).fadeIn()
          reject(new Error(response.body.message))
        }
      }, error => {
        Vue.http.options.emulateJSON = true
        reject(error)
      })
    })
  }

  getCollateral () {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.get(self.inventoryURL + 'collateral/success').then((response) => {
        if (response.body.status === 'success') {
          Vue.localStorage.set('twSuccess', JSON.stringify(response.body.data.twSuccess.data))
          Vue.localStorage.remove('BookingID')
          Vue.localStorage.remove('BookingDetailIds')
          resolve()
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

  confirmationEmail (info) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      Vue.http.post(self.bookingURL + 'sendBookingConfirmation', info).then((response) => {
        if (response.body.status === 'success') {
          Vue.http.options.emulateJSON = true
          resolve()
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

  applyPromo (bookingID, promoCode) {
    var self = this
    return new Promise((resolve, reject) => {
      Vue.http.options.emulateJSON = true
      Vue.http.headers.common['Authorization'] = 'Bearer ' + this.accessToken
      var data = {
        booking_id: bookingID,
        promo_code: promoCode
      }
      Vue.http.post(self.bookingURL + 'promo', data).then((response) => {
        if (response.body.status === 'success') {
          $('.promo-code-applied').show()
          $('.promocode-input').hide()
          $('.promo-code-promo').hide()
          Vue.http.options.emulateJSON = true
          resolve(response.body.data)
        } else {
          $('.promo-error-message').html(response.body.message)
          $('.promo-error-message').show()
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
