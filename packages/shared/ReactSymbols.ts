const supportSymbol = typeof Symbol === 'function' && Symbol.for;

//react element的具体实现
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
