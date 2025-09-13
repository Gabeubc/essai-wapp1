/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from "../sub-components/NavBar"
import API from '../../common/API'

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        if (!user) {
          setErrorMessage('Invalid username or password');
        } else {
          setErrorMessage('');
          props.loginSuccessful(user);
          navigate('/api/login/totp/require');
        }
      })
      .catch(err => {
        console.log(err);
        setErrorMessage('Wrong username or password');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    if (username === '' || password === '')
      valid = false;

    if (valid) {
      doLogIn(credentials);
    } else {
      setErrorMessage('Error(s) in the form, please fix it/them.')
    }
  };

  return (
    <div className="m-4 p-4 flex flex-col items-center  rounded-lg">
      <Navbar
        loggedIn={props.loggedIn}
        doLogOut={props.doLogOut}
        hideLoginButton={true}
      />
      <Container className=' d-flex flex-column justify-content-center align-items-center'>
        <Row className='mt-5 w-100'>
          <Col xs={3}></Col>
          <Col xs={6}>
            <Form onSubmit={handleSubmit}>
              {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
              <Form.Group controlId='username'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' /*value={username}*/ onChange={ev => setUsername(ev.target.value)} placeholder='username' />
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' /*value={password}*/ onChange={ev => setPassword(ev.target.value)} placeholder='password' />
              </Form.Group>
              <Button className='my-2' type='submit'>Login</Button>
              <Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Cancel</Button>
            </Form>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </Container>
    </div>
  )
}

export { LoginForm };