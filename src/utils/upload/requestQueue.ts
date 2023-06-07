export function createRequestQueue(
  taskList: Array<() => Promise<any>>,
  maxCount
) {
  const queue = [...taskList];
  const executingList = [];

  async function next() {
    if (!queue.length) return;
    const task = queue.pop();
    const p = task();
    await p;
    await next();
  }

  for (let i = 0; i < maxCount; i++) {
    executingList.push(next());
  }

  return Promise.all(executingList);
}
