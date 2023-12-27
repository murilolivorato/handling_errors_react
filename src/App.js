import './App.css';
import React, {useState} from 'react'
import {useDispatch} from "react-redux"
import Errors from "./hooks/ErrorInput"
import Swal from "sweetalert2";
import { store } from "./store/modules/registerUserSlice.js"
import SubmitBtn from "./components/SubmitBtn"
function App() {
   // const [ErrorsData, setErrorList] = useState({})
    const ErrorsData = new Errors({})
    const [errorList, setErrorList] = useState({})
    const dispatch = useDispatch()
    const [data, setData] = useState({
        procesing: false,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const nameChangeHandler  = (event) => {
        setData ((prevState) =>
        { return { ...prevState, name: event.target.value}
        })
    }

    const emailChangeHandler  = (event) => {
        setData ((prevState) =>
        { return { ...prevState, name: event.target.email}
        })
    }

    const passwordChangeHandler  = (event) => {
        setData ((prevState) =>
        { return { ...prevState, name: event.target.password}
        })
    }

    const passwordConfirmationChangeHandler  = (event) => {
        setData ((prevState) =>
        { return { ...prevState, name: event.target.password_confirmation}
        })
    }
    const submitHandler = event => {
        event.preventDefault();
        setData ((prevState) =>
        { return { ...prevState, procesing: true  }
        })

        // filters
        const wait = setTimeout(() => {
            clearTimeout(wait)
            // DISPATCH
            dispatch(store(data)).then((res) => {
                // SUCCESS MESSAGE
                Swal.fire({
                    title: 'Success !!',
                    text:  `The User Was Registered`,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(error => {
                // RESET ERROR LIST
                // SET EERROR REQUEST
                // ErrorsData.record(error.data.errors, 'form')
                ErrorsData.record(error.data.errors, 'form')
                Object.keys(error.data.errors).forEach(function(key) {
                    if(ErrorsData.has('form.' + key)){
                        setErrorList ((prevState) =>
                        { return { ...prevState, [key]: ErrorsData.get('form.' + key)}
                        })
                    }
                });
            }).then(() => {
                // LOADING FALSE
                setData ((prevState) =>
                { return { ...prevState, procesing: false  }
                })
            })
        })

    }

  return (
    <div className="App">
        <div className="container">
            <form method="POST" onSubmit={submitHandler}>
            <fieldset>
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">Name</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input className="form-control ipone" name="name"  type="text" onChange={nameChangeHandler} />
                                {errorList.name && <p className="error-msg">{errorList.name}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">E-mail</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input className="form-control ipone" name="email"  type="text" onChange={emailChangeHandler} />
                                {errorList.email && <p className="error-msg">{errorList.email}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">Password</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input className="form-control ipone" name="password"  type="text" onChange={passwordChangeHandler} />
                                {errorList.password && <p className="error-msg">{errorList.password}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label">
                        <label className="label">Password Confirmation</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <input className="form-control ipone" name="password_confirmation"  type="text" onChange={passwordConfirmationChangeHandler} />
                                {errorList.password_confirmation && <p className="error-msg">{errorList.password_confirmation}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label is-small">
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <SubmitBtn
                                    processloading={data.procesing}
                                    stylebutton="btn_cl_left btn-green-md1"
                                    textbutton="Salvar"
                                />
                        </div>
                    </div>
                </div>
        </div>
    </fieldset>
</form>
</div>
    </div>
  );
}

export default App;
