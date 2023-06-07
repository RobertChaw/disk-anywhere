import { SIZE } from "../uploadUtils";

export function createChunkList(file: File) {
  const chunkList = new Array<Blob>();
  let cur = 0;
  while (cur < file.size) {
    const end = SIZE;
    chunkList.push(file.slice(cur, cur + SIZE));
    cur += SIZE;
  }
  return chunkList;
}
