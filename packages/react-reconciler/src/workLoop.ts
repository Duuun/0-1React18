// 定义一个全局的指针来指向当前工作的 fiberNode

import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

// 1.1 定义初始化操作方法
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

// 6. 调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 拿到根节点 fiberRootNode
	const root = markUpdateFormToRoot(fiber);
	// 从根节点开始更新流程
	renderRoot(root);
}

// 7. 从当前结点遍历到根节点
function markUpdateFormToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	// node赋值给父亲，然后父亲等于父亲的父亲
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

// 定义最终执行的方法 renderRoot
function renderRoot(root: FiberRootNode) {
	// 1. 初始化：让workInProgress 指向我们要遍历的第一个fiberNode
	prepareFreshStack(root);

	// 2. 执行递归的流程
	do {
		try {
			// 3. workLoop遍历结点
			workLoop();
			break;
		} catch (e) {
			// 只有在开发环境中才会打印
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip finishedWork树 树中的flags
	// commitRoot(root);
}

// 3.1 定义遍历结点总的方法workLoop
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

// 4.递归的递：遍历子节点
function performUnitOfWork(fiber: FiberNode) {
	//next 是fiber的子fiber，或者是null(到尾了)
	const next = beginWork(fiber);
	// 执行完后就可以给memoizedProps赋值
	fiber.memoizedProps = fiber.pendingProps;
	// 如果没有子fiber,就是到尾了，就可以进行归了
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		// 没有到尾,继续执行performUnitOfWork，向下遍历
		workInProgress = next;
	}
}

//5. 递归的递：遍历兄弟节点
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		// 看sibling存不存在
		const sibling = node?.sibling;
		if (sibling !== null) {
			// 如果存在，把他赋值给workInProgress 继续递归的递
			workInProgress = sibling;
			return;
		} else {
			// sibling不存在的话，应该继续往，node返回它的父节点
			node = node?.return;
			workInProgress = node;
		}
	} while (node !== null);
}
