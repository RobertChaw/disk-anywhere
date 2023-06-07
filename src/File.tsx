import { UploadForm } from "./index/UploadForm";
import React, { useState } from "react";
import { FileFilled } from "./icons/FileFilled";
import { humanFileSize } from "./utils/humanFileSize";
import { Typography } from "antd";
import { file } from "./api/file";
import { useRequest } from "ahooks";
import { useParams } from "react-router-dom";

export function File() {
  let { id } = useParams();
  const [fileMeta, setFileMeta] = useState({
    fileName: "loading",
    size: "0",
  });

  useRequest(file, {
    defaultParams: [{ params: { id } }],
    onSuccess: setFileMeta,
  });

  return (
    <main className={"mx-5 mt-20 md:mx-auto md:w-[700px]"}>
      <header>
        <h1 className={"py-5 text-4xl font-bold text-gray-50 drop-shadow"}>
          Disk Anywhere
        </h1>
      </header>
      <div className={"h-[600px] rounded-lg bg-white p-5 shadow-xl "}>
        <div className={"mt-20 flex flex-col items-center gap-y-3 py-5"}>
          <div className={"h-[100px] w-[100px]"}>
            <FileFilled />
          </div>
          <p>{humanFileSize(fileMeta.size)}</p>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {fileMeta.fileName}
          </Typography.Title>
          <a
            className={
              "rounded-lg bg-blue-500 px-16 py-2.5 text-base font-semibold text-white transition-all hover:bg-blue-400"
            }
            href={`/api/download/${id}`}
            target={"_blank"}
          >
            下载
          </a>
        </div>
      </div>
    </main>
  );
}
