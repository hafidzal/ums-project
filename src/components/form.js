import React, {useReducer, useState} from "react";
import { useMutation } from "react-query";
import { Container, Row, Input, Button } from 'reactstrap';

export const Form = ({refetch}) => {
    const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        dob: ''
    }

    const formReducer = (state, {type, payload}) => {
        switch (type) {
            case 'firstName':
                return {...state, firstName: payload}
            case 'lastName':
                return {...state, lastName: payload}
            case 'email':
                return {...state, email: payload}
            case 'dob':
                return {...state, dob: payload}
            default:
                throw new Error()
        }
    }

    const [state, dispatch] = useReducer(formReducer, initialState)
    const [submitted, setSubmitted] = useState(false);
    // const [isValid, setIsValid] = useState(false);
    
      const addUser = useMutation(
        () => fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(state)
          })
            .then((res) => res.json())
            .then(refetch)
      )

    const handleSubmit = e => {
        e.preventDefault();
        if(state.firstName) {
            // setIsValid(true);
            addUser.mutate({state})
        }
        setSubmitted(true)
    }
    return (
        <Container>
            <form data-testid="form" onSubmit={handleSubmit} className="p-">
                    <Row className="p-2">
                        <Input
                            className="p-2"
                            data-testid="first-name-input"
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={state.firstName}
                            onChange={(e) => dispatch({type: 'firstName', payload: e.target.value})}
                        />
                        {submitted && !state.firstName && <span id='first-name-error'  className="text-danger">Please enter a first name</span>}
                    </Row>
                    <Row className="p-2">
                        <Input
                            className="mw-100 p-2"
                            data-testid="last-name-input"
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={state.lastName}
                            onChange={(e) => dispatch({type: 'lastName', payload: e.target.value})}
                        />
                        {submitted && !state.lastName && <span id='last-name-error' className="text-danger">Please enter a last name</span>}
                    </Row>
                    <Row className="p-2">
                        <Input
                            className="mw-100 p-2"
                            data-testid="email-input"
                            id="email"
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={state.email}
                            onChange={(e) => dispatch({type: 'email', payload: e.target.value})}
                        />
                        {submitted && !state.email && <span id='email-error' className="text-danger">Please enter email</span>}
                    </Row>
                    <Row className="p-2">
                        <Input
                            className="mw-100 p-2"
                            data-testid="dob-input"
                            id="dob"
                            type="text"
                            placeholder="dob"
                            name="dob"
                            value={state.dob}
                            onChange={(e) => dispatch({type: 'dob', payload: e.target.value})}
                        />
                        {submitted && !state.dob && <span id='dob-error' className="text-danger">Please enter dob</span>}
                    </Row>
                    <Row className="p-2">
                        <Button data-testid="submit-button" type='submit' value='Submit' color='info' className="w-100">submit</Button>
                    </Row>
                </form>
        </Container>
    );
};
