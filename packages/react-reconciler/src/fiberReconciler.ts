// mount 时调佣的api：会对外暴露两个函数

import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 创建整个应用的根节点 FiberRootNode ,并将hostRootFiber和FiberRootNode产生关联
export function createContainer(container: Container) {
	// 执行createContainer 是使得hostRootFiber和FiberRootNode产生关联
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue(); //初始化updateQueue实例
	return root;
}

// 创建update，并将update enqueue 到 UpdateQueue 中
// 将首屏渲染和触发更新的机制连接起来
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
