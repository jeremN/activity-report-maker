const updateStoredList = (list: unknown[], cb: (item: unknown, i: number) => unknown) =>
	list.map((item: unknown, i: number) => cb(item, i));

const filterStoredList = (list: unknown[], cb: (item: unknown, i: number) => unknown) =>
	list.filter((item, i) => cb(item, i));

export { updateStoredList, filterStoredList };
