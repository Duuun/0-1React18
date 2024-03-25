export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;

// 项目挂载的根节点
export const HostRoot = 3;

// <div> 对应的fiber node
export const HostComponent = 5;
// 比如div中对应的文本
export const HostText = 6;
