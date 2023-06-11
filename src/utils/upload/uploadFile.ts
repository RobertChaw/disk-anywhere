import { createLink, mergeChunks, verifyChunks } from "../../api/file";
import { uploadChunk } from "./uploadChunk";
import { createRequestQueue } from "./requestQueue";
import { Controller } from "./Controller";
import { AbortException } from "./AbortException";

export async function uploadFile({
  hash,
  chunkList,
  fileName,
  onProgress,
  requestController,
}: {
  hash: string;
  chunkList: Array<Blob>;
  fileName: string;
  onProgress: (percentage: number) => void;
  requestController: Controller;
}) {
  let cancellation = false;
  requestController.attach(() => (cancellation = true));

  const progressList: Array<number> = new Array(chunkList.length);
  progressList.fill(0);
  const { shouldUpload, existChunks } = await verifyChunks({
    params: {
      hash,
    },
  });
  if (!shouldUpload) {
    onProgress(100);
    return await createLink(hash, fileName);
  }

  const existIndexes = new Set(
    existChunks.map((chunkName) => chunkName.split("-")[1])
  );
  const taskList = chunkList.map((chunk, index) => async () => {
    if (cancellation) throw new AbortException();
    if (existIndexes.has(String(index))) {
      progressList[index] = 100;
      return Promise.resolve();
    }
    await uploadChunk({
      chunk,
      hash,
      index: String(index),
      onUploadProgress: (e) => {
        if (cancellation) return;
        progressList[index] = (e.loaded / e.total) * 100;
        const percentage = progressList.reduce((prv, cur) => {
          return prv + cur / progressList.length;
        });
        onProgress(percentage);
      },
    });
  });

  await createRequestQueue(taskList, 10);
  await mergeChunks(hash);
  return await createLink(hash, fileName);
}
