let url = 'https://xhamster.com/photos/gallery/chinese-beauty-13529026'

const spiderConfig = [
  {
    methodName: 'gotoPage', 
    params: {
      url
    }
  },
  {
    methodName: 'querySelector',
    params: {
      selector: '.page-title__count',
      callback: (elem) => {
        return elem.innerHTML
      }
    },
    returnKey: 'photoCount'
  },
  {
    methodName: 'querySelectorAll',
    params: {
      selector: '.gallery-section .xh-paginator-button:last-child',
      callback: (pageItems) => {
        return pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 1
      }
    },
    returnKey: 'totalPage'
  },
  {
    methodName: 'pageEvaluate',
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
    returnKey: 'galleryName'
  },
  // {
  //   method: 'pageEvaluate',
  //   params: {
  //     callback: () => window.initials.photosGalleryModel.photos
  //   }
  // },
]

module.exports = {
  spiderConfig,
  url
}