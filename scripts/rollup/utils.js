import path from 'path';
import fs from 'fs'; //处理文件读写
import { fileURLToPath } from 'url';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

// pkgPath就是package.json
const dirname = path.dirname(fileURLToPath(import.meta.url));

const pkgPath = path.resolve(dirname, '../../packages');
const distPath = path.resolve(dirname, '../../dist/node_modules'); //规范来说放在node_modules

// 解析包的路径，isDist:是否是产物的路径
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

// 包的路径
export function getPackageJSON(pkgName) {
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str); // 把path读成字符串，然后序列化
}

// 写plugins:定义一个方法来获取所有公用的plugins
// 有1. 用于解析common js规范的plugins 2.将源码中ts代码转义成js代码的typescript的plugins

export function getBaseRollupPlugins({
	alias = { __DEV__: true },
	typescript = {}
} = {}) {
	return [replace(alias), cjs(), ts(typescript)];
}
