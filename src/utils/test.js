/*
 * @Author: BINGWU
 * @Date: 2024-08-02 11:27:50
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-05 14:32:34
 * @FilePath: \print_client_service\src\utils\test.js
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
 */
//获取模板数据 http://192.168.0.30/print/getTemplate/work_order_cutting_info
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      "code": 200,
      "data": {
        "cid": "e7990a28dfd44df6887c6f51bcaa4f50",
        "createby": "4e0aaaa5edca4f77becab78d15fe20d2",
        "createtime": "2024-07-17 09:33:24",
        "id": "1813386487770271744",
        "name": "裁床打印",
        "object_code": "work_order_cutting_info",
        "remark": null,
        "template_json": "{\"panels\":[{\"index\":0,\"height\":80,\"width\":40,\"paperHeader\":0,\"paperFooter\":226.7716535433071,\"printElements\":[{\"options\":{\"left\":1.5,\"top\":10.5,\"height\":9.75,\"width\":109.5,\"field\":\"productName\",\"testData\":\"%u8FD9%u662F%u4E00%u4E2A%u4EA7%u54C1%u7684%u540D%u79F0%uFF01%uFF01%uFF01\",\"fontSize\":12,\"fontWeight\":\"bolder\",\"lineHeight\":12.75,\"fontFamily\":\"Microsoft%20YaHei\"},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":1.5,\"top\":37.5,\"height\":9.75,\"width\":111,\"title\":\"%u5E8A%u53F7\",\"field\":\"cuttingCode\",\"testData\":\"305-1\",\"fontSize\":12,\"fontWeight\":\"bolder\",\"fontFamily\":\"Microsoft%20YaHei\"},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":1.5,\"top\":49.5,\"height\":9.75,\"width\":111,\"title\":\"%u7801%u5B50\",\"field\":\"spec\",\"testData\":\"%u7EA2%u8272/XLLLLLL\",\"fontSize\":12,\"fontWeight\":\"bolder\",\"fontFamily\":\"Microsoft%20YaHei\",\"lineHeight\":12.75},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":1.5,\"top\":76.5,\"height\":9.75,\"width\":108,\"title\":\"%u6761%u6570\",\"field\":\"num\",\"testData\":\"80\",\"fontFamily\":\"Microsoft%20YaHei\",\"fontSize\":12.75,\"fontWeight\":\"bolder\"},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":3,\"top\":96,\"height\":55.5,\"width\":58.5,\"field\":\"barcodeUrl\"},\"printElementType\":{\"type\":\"image\"}},{\"options\":{\"left\":63,\"top\":117,\"height\":9.75,\"width\":37.5,\"fontFamily\":\"Microsoft%20YaHei\"},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":63,\"top\":133.5,\"height\":9.75,\"width\":46.5,\"title\":\"%u624E%u53F7\",\"field\":\"bundleNo\",\"testData\":\"12\",\"fontSize\":7.5,\"fontWeight\":\"bolder\",\"fontFamily\":\"Microsoft%20YaHei\"},\"printElementType\":{\"type\":\"text\"}},{\"options\":{\"left\":0,\"top\":160.5,\"height\":9.75,\"width\":111,\"field\":\"printTime\",\"testData\":\"2024-1-22%2011%3A14\",\"fontWeight\":\"bolder\",\"fontFamily\":\"Microsoft%20YaHei\",\"textAlign\":\"center\"},\"printElementType\":{\"type\":\"text\"}}],\"paperNumberLeft\":82.5,\"paperNumberTop\":204,\"paperNumberDisabled\":true}]}",
        "updateby": "4e0aaaa5edca4f77becab78d15fe20d2",
        "updatetime": "2024-07-24 10:47:30"
      },
      "state": "ok"
    })
  }, 1000)
})

const generateArray = (n) => {
  const item = {
    "printDate": null,
    "barcodeUrl": "http://cdn.iipcloud.com/mgy_wechatAPPQrcode_1809150278080548864.jpg",
    "totalBundleNum": 2,
    "totalLayerNum": 11,
    "totalPieceNum": 22,
    "cuttingRemark": null,
    "wxUrl": "https://wechat.mgy.iipcloud.com/wxApp/scanReport?qrcodeId=1818591090136195072",
    "spec": "21/黑色",
    "remark": "",
    "num": 11,
    "orderNo": 1201002,
    "color": null,
    "productName": "校服裤子",
    "part": "",
    "cuttingCode": "11",
    "layerNum": 11,
    "layerNo": null,
    "bundleNo": 2,
    "workOrderCode": null,
    "size": null
  }

  return Array.from({ length: n }, () => ({ ...item }))
}
// 获取要打印的数据列表 http://192.168.0.30/workOrder/cutting/getPrintTicketData
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      "msg": "操作成功",
      "data": generateArray(2),
      "state": "ok"
    })
  }, 1000)
})

export { p1, p2 }