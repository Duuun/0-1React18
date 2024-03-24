// 参数类型
export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

// React Element的类型

export interface ReactElementType {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark: string;
}
