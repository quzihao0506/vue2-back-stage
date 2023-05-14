import request from "@/utils/request";

export const reqCategory1List = () => request({ method: 'get', url: '/admin/product/getCategory1' })

export const reqCategory2List = (category1Id) => request({ method: 'get', url: `admin/product/getCategory2/${category1Id}` })

export const reqCategory3List = (category2Id) => request({ method: 'get', url: `admin/product/getCategory3/${category2Id}` })

export const reqAttrList = (category1Id, category2Id, category3Id) => request({ method: 'get', url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })

export const reqAddAttr = (data) => request({ method: 'post', url: '/admin/product/saveAttrInfo', data })
