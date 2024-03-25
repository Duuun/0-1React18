import { Action } from 'shared/ReactTypes';

// 1. 定义update数据结构
export interface Update<State> {
	action: Action<State>;
}

// 3.定义update queue 结构
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 2. 创建update实例的方法

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

// 4. 创建初始化updateQueue实例的方法
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

// 5. enqueueUpdate方法：往updateQueue里添加update
export const enqueueUpdate = <State>(
	UpdateQueue: UpdateQueue<State>,
	Update: Update<State>
) => {
	UpdateQueue.shared.pending = Update;
};

// 6. 定义方法： updateQueue 消费 update 的方法
// 参数接收一个初始的状态 和 要消费的 updateQueue , 返回一个全新的状态
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizeState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizeState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;

		if (action instanceof Function) {
			// baseState 1 update (x)=>4x -> memoizedState 4
			result.memoizeState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState 2

			result.memoizeState = action;
		}
	}

	return result;
};
