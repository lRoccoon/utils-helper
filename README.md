# Utils Helper

[English](#english) | [中文](#中文)

## English

A comprehensive suite of developer tools featuring API utilities and frontend web tools.

### Features

#### Backend APIs

- **IP Address Display**: Shows IP address and geolocation information for both IPv4 and IPv6
- **Chinese Legal Holiday Query**: Check if a date is a legal holiday or workday in China

#### Frontend Web Tools

- **JSON Tools**:
  - Structured JSON viewer with nested parsing
  - Search and filter by key/value
  - Escape/unescape, Unicode to Chinese conversion
  - Compress and format
  - Expand/collapse to specified levels (default 2 levels)
  - One-click copy functionality

- **YAML & TOML Tools**: Same capabilities as JSON tools

- **Diff Tool**:
  - Text comparison
  - JSON/YAML/TOML comparison with key sorting

- **Conversion Tools**:
  - JSON ↔ YAML ↔ TOML conversion
  - JSON → Go/Rust struct generation

### Technology Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Go 1.21 with Gin framework
- **Testing**: Jest (frontend), Go testing (backend) with 90%+ coverage requirement
- **Deployment**: Docker with multi-architecture support (amd64, arm64)
- **CI/CD**: GitHub Actions for automated testing and Docker image building

### Quick Start

#### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

#### Local Development

**Backend:**

```bash
cd backend
go mod download
go run cmd/server/main.go
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### API Documentation

#### IP Address API

```bash
# Get current IP information
curl http://localhost:8080/api/ip
```

Response:
```json
{
  "ip": "192.168.1.100",
  "version": "IPv4",
  "country": "China",
  "country_code": "CN",
  "region": "Beijing",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074
}
```

#### Holiday Query API

```bash
# Check if today is a holiday
curl http://localhost:8080/api/holiday

# Check specific date
curl http://localhost:8080/api/holiday/2026-02-23
```

Response:
```json
{
  "date": "2026-02-23",
  "is_holiday": true,
  "is_workday": false,
  "name": "春节",
  "type": "holiday"
}
```

### Development

#### Running Tests

**Backend:**
```bash
cd backend
go test -v -race -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**Frontend:**
```bash
cd frontend
npm run test
npm run test:coverage
```

#### Building

**Backend:**
```bash
cd backend
go build -o bin/server cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm run build
```

### Deployment

#### Docker Images

Images are automatically built and pushed to GitHub Container Registry:

- Backend: `ghcr.io/lroccoon/utils-helper-backend:latest`
- Frontend: `ghcr.io/lroccoon/utils-helper-frontend:latest`

```bash
# Pull and run
docker pull ghcr.io/lroccoon/utils-helper-backend:latest
docker pull ghcr.io/lroccoon/utils-helper-frontend:latest

docker run -d -p 8080:8080 ghcr.io/lroccoon/utils-helper-backend:latest
docker run -d -p 3000:3000 ghcr.io/lroccoon/utils-helper-frontend:latest
```

### User Experience

- **Modern UI**: Clean and responsive design with Tailwind CSS
- **Global Search**: Press `Cmd/Ctrl + K` to search all tools
- **Real-time API Results**: Live display of IP address and holiday information
- **Dark Mode Support**: Automatic dark mode based on system preferences

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

MIT License - see [LICENSE](LICENSE) file for details

---

## 中文

一个综合性的开发者工具套件，包含 API 工具和前端页面工具。

### 功能特性

#### 后端 API

- **IP 地址显示**：显示 IPv4 和 IPv6 地址的 IP 和地理位置信息
- **国内法定节假日查询**：查询指定日期是否为法定节假日或工作日

#### 前端 Web 工具

- **JSON 工具**：
  - 结构化 JSON 查看器，支持嵌套解析
  - 按键/值搜索和过滤
  - 转义/反转义，Unicode 转中文
  - 压缩和格式化
  - 展开/收起到指定层级（默认 2 层）
  - 一键复制功能

- **YAML 和 TOML 工具**：与 JSON 工具相同的功能

- **对比工具**：
  - 文本对比
  - JSON/YAML/TOML 对比（支持键排序）

- **转换工具**：
  - JSON ↔ YAML ↔ TOML 相互转换
  - JSON → Go/Rust 结构体生成

### 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Go 1.21 + Gin 框架
- **测试**：Jest（前端），Go testing（后端），测试覆盖率要求 90% 以上
- **部署**：Docker 多架构支持（amd64, arm64）
- **CI/CD**：GitHub Actions 自动化测试和 Docker 镜像构建

### 快速开始

#### 使用 Docker Compose（推荐）

```bash
docker-compose up -d
```

访问应用：
- 前端：http://localhost:3000
- 后端 API：http://localhost:8080

#### 本地开发

**后端：**

```bash
cd backend
go mod download
go run cmd/server/main.go
```

**前端：**

```bash
cd frontend
npm install
npm run dev
```

### API 文档

#### IP 地址 API

```bash
# 获取当前 IP 信息
curl http://localhost:8080/api/ip
```

响应：
```json
{
  "ip": "192.168.1.100",
  "version": "IPv4",
  "country": "中国",
  "country_code": "CN",
  "region": "北京",
  "city": "北京",
  "latitude": 39.9042,
  "longitude": 116.4074
}
```

#### 节假日查询 API

```bash
# 查询今天是否为节假日
curl http://localhost:8080/api/holiday

# 查询指定日期
curl http://localhost:8080/api/holiday/2026-02-23
```

响应：
```json
{
  "date": "2026-02-23",
  "is_holiday": true,
  "is_workday": false,
  "name": "春节",
  "type": "holiday"
}
```

### 开发

#### 运行测试

**后端：**
```bash
cd backend
go test -v -race -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**前端：**
```bash
cd frontend
npm run test
npm run test:coverage
```

#### 构建

**后端：**
```bash
cd backend
go build -o bin/server cmd/server/main.go
```

**前端：**
```bash
cd frontend
npm run build
```

### 部署

#### Docker 镜像

镜像会自动构建并推送到 GitHub Container Registry：

- 后端：`ghcr.io/lroccoon/utils-helper-backend:latest`
- 前端：`ghcr.io/lroccoon/utils-helper-frontend:latest`

```bash
# 拉取并运行
docker pull ghcr.io/lroccoon/utils-helper-backend:latest
docker pull ghcr.io/lroccoon/utils-helper-frontend:latest

docker run -d -p 8080:8080 ghcr.io/lroccoon/utils-helper-backend:latest
docker run -d -p 3000:3000 ghcr.io/lroccoon/utils-helper-frontend:latest
```

### 用户体验

- **现代化界面**：使用 Tailwind CSS 设计的简洁响应式界面
- **全局搜索**：按 `Cmd/Ctrl + K` 搜索所有工具
- **实时 API 结果**：实时显示 IP 地址和节假日信息
- **深色模式支持**：根据系统偏好自动切换深色模式

### 贡献

欢迎贡献代码！请随时提交 Pull Request。

### 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
