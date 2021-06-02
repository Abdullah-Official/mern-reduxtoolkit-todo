import React, { useEffect } from "react";
import "./App.css";
import Auth from "./components/auth";
import Todo from "./components/todo";
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "./reducers/authReducer";

function App() {
  const { token } = useSelector((state) => state.user);
  const disptach = useDispatch();

  useEffect(() => {
    disptach(addToken());
  }, [disptach]);

  return <div className="App">{!token ? <Auth /> : <Todo />}</div>;
}

export default App;
