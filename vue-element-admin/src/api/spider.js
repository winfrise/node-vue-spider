import request from '@/utils/request'

export function editGallery({ galleryName, galleryURL, id }) {
  return request({
    url: '/xhamster-puppeteer/gallery/edit',
    method: 'post',
    data: { galleryName, galleryURL, id }
  })
}

export function deleteGallery(id = '') {
  return request({
    url: '/xhamster-puppeteer/gallery/delete',
    method: 'post',
    data: { id }
  })
}

export function fetchGalleryList(params) {
  return request({
    url: '/xhamster-puppeteer/gallery/list',
    method: 'get',
    params: params
  })
}

export function spiderGalleryPhoto(id) {
  return request({
    url: '/xhamster-puppeteer/spider/gallery-photo',
    method: 'post',
    data: { id }
  })
}

export function spiderURL(data) {
  return request({
    url: '/xhamster-puppeteer/gallery/spider/url',
    method: 'post',
    data
  })
}

export function fetchGalleryDetail(id) {
  return request({
    url: '/xhamster-puppeteer/gallery/detail',
    method: 'get',
    params: { id }
  })
}

