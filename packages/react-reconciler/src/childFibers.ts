import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFormElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

// 参数：是否需要最终的副作用
// 使用闭包的原因：根据不同的shouldrackEffects完成不同的reconcileChildrenFibers的实现
function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingleElement(
		returnFibers: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据elemrnt创建fiber再返回
		const fiber = createFiberFormElement(element);
		fiber.return = returnFibers;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFibers: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFibers;
		return fiber;
	}

	// 根据shouldrackEffects 布尔值确定师是否要标记副作用发flags
	// 定义函数：插入单一的结点
	function placeSingChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildrenFibers(
		returnFibers: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前Fiber类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingChild(
						reconcileSingleElement(returnFibers, currentFiber, newChild)
					);

				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}

		// TODO 多结点的情况 ul >li *3

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingChild(
				reconcileSingleTextNode(returnFibers, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
}

export const reconcileChildrenFibers = ChildReconciler(true); //追踪副作用
export const mountChildrenFibers = ChildReconciler(false); //不追踪副作用
