import request from "@/utils/request";

export const reqTradeMarkList = (page, limit) => request({ method: 'get', url: `/admin/product/baseTrademark/${page}/${limit}` })

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      method: 'put',
      url: '/admin/product/baseTrademark/update',
      data: tradeMark
    })
  } else {
    return request({
      method: 'post',
      url: '/admin/product/baseTrademark/save',
      data: tradeMark
    })
  }
}

export const reqDeleteTradeMark = id => request({ method: 'delete', url: `/admin/product/baseTrademark/remove/${id}` })
