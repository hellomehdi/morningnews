import React, { useState } from 'react';
import './App.css';
import { Input, Button, Alert } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function Home(props) {

  // ETATS
  const [userExists, setUserExists] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState([]);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState([]);


  // LOGIN ON CLICK
  var handleLogin = async () => {
    async function login() {
      setLoginErrors([]);
      const response = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${loginEmail}&password=${loginPassword}`
      });
      const jsonResponse = await response.json();
      if(jsonResponse.result === true){
        setUserExists(true);
        props.addToken(jsonResponse.user.token) // Ajout du token dans redux
      } else {
        setLoginErrors(jsonResponse.errors)
      }
    }
    login();
  }; 


  // SIGN-UP ON CLICK
  var handleSignup = async () => {
    async function signUp() {
      setSignupErrors([]);
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `username=${signupUsername}&email=${signupEmail}&password=${signupPassword}`
      });
      const jsonResponse = await response.json();
      if(jsonResponse.result === true){
        setUserExists(true);
        props.addToken(jsonResponse.userSaved.token) // Ajout du token dans redux
      } else {
        setSignupErrors(jsonResponse.errors)
      }
    }
    signUp();
  };


  // REDIRECT IF USER IS LOGGED-IN OR SIGNED-UP
  if(userExists){
      return(
        <Redirect to='/sources' />
      )
  };


  // ERROR MESSAGES FOR LOGIN AND SIGNUP
  const onClose = e => {
  };

  var loginErrorAlert = loginErrors.map((error,i) => {
    return (
      <Alert
      style={{width:'90%', marginTop:'15px', marginBottom:'15px'}}
      message={error}
      type="error"
      closable
      banner
      onClose={onClose}
      />
    )
  });

  var signupErrorAlert = signupErrors.map((error,i) => {
    return (
      <Alert
      style={{width:'90%', marginTop:'15px', marginBottom:'15px'}}
      message={error}
      type="error"
      closable
      banner
      onClose={onClose}
      />
    )
  });


  // RETURN PRINCIPAL
  return (
    <div className="Login-page" >

          {/* SIGN-IN */}
          <div className="Sign">   
            {loginErrorAlert}  
            <Input className="Login-input" placeholder="Email" onChange={(e) => setLoginEmail(e.target.value)} value={loginEmail}/>
            <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)} value={loginPassword}/>
            
            <Button style={{width:'80px'}} type="primary" onClick={()=>handleLogin()}>Sign-in</Button>
          </div>

          {/* SIGN-UP */}
          <div className="Sign">  
            {signupErrorAlert}
            <Input className="Login-input" placeholder="Username" onChange={(e) => setSignupUsername(e.target.value)} value={signupUsername}/>
            <Input className="Login-input" placeholder="Email" onChange={(e) => setSignupEmail(e.target.value)} value={signupEmail}/>
            <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setSignupPassword(e.target.value)} value={signupPassword}/>
            
            <Button style={{width:'80px'}} type="primary" onClick={()=>handleSignup()}>Sign-up</Button>
          </div>

      </div>
  );
}
 

// COMPOSANT CONTENEUR POUR LE TOKEN
function mapDispatchToProps(dispatch){
  return {
    addToken: function(token){
      dispatch({type: 'addToken', token: token})
    }
  }
};


// EXPORT
export default connect(
  null,
  mapDispatchToProps
  )(Home)
