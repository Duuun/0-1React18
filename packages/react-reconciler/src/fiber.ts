// 实现fiber node 结构

import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from './hostConfig';

// tag 指fiberNode是什么类型的结点
export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	memoizeState: any;
	alternate: Props | null;
	flags: Flags;
	subtreeFlags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;

		// HostComponent <div> div dom
		this.stateNode = null;

		// FunctionComponent ()=>{}
		this.type = null;

		// 构成树状结构
		// return指向父fiber Node
		this.return = null;
		this.sibling = null;
		this.child = null;
		// 有好几个
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; //准备工作时的props
		this.memoizedProps = null; //工作完了确定下来的props
		this.memoizeState = null;
		this.updateQueue = null;

		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

//FiberRootNode类
export class FiberRootNode {
	container: Container; //对应宿主环境挂载的结点，即rootElement
	current: FiberNode; //表示当前 Fiber 树的根节点hostRootFiber，它是整个 Fiber 树的起点。
	finishedWork: FiberNode | null; //指向更新完成后的FiberNode 即更新操作执行完成后得到的 Fiber 树的根节点
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
		//建立连接关系： FiberRootNode的current字段指向hostRootFiber，然后hostRootFiber的stateNode有指向FiberRootNode
	}
}

// 创建workInProgress
// 每次传进来一个FiberNode，进过一堆操作最后返回FiberNode的alternate
export const createWorkInProgress = (
	current: FiberNode, //当前的 Fiber 节点，就是将进行更新的 Fiber 节点。
	pendingProps: Props //即将应用于当前 Fiber 节点的新属性。
): FiberNode => {
	let wip = current.alternate; //尝试获取当前 Fiber 节点的备份节点，
	if (wip === null) {
		// mount 第一次渲染（挂载阶段）
		/* 
			创建一个新的 Fiber 节点，命名为 wip。
			将 wip 的类型、待处理属性等信息与当前 Fiber 节点保持一致。
			将当前 Fiber 节点的备份指向 wip，同时将 wip 的备份指向当前 Fiber 节点，以建立双向关联。 */
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags; //副作用清除掉
		wip.subtreeFlags = NoFlags; //副作用清除掉
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizeState = current.memoizeState;

	return wip;
};

export function createFiberFormElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// <div/> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'string' && __DEV__) {
		// 考虑边界情况
		console.warn('未定义的type类型', element);
	}

	// 创建fiber结点
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
