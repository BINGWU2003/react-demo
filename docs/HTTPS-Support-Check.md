# HTTPS支持检查机制

## 功能概述

本应用实现了一套完整的HTTPS支持检查机制，能够在启动时自动检测当前操作系统环境是否支持安全的HTTPS连接。如果发现系统环境不支持现代HTTPS连接（比如TLS 1.2或更高版本），应用将自动将API请求从HTTPS降级为HTTP，确保在各类环境中的兼容性。

## 实现原理

HTTPS支持检查主要从两个方面进行：

### 1. 操作系统版本检查

```javascript
// Windows XP (5.1) 及以下版本不支持现代HTTPS
if (platform === 'win32') {
    const majorVersion = parseInt(release.split('.')[0]);
    if (majorVersion < 6) {  // Windows Vista及以上是6.0+
        log('操作系统版本过低不支持HTTPS，退化为HTTP请求');
        return false;
    }
}
```

操作系统版本检查能够快速识别明显不支持现代HTTPS连接的老旧系统，如Windows XP及更早版本。这些系统由于底层加密库过时，无法支持现代的TLS协议。

### 2. TLS版本检测

应用会通过两种方式检测TLS支持：

#### 注册表检查（Windows平台）

```javascript
exec('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" /v Enabled', (error, stdout) => {
    if (error || stdout.indexOf('0x1') === -1) {
        // TLS 1.2未启用，尝试进行实际TLS连接测试
        testTLSConnection().then(result => resolve(result));
        return;
    }
    
    // TLS 1.2在注册表中被标记为启用
    resolve({ supported: true, version: '1.2', source: 'registry' });
});
```

在Windows系统上，首先通过检查注册表来确定TLS 1.2是否被启用。

#### 实际连接测试（所有平台）

```javascript
const socket = tls.connect({
    host: service.host,
    port: service.port,
    rejectUnauthorized: false,
    timeout: 4000,
    servername: service.host // 指定SNI参数
}, () => {
    // 检查TLS版本
    const version = socket.getProtocol();
    
    if (version && (version.includes('TLSv1.2') || version.includes('TLSv1.3'))) {
        resolve({ supported: true, version: version, source: 'connection-test' });
    } else {
        resolve({ supported: false, reason: `TLS版本过低: ${version || '未知'}`, version: version });
    }
});
```

通过实际尝试连接到知名HTTPS服务来检测系统支持的TLS版本。这是最可靠的检测方法，因为它能够验证整个TLS栈的实际工作状态。

## 中国国内环境适配

为了适应中国国内网络环境的特殊性，我们针对性地做了以下适配：

1. **使用国内可靠服务进行测试**：
   ```javascript
   const chineseServices = [
       { host: 'www.baidu.com', port: 443 },
       { host: 'www.qq.com', port: 443 },
       { host: 'www.taobao.com', port: 443 },
       { host: 'www.aliyun.com', port: 443 }
   ];
   ```
   
   应用会随机选择这些服务之一进行测试，提高测试成功率。

2. **故障转移机制**：
   如果首选服务连接失败，应用会自动尝试连接其他服务，直到尝试完所有服务或成功建立连接。

3. **正确设置SNI参数**：
   SNI (Server Name Indication) 参数在中国国内网络环境中尤为重要。许多中国的CDN和网站会严格验证SNI参数，不正确设置可能导致连接被拒绝。

   ```javascript
   servername: service.host // 指定SNI参数
   ```

## SNI (Server Name Indication) 的重要性

SNI是TLS握手过程中的一个扩展功能，在以下场景中特别重要：

1. **多网站共享IP**：
   允许服务器在同一个IP地址上托管多个HTTPS网站，客户端通过SNI指明想要连接的具体域名。

2. **CDN服务**：
   许多CDN提供商会根据SNI参数来确定为请求提供何种证书和内容。

3. **中国国内网络环境**：
   某些网络运营商和CDN可能会对没有正确设置SNI参数的请求进行特殊处理，可能导致连接被拒绝或性能下降。

4. **证书验证**：
   服务器需要SNI信息来选择提供哪个证书，没有SNI可能导致证书不匹配错误。

## HTTPS降级流程

当检测到系统不支持安全HTTPS连接时，应用会执行以下降级流程：

1. **识别不支持情况**：
   - 操作系统版本过低
   - TLS版本低于1.2
   - 连接测试失败

2. **URL协议替换**：
   ```javascript
   config.baseUrl = config.baseUrl.replace('https://', 'http://');
   ```

3. **应用到axios请求**：
   ```javascript
   updateBaseURL(config.baseUrl);
   ```

4. **记录日志**：
   ```javascript
   window.electron?.generateLog?.(`由于中国国内网络环境特殊性，检测到系统环境不支持安全HTTPS连接，API地址已从 ${originalUrl} 退化为 ${config.baseUrl}`);
   ```

## HTTPS检查相关API详解

以下是实现HTTPS支持检查所使用的核心API：

### 1. OS模块 API

```javascript
const os = require('os');

// 获取操作系统平台（如'win32', 'darwin', 'linux'）
const platform = os.platform();

// 获取操作系统版本号（如Windows 10可能返回'10.0.19042'）
const release = os.release();
```

**用途**：判断操作系统类型和版本，确定系统是否可能支持现代HTTPS连接。例如，Windows XP（版本号5.1）不支持TLS 1.2，而Windows 7（版本号6.1）及以上版本原生支持TLS 1.2。

### 2. TLS模块 API

```javascript
const tls = require('tls');

// 创建TLS/SSL连接
const socket = tls.connect({
    host: 'www.baidu.com',      // 目标主机名
    port: 443,                  // HTTPS标准端口
    rejectUnauthorized: false,  // 测试时不验证证书有效性
    timeout: 4000,              // 连接超时时间（毫秒）
    servername: 'www.baidu.com' // SNI参数，必须与host一致
}, () => {
    // 连接成功的回调
    
    // 获取协商使用的TLS协议版本 - 这是判断TLS支持的关键
    const protocolVersion = socket.getProtocol(); // 如'TLSv1.2', 'TLSv1.3'等
    
    // 结束连接
    socket.end();
});

// 错误处理
socket.on('error', (error) => {
    // 连接失败，可能是TLS不支持或网络问题
    socket.destroy();
});
```

**核心方法**：
- `tls.connect()`: 建立TLS安全连接
- `socket.getProtocol()`: 获取协商后的TLS协议版本，是判断TLS支持级别的关键
- `socket.on('error')`: 处理连接错误，可能表明系统不支持目标TLS版本

**重要参数**：
- `rejectUnauthorized`: 测试时设为false，避免证书验证问题影响测试
- `servername`: SNI参数，必须正确设置，尤其在中国网络环境下
- `timeout`: 连接超时设置，避免测试过程长时间阻塞

### 3. Child_Process模块（exec）API

```javascript
const { exec } = require('child_process');

// 执行Windows注册表查询命令，检查TLS 1.2是否在系统层面启用
exec('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" /v Enabled', (error, stdout, stderr) => {
    if (error) {
        // 查询出错，可能是系统不支持或命令执行问题
        return;
    }
    
    // 分析命令输出，0x1表示启用
    if (stdout.indexOf('0x1') !== -1) {
        // TLS 1.2已启用
    } else {
        // TLS 1.2未启用或被禁用
    }
});
```

**用途**：在Windows系统上快速检查TLS 1.2是否已在系统层面启用，而无需进行实际的网络连接测试。

### 4. Electron IPC通信 API（HTTPS检查相关）

```javascript
// 主进程 (main.js)
const { ipcMain } = require('electron');

// 注册HTTPS支持检查处理程序
ipcMain.handle('check-https-support', async () => {
    try {
        // 检查操作系统版本
        const platform = os.platform();
        const release = os.release();
        
        // Windows XP及更早版本不支持
        if (platform === 'win32' && parseInt(release.split('.')[0]) < 6) {
            return false;
        }
        
        // 检查TLS版本支持
        const tlsSupport = await checkTLSSupport(); // 前面定义的TLS检查函数
        return tlsSupport.supported;
    } catch (error) {
        return false; // 出错时保守返回不支持
    }
});

// 预加载脚本 (preload.js)
contextBridge.exposeInMainWorld('electron', {
    // 暴露给渲染进程的HTTPS检查方法
    checkHttpsSupport: () => ipcRenderer.invoke('check-https-support')
});

// 渲染进程调用 (devConfig.js)
const supportsHttps = await window.electron.checkHttpsSupport();
if (!supportsHttps) {
    // 如果不支持HTTPS，进行URL降级处理
    config.baseUrl = config.baseUrl.replace('https://', 'http://');
}
```

**关键点**：
- 所有实际的HTTPS支持检查都在主进程中进行，因为渲染进程受到安全沙箱限制
- 渲染进程通过IPC通信调用主进程中的检查功能
- 检查结果用于决定是否需要将API URL从HTTPS降级为HTTP

## 日志记录

应用会记录HTTPS支持检查的完整过程，包括：

- 检查开始：`开始检测当前系统HTTPS支持情况（中国国内环境）...`
- 操作系统检查结果
- TLS版本检测信息：`检测到TLS版本: TLSv1.2`
- 连接测试结果：`正在测试TLS连接: www.baidu.com:443`
- 降级操作日志：`API地址已从 https://example.com 退化为 http://example.com`
- 错误信息：`TLS连接测试错误: ...`

## 注意事项

1. **安全性考虑**：
   HTTP连接不如HTTPS安全，降级只应在确实必要的情况下进行。

2. **故障排查**：
   如果出现连接问题，可查看应用日志了解HTTPS支持检查的详细结果。

3. **网络限制环境**：
   在企业环境或某些特殊网络环境中，可能存在阻止TLS连接测试的防火墙或代理设置。此时可能需要手动配置。

4. **未来兼容性**：
   随着TLS标准的发展，可能需要定期更新检测逻辑，确保与最新安全标准兼容。 