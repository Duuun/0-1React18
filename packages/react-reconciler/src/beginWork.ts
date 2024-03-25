// 递归中的 递 阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildrenFibers, reconcileChildrenFibers } from './childFibers';

export const beginWork = (wip: FiberNode) => {
	// 比较然后返回 子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// 递归到最后的文字部分了，准备要开始归阶段
			return null;
		default:
			if (__DEV__) {
				console.log('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizeState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizeState } = processUpdateQueue(baseState, pending);
	wip.memoizeState = memoizeState;

	const nextChildren = wip.memoizeState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 跟上面区别是没有触发更新
function updateHostComponent(wip: FiberNode) {
	// <div> <span> <div/> 对span来说在div的props的children里
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		// 参数是  和要比较的双方
		wip.child = reconcileChildrenFibers(wip, current?.child, children);
	} else {
		// mount : 不希望追踪副作用
		wip.child = mountChildrenFibers(wip, null, children);
	}
}
