import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {signinUser, signupUser} from '../reducers/authReducer'

function Auth() {
    const dispatch = useDispatch();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [auth,setAuth] = useState('signin')
    const {loading, error} = useSelector(state => {
      return  state.user
    })

    const authenticate = () => {
        if(auth === 'signin'){
            dispatch(signinUser({email,password}))
        }else{
            dispatch(signupUser({email,password}))
        }
    }

    return (
        <>
        <div className="container">
            {loading && (
                 <div className="progress">
                 <div className="indeterminate"></div>
             </div>
            )}
            <h1 style={{color:'red'}}>please {auth}!</h1>
            {error && (<h5>{error}</h5>)}
            <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email .."
            />
             <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password .."
            />
            {
                auth === 'signin' ? 
                <h6 onClick={() => setAuth('signup')} >Dont have an account ?</h6> : 
                <h6 onClick={() => setAuth('signin')} >Already have an account ?</h6>
            }
            <button className="btn" onClick={() => authenticate()}>{auth}</button>
        </div>
        </>
    )
}

export default Auth
