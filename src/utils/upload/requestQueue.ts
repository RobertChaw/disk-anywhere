// export function createRequestQueue(
//   taskList: Array<() => Promise<any>>,
//   maxCount,
//   controller: Controller
// ) {
//   let count = 0;
//   const queue = [...taskList];
//   const executingList = [];
//
//   async function next() {
//     if (queue.length === 0 || controller.cancelled)
//       return Promise.allSettled(executingList);
//     if (count >= maxCount) {
//       return await new Promise<void>((resolve, reject) => {
//         setTimeout(async () => {
//           try {
//             await next();
//             resolve();
//           } catch (e) {
//             reject(e);
//           }
//         }, 300);
//       });
//     }
//
//     count++;
//     const task = queue.pop();
//     const p = task();
//     p.then(() => {
//       count--;
//     }).catch((e) => {
//       console.warn(e);
//       throw e;
//     });
//     executingList.push(p);
//
//     return await next();
//   }
//
//   const task = next();
//   return task;
// }
