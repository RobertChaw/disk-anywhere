## [Disk Anywhere 一个在线 U 盘][1]

存储任何临时文件，支持`断点续传`、`大文件上传`

## 技术栈

* `Midway Hooks`（前后端一体化）
* `React` 前端框架
* `AntD`
* `Tailwind`
* `Blob` 实现文件切割

## Commands

- `yarn`: 依赖安装
- `npm run dev`: 启动开发服务器
- `npm run build`: 打包应用
- `npm run start`: 运行打包后的文件
- `docker compose up -d --build`: docker一键部署

## File Structure

- `src`: source code, include backend and frontend
    - `api`: backend code
    - `others`: frontend code
- `public`: static files
- `midway.config.ts`: project config
- `index.html`: entry file

[1]: http://robertchaw.me:3000
