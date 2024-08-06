/*
 * @Author: BINGWU
 * @Date: 2024-08-02 11:16:08
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-02 13:59:36
 * @FilePath: \print_client_service\src\utils\generateHtml.js
 * @Describe: p1,p2为两个异步请求，p1为获取模板json，p2为获取数据json
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
import rootHtml from "@/utils/rootHtml"
import { hiprint } from "vue-plugin-hiprint"
// hipirnt构建的html有高度误差,要重新构建加1
const modifyHeight = (jsonString) => {
  // 解析 JSON 字符串为对象
  const jsonObject = JSON.parse(jsonString)

  // 递归函数遍历对象并修改 height 值
  const traverseAndModify = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'height' && typeof obj[key] === 'number') {
          // 高度要加1
          obj[key] += 1
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverseAndModify(obj[key])
        }
      }
    }
  }

  // 开始遍历和修改
  traverseAndModify(jsonObject)

  // 将修改后的对象转换回 JSON 字符串
  return JSON.stringify(jsonObject)
}
const generateHtml = async (p1, p2) => {
  const buildPreviewHtml = (templateJson, recordList) => {
    let printTemplate = new hiprint.PrintTemplate({
      template: templateJson,
    })
    return printTemplate.getHtml(recordList)[0].innerHTML
  }

  try {
    const [res1, res2] = await Promise.all([p1, p2])
    let templateJson = JSON.parse(modifyHeight(res1.data.template_json), function (k, v) {
      if (typeof (v) == 'string') {
        return unescape(v)
      }
      return v
    })
    let recordList = res2.data
    return [rootHtml(buildPreviewHtml(templateJson, recordList)), recordList.length]
  } catch (error) {
    console.log('error', error)
  }
}

export default generateHtml




