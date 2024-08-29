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
import { hiprint, disAutoConnect } from "vue-plugin-hiprint"

disAutoConnect();
// hipirnt构建的html有高度误差,要重新构建加1
const modifyHeightAndGetSize = (jsonString) => {
  // 解析 JSON 字符串为对象
  const jsonObject = JSON.parse(jsonString)
  const width = jsonObject.panels[0].width || 40;
  const height = jsonObject.panels[0].height || 80;
  // 将修改后的对象转换回 JSON 字符串
  return [jsonString, width, height]
}
const generateHtml = async (template_json, recordList) => {
  const buildPreviewHtml = (templateJson, recordList) => {
    let printTemplate = new hiprint.PrintTemplate({
      template: templateJson,
    })
    return printTemplate.getHtml(recordList)[0].outerHTML
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




