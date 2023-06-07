import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./index";
import ReactDOM from "react-dom";
import "antd/dist/reset.css";
import "./index.css";
import { Test } from "./test";
import { File } from "./File";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
  },
  {
    path: "/file/:id",
    Component: File,
  },
  {
    path: "/test",
    Component: Test,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.render(<App />, document.getElementById("root"));
