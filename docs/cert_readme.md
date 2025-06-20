# 代码签名证书说明

## 证书要求
1. 需要准备一个代码签名证书（.pfx格式）
2. 将证书命名为 `certificate.pfx` 并放在此目录下

## 如何获取证书
1. **购买正规CA机构的代码签名证书**：
   - Digicert、GlobalSign、Sectigo等机构提供代码签名证书
   - 证书价格通常在几百到几千元人民币不等，有效期通常为1-3年

2. **自签名证书（仅用于测试）**：
   - 注意：自签名证书不被Windows信任，用户安装时会显示警告
   - 使用OpenSSL创建自签名证书：
     ```
     openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
     openssl pkcs12 -export -out certificate.pfx -inkey key.pem -in cert.pem
     ```

## 配置证书密码
1. 在 `package.json` 的 `build.win.certificatePassword` 字段中设置您的证书密码
2. 如果不想在配置文件中保存密码，可以使用环境变量：
   ```
   set CSC_KEY_PASSWORD=您的密码
   npm run electron:build
   ```

## 使用说明
1. 将证书文件放在此目录下
2. 确保证书文件名为 `certificate.pfx`
3. 配置正确的证书密码
4. 运行打包命令：`npm run electron:build`

## 注意事项
1. 证书文件请妥善保管，不要上传到公共代码仓库
2. 建议将此目录添加到 `.gitignore` 文件中
3. Windows下签名时可能需要安装Windows SDK 