/*
 * @Author: BINGWU
 * @Date: 2024-08-02 11:16:08
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-22 17:19:13
 * @FilePath: \print_client_service\src\utils\generateHtml.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
import rootHtml from "@/utils/rootHtml"
import { hiprint } from "vue-plugin-hiprint"
// hipirnt构建的html有高度误差,要重新构建加1
const modifyHeightAndGetSize = (jsonString) => {
  // 解析 JSON 字符串为对象
  const jsonObject = JSON.parse(jsonString)
  let width = 0
  let height = 0
  // 修改一次
  let isModifyHeight = false
  // 修改一次
  let isModifyWidth = false
  // 递归函数遍历对象并修改 height 值
  const traverseAndModify = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'height' && typeof obj[key] === 'number') {
          if (!isModifyHeight) {
            // 高度要加1
            height = obj[key]
            obj[key] += 1
            isModifyHeight = true
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverseAndModify(obj[key])
        } else if (key === 'width' && typeof obj[key] === 'number') {
          if (!isModifyWidth) {
            width = obj[key]
            isModifyWidth = true
          }
        }
      }
    }
  }

  // 开始遍历和修改
  traverseAndModify(jsonObject)

  // 将修改后的对象转换回 JSON 字符串
  return [JSON.stringify(jsonObject), width, height]
}
const generateHtml = async (template_json, recordList) => {
  const buildPreviewHtml = (templateJson, recordList) => {
    let printTemplate = new hiprint.PrintTemplate({
      template: templateJson,
    })
    return printTemplate.getHtml(recordList)[0].innerHTML
  }
  const [new_template_json, width, height] = modifyHeightAndGetSize(template_json)
  let templateJson = JSON.parse(new_template_json, function (k, v) {
    if (typeof (v) == 'string') {
      return unescape(v)
    }
    return v
  })
  return [rootHtml(buildPreviewHtml(templateJson, recordList)), width, height]
}

export default generateHtml




