import { Upload } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { generateHash } from "./utils/uploadUtils";

const { Dragger } = Upload;

export function Test() {
  const [file, setFile] = useState<File>(null);
  const [hashCode, setHashCode] = useState("");

  useEffect(() => {
    if (!file) {
      setHashCode("");
      return;
    }
    generateHash([file.slice(), file.slice()]).then((hash) => {
      setHashCode(hash);
    });
  }, [file]);

  const reBuiltFile = useMemo(() => {
    if (!file) return;
    const rebuilt = file.slice(0, 10 * 1024 * 1024);
    console.log("original", file);
    console.log("rebuilt", rebuilt);
    return rebuilt;
  }, [file]);
  return (
    <div>
      <Dragger
        beforeUpload={(file, FileList) => {
          setFile(file);
          return false;
        }}
      />

      <div>`原文件size：{file?.size}`</div>
      <div>`原文件length：{file?.length}`</div>
      <div>MD5:{hashCode}</div>
      <div>`reBuilt后文件size：{reBuiltFile?.size}`</div>
      <div>`reBuilt后文件length：{reBuiltFile?.length}`</div>
    </div>
  );
}
