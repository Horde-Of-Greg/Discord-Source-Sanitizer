export function assertIsArrayElement<L, T extends L[]>(element: L, array: T): asserts element is T[number] {
    if (!array.includes(element)) throw new Error(`${array.toString()} doesn't contain ${String(element)}`);
}
