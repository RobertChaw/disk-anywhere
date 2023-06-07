import React, { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { Button, Input, Progress, Space, Upload, Typography } from "antd";
import { humanFileSize } from "../utils/uploadUtils";
import { UploadForm } from "./UploadForm";

export function Index() {
  return (
    <div className="app">
      <main className={"mx-5 mt-20 md:mx-auto md:w-[700px]"}>
        <header>
          <h1 className={"py-5 text-4xl font-bold text-gray-50 drop-shadow"}>
            Disk Anywhere
          </h1>
        </header>
        <div className={"h-[600px] rounded-lg bg-white p-5 shadow-xl "}>
          <UploadForm />
        </div>
      </main>
    </div>
  );
}
