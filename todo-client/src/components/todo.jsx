import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { createTodo, deleteTodo, fetchTodo } from '../reducers/todoReducer';

function Todo() {
    const [myTodo, setMyTodo] = useState();
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todos)
     const addTodo = () => {
        dispatch(createTodo({todo: myTodo}))
        setMyTodo('')
    }

    const removeTodo = (id) => {
        dispatch(deleteTodo(id))
    }

    const logoutFun = () => {
        dispatch(logout())
    }

    useEffect(() => {
        dispatch(fetchTodo())
    },[])

    return (
        <div className="container">
         <h1 style={{color:'red'}}>TODO APPLICATION</h1>
         <input type="text"
         placeholder="Write todo here .."
         value={myTodo}
         onChange={(e) => setMyTodo(e.target.value)}
         />
         <button className="btn btn-red" onClick={() => addTodo() }>Add todo</button>
         <ul className="collection with-header ">
        <li className="collection-header"><h4>My TODOS</h4></li>
        {
            todos.map((v,i) => (
                <li key={i} className="collection-item"><div>{v.todo}<a href="#!" className="secondary-content"><i className="material-icons" onClick={() => removeTodo(v._id)}>send</i></a></div></li>

            ))
        }
      </ul>
      <button className="btn btn-red" onClick={() => logoutFun() }>Log Out</button>
        </div>
    )
}

export default Todo
