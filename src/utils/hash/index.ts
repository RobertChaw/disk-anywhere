export function generateHash(chunkList: Array<Blob>) {
  if (!chunkList?.length) return Promise.resolve("");
  const worker = new Worker(new URL("./md5Worker.ts", import.meta.url), {
    type: "module",
  });
  return new Promise<string>((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.hash) {
        resolve(e.data.hash as string);
      }
    };
    worker.postMessage({
      chunkList,
    });
    worker.onerror = (e) => {
      reject(e);
    };
  });
}
