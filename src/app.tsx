import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./index";
import ReactDOM from "react-dom";
import "antd/dist/reset.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.render(<App />, document.getElementById("root"));
