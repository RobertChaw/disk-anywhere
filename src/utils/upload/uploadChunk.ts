import axios, { AxiosRequestConfig } from "axios";

export function uploadChunk({
  chunk,
  hash,
  index,
  onUploadProgress,
}: // controller,
{
  chunk: Blob;
  hash: string;
  index: string;
  onUploadProgress: AxiosRequestConfig["onUploadProgress"];
  // controller?: AbortController;
}) {
  const file = new File([chunk], `${hash}-${index}`);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("index", index);
  formData.append("hash", hash);
  const task = axios("/api/upload", {
    // signal: controller?.signal,
    method: "POST",
    data: formData,
    onUploadProgress,
  });
  return task;
}
