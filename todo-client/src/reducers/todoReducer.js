import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { fetch2, fetch3 } from '../app/helpers/fetch2'


const initialState = []


export const createTodo = createAsyncThunk('createtodo', 
    async (body) => {
        const result = await fetch2('/createtodo', body)
        return result
    }
)

export const fetchTodo = createAsyncThunk('fetchtodos', 
    async () => {
        const result = await fetch3('/gettodo', 'get')
        return result
    }
)

export const deleteTodo = createAsyncThunk('deletetodo', 
    async (body) => {
        const result = await fetch3(`/remove/${body}`, 'delete')
        return result
    }
)

 const todoReducer = createSlice({
     name:'todo',
     initialState,
     reducers:{ },
     extraReducers: {
         [createTodo.fulfilled] : (state,{payload:{message}}) => {
            if(message){
                state.push(message)
            }
         },
         [fetchTodo.fulfilled] : (state,{payload:{message}}) => {
           return message
         },
         [deleteTodo.fulfilled]: (state, action) => {
           return  state.filter((item) => item._id != action.payload.message._id)
         }
     },
     
 })



 export default todoReducer.reducer