import $http from './httputils'

let util = {}
util.install = function (Vue) {

  /**
   * 对象转数组
   * @param array
   * @returns {Array}
   */
  Vue.prototype.objToArray = function (array) {
    var arr = []
    for (var i in array) {
      arr.push(array[i])
    }
    return arr
  }


  /**
   *  清空对象中每一项值，不删除对象中的key
   * @param obj
   */
  Vue.prototype.clearObjData = function (obj) {
    Object.keys(obj).forEach(e1 => {
      obj[e1] = null
    })
  }

  Vue.prototype.copyValue = function (source, target) {
    Object.keys(target).forEach(e => {
      console.log('【copyValue】【' + e + ':' + source[e] + '】')
      if (source[e] !== null && source[e] !== '' && source[e] !== 'undefined') {
        target[e] = source[e]
      }
    })
  }

  /**
   * 获取数据字典
   * @param code  数据库查询字典类型 ex:'code_type'
   * @param callback
   */
  Vue.prototype.getDictCall = function (code, callback) {
    $http({
      path: '/system/dict/list',
      method: 'get',
      data: {type: code}
    }).then(response => {
      let res = response.data
      if (res.success) {
        console.log(res.data)
        callback(this.objToArray(res.data))
      } else {
        // this.$Message.error('获取数据字典失败！')
      }
    })
  }

  /**
   * 获取数据字典
   * @param code  数据库查询字典类型 ex:'code_type'
   * @param tank  接收数据对象的key, key对应的对象是一个数组
   */
  Vue.prototype.getDict = function (code, tank) {
    if (this.apis.dictVal[tank].length > 0) {
      return
    }
    $http({
      path: '/system/dict/list',
      method: 'get',
      data: {type: code}
    }).then(response => {
      let res = response.data
      if (res.success) {
        this.apis.dictVal[tank] = this.objToArray(res.data)
      } else {
        // this.$Message.error('获取数据字典失败！')
      }
    })
  }

  /**
   * 默认删除左右两端的空格
   * @param str
   * @param isAll  是否去掉所有的空格
   * @returns {*}
   */
  Vue.prototype.Trim = function (str, isAll) {
    if (!str){
      return str
    }
    var result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (isAll) {
      result = result.replace(/\s/g, '')
    }
    return result
  }

  /**
   * 将base64转换为文件
   * @param dataurl
   * @param filename
   * @returns {File}
   */
  Vue.prototype.base64URLtoFile = function (dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
  }

  /**
   * 将图片转换为Base64
   * @param url
   * @param callback
   */
  Vue.prototype.getImgToBase64 = function (url, callback) {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL('image/png')
      callback(dataURL)
      canvas = null
    }
    img.src = url
  }

  /**
   * param 将要转为URL参数字符串的对象
   * key URL参数字符串的前缀
   * encode true/false 是否进行URL编码,默认为true
   *
   * return URL参数字符串
   */
  Vue.prototype.urlEncode = function (param, key, encode) {
    if (param == null) return ''
    var paramStr = ''
    var t = typeof (param)
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += this.urlEncode(param[i], k, encode)
      }
    }
    return paramStr
  }

}
export default util
