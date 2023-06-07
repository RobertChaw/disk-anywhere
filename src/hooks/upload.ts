import { useEffect, useMemo, useRef, useState } from "react";
import { createChunkList } from "../utils/upload/createChunkList";
import { useRequest } from "ahooks";
import { generateHash } from "../utils/hash";
import { File } from "../File";
import { uploadFile } from "../utils/upload/uploadFile";
import { useNavigate } from "react-router-dom";
import * as url from "url";

export function useUpload({
  file,
  fileName,
}: {
  file: File;
  fileName: string;
}) {
  const [progress, setProgress] = useState(0);
  const cancelled = useRef(false);
  const [error, setError] = useState("");
  const [state, setState] = useState("");
  const [start, setStart] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setProgress(0);
  }, [file]);

  const chunkList = useMemo(() => {
    if (!file) return;
    return createChunkList(file);
  }, [file]);

  const { data: hash, loading: hashCalculating } = useRequest(generateHash, {
    defaultParams: [chunkList],
    refreshDeps: [chunkList],
    ready: Boolean(chunkList),
    onBefore: () => {
      setState("正在计算hash");
    },
    onError: () => {
      setError("网络错误");
    },
  });

  const { run } = useRequest(uploadFile, {
    manual: true,
    // defaultParams: [
    //   {
    //     chunkList,
    //     hash,
    //     fileName,
    //     onProgress: setProgress,
    //     cancelRef: cancelled,
    //   },
    // ],
    onBefore: () => {
      setState("正在上传");
      cancelled.current = false;
    },
    onSuccess: (data) => {
      setState("上传成功");
      setTimeout(() => {
        navigate(data.url);
      }, 3000);
    },
    onError: (e) => {
      console.warn(e);
      setError("上传错误");
    },
  });

  function handlePause() {
    cancelled.current = true;
    setStart(false);
  }

  function handleRun() {
    setStart(true);
  }

  useEffect(() => {
    console.log(`hash:${hash}`);
  }, [hash]);

  useEffect(() => {
    if (start && !hashCalculating) {
      run({
        chunkList,
        hash,
        fileName,
        onProgress: setProgress,
        cancelRef: cancelled,
      });
    }
  }, [start, hashCalculating]);

  return {
    progress,
    run: handleRun,
    pause: handlePause,
    state,
    error,
  };
}
