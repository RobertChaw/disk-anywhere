import React, { useRef, useState } from "react";
import classNames from "classnames";

export function Upload({ onChange }: { onChange: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingOver, setDraggingOver] = useState(false);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleInputChange(e) {
    const file = inputRef.current?.files[0];
    onChange(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const [file] = e.dataTransfer.files;
    onChange(file);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    setDraggingOver(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    setDraggingOver(false);
  }

  return (
    <div
      className={classNames(
        "mt-5",
        "flex",
        "h-[calc(560px-32px-20px)]",
        "items-center",
        "justify-center",
        "rounded-2xl",
        "border-2",
        "border-dashed",
        "hover:border-blue-500",
        { "border-blue-500": draggingOver },
        "transition",
        "duration-300",
        "cursor-pointer",
        "p-5"
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h3 className={"text-lg font-medium text-slate-700"}>
        拖拽文件到这里...
      </h3>
      <input
        ref={inputRef}
        type="file"
        onChange={handleInputChange}
        className={"hidden"}
      />
    </div>
  );
}
