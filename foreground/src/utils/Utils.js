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
   * 对象数组去重
   * @param array
   * @returns {Array}
   */
  Vue.prototype.objDistinct = function (array) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < array.length; i++) {
      var keys = Object.keys(array[i]);
      keys.sort(function(a, b) {
        return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(array[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(array[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
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


  /**
   *  把 源数据中补位空的值，复制到目标数据
   * @param source
   * @param target
   */
  Vue.prototype.copyValue = function(source, target) {
    Object.keys(target).forEach(e => {
      console.log('【copyValue】【' + e + ':' + source[e] + '】')
      if (source[e] && source[e] !== null && source[e] !== '') {
        console.log('【正在copyValue】【' + e + ':' + source[e] + '】')
        if (target[e] && typeof target[e] === 'object' && typeof source[e] === 'object' && !Array.isArray(source[e])) {
          this.copyValue(source[e], target[e])
        } else {
          target[e] = source[e]
        }
      }
    })
  }

  /**
   * 对象深拷贝
   * @param source
   * @returns {*}
   */
  Vue.prototype.deepClone = function(source) {
    if (!source && typeof source !== 'object') {
      throw new Error('方法[deepClone]  传入参数不是对象')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = this.deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    })
    return targetObj
  }


  /**
   * 获取数据字典
   * @param code  数据库查询字典类型 ex:'code_type'
   * @param value 该字典类型集合中对应的某项值
   * return 对应字典名称
   */
  Vue.prototype.getDictValue = function(code, value) {
    if (!value && value !== 0) {
      return '未知'
    }
    const dictList = this.getDict(code)
    let result = ''
    for (const property in dictList) {
      if (dictList[property].value === value) {
        result = dictList[property].label
        break
      }
    }
    return result
  }

  /**
   * 获取数据字典
   * @param code  数据库查询字典类型 ex:'code_type'
   * return 对应字典类型list
   */
  Vue.prototype.getDict = function(code) {
    let dictStr = sessionStorage.getItem(code)
    if (!dictStr) {
      $http({
        path: '/system/dict/list',
        method: 'get',
        data: {type: code}
      }).then(response => {
        const rep = response.data
        if (rep.success) {
          const dictList = rep.data
          sessionStorage.setItem(code, JSON.stringify(dictList))
          dictStr = JSON.stringify(dictList)
        } else {
          console.log('获取数据字典失败！')
          return []
        }
      })
    }
    return this.objToArray(JSON.parse(dictStr))
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
    let result
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
