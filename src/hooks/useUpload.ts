import { useEffect, useMemo, useRef, useState } from "react";
import { createChunkList } from "../utils/upload/createChunkList";
import { useRequest } from "ahooks";
import { generateHash } from "../utils/hash";
import { File } from "../File";
import { uploadFile } from "../utils/upload/uploadFile";
import { useNavigate } from "react-router-dom";
import * as url from "url";
import { Controller } from "../utils/upload/Controller";
import { message } from "antd";
import { AbortException } from "../utils/upload/AbortException";

export function useUpload({
  file,
  fileName,
}: {
  file: File;
  fileName: string;
}) {
  const [progress, setProgress] = useState(0);
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

  const controller = useMemo(() => new Controller(), []);
  const { run } = useRequest(uploadFile, {
    manual: true,
    onBefore: () => {
      setState("正在上传");
      setError("");
    },
    onSuccess: (data) => {
      setState("上传成功");
      message.success("上传成功,正在跳转到文件页面...", 3);
      setTimeout(() => {
        navigate(data.url);
      }, 3000);
    },
    onError: (e) => {
      if (e instanceof AbortException) {
        setError("上传已取消");
        return;
      }
      setError("上传错误");
    },
  });

  function handlePause() {
    setStart(false);
    setError("上传已取消");
    controller.abort();
  }

  function handleRun() {
    setStart(true);
  }

  useEffect(() => {
    if (start && !hashCalculating) {
      run({
        chunkList,
        hash,
        fileName,
        onProgress: setProgress,
        requestController: controller,
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
