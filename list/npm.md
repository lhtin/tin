# npm笔记

## 发布带命名空间的包

- `npm adduser`：添加用户
- `npm login`：登录
- `npm publish --access public`：发布到公网

## npm link

- `npm link path/to/module`会通过软链接到当前项目，但是react-native工具不支持软链接形式的模块，所以无法使用
