import React, { useEffect, useState } from "react";
import { humanFileSize } from "../utils/uploadUtils";
import { Progress, Typography } from "antd";
import { FileFilled } from "../icons/FileFilled";
import { Upload } from "./Upload";
import { ArrowOutlined } from "../icons/ArrowOutlined";
import { useRequest } from "ahooks";
import { useUpload } from "../hooks/useUpload";

export function UploadForm({}) {
  type UploadState = "WAITING_SELECT" | "WAITING_CONFIRM" | "UPLOADING";
  const [state, setState] = useState<UploadState>("WAITING_SELECT");
  const [file, setFile] = useState<File>(null);
  const [fileName, setFileName] = useState(file?.name);
  const {
    run,
    progress,
    pause,
    error,
    state: uploadState,
  } = useUpload({ file, fileName });

  const [isPause, setIsPause] = useState(false);
  useEffect(() => {
    if (error) setIsPause(true);
  }, [error]);

  useEffect(() => {
    setFileName(file?.name);
  }, [file]);

  useEffect(() => {
    if (state === "WAITING_SELECT") setFile(null);
  }, [state]);

  function handleUploadChange(file: File) {
    setFile(file);
    setState("WAITING_CONFIRM");
  }

  async function handleSubmit() {
    setState("UPLOADING");
    setIsPause(false);
    run();
  }

  function handlePause() {
    setIsPause(true);
    pause();
  }

  return (
    <div className={"m-0"}>
      {state === "WAITING_SELECT" && (
        <section className={""}>
          <header>
            <h2 className={"text-2xl font-semibold"}>选择文件</h2>
          </header>
          <Upload onChange={handleUploadChange} />
        </section>
      )}
      {state === "WAITING_CONFIRM" && (
        <section>
          <header className={"flex items-center justify-between gap-x-2"}>
            <h2 className={"text-2xl font-semibold"}>确认表单</h2>
            <a
              className={
                "text-base font-semibold text-slate-500 hover:cursor-pointer hover:text-slate-900"
              }
              onClick={() => setState("WAITING_SELECT")}
            >
              返回
            </a>
          </header>
          <div className={"mt-20 flex flex-col items-center gap-y-3 py-5"}>
            <div className={"h-[100px] w-[100px]"}>
              <FileFilled />
            </div>
            <p>{humanFileSize(file.size)}</p>
            <Typography.Title
              editable={{
                onChange: setFileName,
              }}
              level={5}
              style={{ margin: 0 }}
            >
              {fileName}
            </Typography.Title>
            <button
              className={
                "rounded-lg bg-blue-500 px-16 py-2.5 text-base font-semibold text-white transition-all hover:bg-blue-400"
              }
              onClick={handleSubmit}
            >
              上传
            </button>
          </div>
        </section>
      )}
      {state === "UPLOADING" && (
        <section>
          <header className={"flex items-center justify-between gap-x-2"}>
            <h2 className={"text-2xl font-semibold"}>上传</h2>
            {/*<a*/}
            {/*  className={*/}
            {/*    "text-base font-semibold text-slate-500 hover:cursor-pointer hover:text-slate-900"*/}
            {/*  }*/}
            {/*  onClick={() => setState("WAITING_SELECT")}*/}
            {/*>*/}
            {/*  返回*/}
            {/*</a>*/}
          </header>
          <div className={"flex flex-col items-center gap-3 py-5"}>
            <Progress
              percent={Number(progress.toFixed(1))}
              className={"mt-20"}
            />
            {!error ? (
              <p className={""}>{uploadState}</p>
            ) : (
              <p className={"text-red-500"}> {error}</p>
            )}
            {!isPause ? (
              <button
                onClick={handlePause}
                className={
                  "rounded bg-orange-500 px-7 py-2 text-lg font-semibold text-white shadow-md transition hover:bg-orange-400"
                }
              >
                暂 停
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={
                  "rounded bg-blue-500 px-7 py-2 text-lg font-semibold text-white shadow-md transition hover:bg-blue-400"
                }
              >
                继 续
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
