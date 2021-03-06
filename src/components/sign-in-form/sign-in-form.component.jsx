// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState, useContext } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import { UserContext } from '../../contexts/user.context';


import './sign-in-form.styles.scss'


import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils';

 

const defaultFormFields = {
  email: '',
  password: ''
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  // useContext
  const { setCurrentUser } = useContext(UserContext)

  const SignInWithGoogle = async () => {
        const { user } = await signInWithGooglePopup();
        await createUserDocumentFromAuth(user);
    };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };


  // Signing in with email and password
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { user } = await signInAuthUserWithEmailAndPassword(email, password);
      setCurrentUser(user);

      resetFormFields();
      

    } catch (error) {
      switch(error.code) {
        case 'auth/wrong-password':
          alert('Wrong password');
          break;
        case 'auth/user-not-found':
          alert('No user associated with this email');
          break;
        default: 
        console.log(error);
      }
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };


  // <button onClick={logGoogleUser}>Sign in with Google Popup</button>

  return (
    <div className='sign-up-container'>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>

        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />

        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />

        <div className='buttons-container'>
          <Button type='submit'>Sign In</Button>
          <Button type='button' buttonType='google' onClick={SignInWithGoogle}>Google sign in</Button>
        </div>

      </form>
    </div>
  );
};

export default SignInForm;

