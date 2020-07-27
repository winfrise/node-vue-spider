let url = 'https://xhamster.com/photos/gallery/chinese-beauty-13529026'

const test1 = [
  {
    methodName: 'gotoPage', 
    params: {
      url: this.url
    }
  },
  {
    method: 'querySelector',
    params: {
      selector: '.page-title__count',
      callback: (elem) => {
        return elem.innerHTML
      }
    },
    return: 'photoCount'
  },
  {
    method: 'querySelectorAll',
    params: {
      selector: '.gallery-section .xh-paginator-button:last-child',
      callback: (pageItems) => {
        return pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 1
      }
    },
    return: 'totolPage'
  },
  {
    method: 'pageEvaluate',
    params: {
      callback: () => {
        let url = window.location.href
        let arr = url.split('/')
        let lastPath = arr[arr.length-1]
        let arr2 = lastPath.split('-')
        arr2.pop()
      
        return arr2.join(' ')
      }
    },
    return: 'galleryName'
  },
  // {
  //   methodName: 'forEach',
  //   params: {
  //     callback: () => {

  //     }
  //   }
  // },
  // {
  //   method: 'pageEvaluate',
  //   params: {
  //     callback: () => window.initials.photosGalleryModel.photos
  //   }
  // },
]

module.exports = {
  test1,
  data: {
    url
  }
}