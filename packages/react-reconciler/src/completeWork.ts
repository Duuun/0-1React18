// 递归中的 归 阶段

// 要构建离屏的dom树 1.构建dom树  2.将dom插入dom树中

import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostText, HostComponent, HostRoot } from './workTags';
import { NoFlags } from './fiberFlags';

export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps; //要更新的新属性
	const current = wip.alternate; //上一次渲染时的备份节点

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1.构建dom树

				const instance = createInstance(wip.type, newProps);

				// 2.将dom插入dom树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}

			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1.构建dom树

				const instance = createTextInstance(newProps.content);

				wip.stateNode = instance;
			}

			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;

		default:
			if (__DEV__) {
				console.warn('未处理的complete情况', wip);
			}
			break;
	}
};

// 将dom插入dom树中
function appendAllChildren(parent: FiberNode, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostText || node.tag === HostComponent) {
			// 会执行插入方法
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return !== node;
			node = node.child;
			continue;
		}
		// 结束
		if (node === wip) {
			return;
		}

		// 兄弟结点
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subtreeFlags;
}
