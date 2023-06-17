import { Box, Button, Container, Stack, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import React, { useState } from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { signup, auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, isSignInWithEmailLink, signInWithEmailLink, sendEmailVerification, sendSignInLinkToEmail  } from 'firebase/auth';
import { AppContext } from '../components/context';

const schema = yup.object().shape({
    login: yup.string().min(2, 'Логин должен содержать минимум 2 символа').email('Неверная почта').required('Укажите почту'),
    password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').max(32).required('Это обязательное поле')
  });

const Loginpage = () => {
    // const methods = useForm({
    //     resolver: yupResolver(schema),
    //   });

    const {localEmail, setLocalEmail} = React.useContext(AppContext)
    // const [emailVerify, setEmailVerified] = useState(false);


    const {handleSubmit, register, reset, formState} = useForm({
      resolver: yupResolver(schema),
    });

      const navigate = useNavigate();

      const [loading, setLoading] = useState(false);
      const [users, setUsers] = React.useState([]);
      const [form, setForm] = React.useState({
        defaultValues: {
          login: '',
          password: '',
        }
      })

      const onSubmit = async (event) => {
        // event.preventDefault();
        // console.log(auth.currentUser)
        signInWithEmailAndPassword(auth, form.login, form.password)
        .then((userCredential) => {
        if (auth.currentUser.emailVerified === false) {
          alert('Аккаунт не подтверждён!')
          return;
        }
          navigate('/usermockapi')
          console.log('Вы вошли')
          window.localStorage.setItem('token', userCredential.user.accessToken);
          window.localStorage.setItem('email', userCredential.user.email);
          reset({login: '', password: ''})
        }).catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage)
          if (errorMessage === 'Firebase: Error (auth/wrong-password).') {
            alert('Не верный логин или пароль!')
          } else if (errorMessage === 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).') {
            alert('Доступ к этому аккаунту временно заблокирован - из-за частых попыток ввода не верного логина/пароля')
          } else if (errorMessage === 'Firebase: Error (auth/wrong-password).') {
            alert('Не верный пароль!')
          } else if (errorMessage === 'Firebase: Error (auth/missing-email).') {
            alert('Поле почта пустое!')
          }
        });
    }
    
    const actionCodeSettings = {
      url: 'http://localhost:3000',
      handleCodeInApp: true,
    };

    const emailmy = 'your email';

    async function handleSignup() {
      setLoading(true)
      try {
        await signup(form.login, form.password).then((userCredential) => {
          sendEmailVerification(auth.currentUser)
          // sendSignInLinkToEmail(auth, emailmy, actionCodeSettings)
          // sendEmailVerification(auth.currentUser, {
          //   url: 'http://localhost:3000',
          //   handleCodeInApp: true
          // })
          .then(() => {
            // window.localStorage.setItem('email', form.login)
            window.localStorage.setItem('email', userCredential.user.email)
            setLocalEmail(userCredential.user.email)
            alert('Подтвердите аккаунт, пройдя по ссылке отправленной на ваш email')
          })
          // console.log('Вы успешно зарегистрировались')
          reset({login: '', password: ''})
          navigate('/')
        })
        // console.log('Вы успешно зарегистрировались')
        // reset({login: '', password: ''})
        // navigate('/')
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage === 'Firebase: Error (auth/invalid-email).') {
          alert('Не верный логин или пароль!')
        } else if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
          alert('Такой пользователь уже существует!')
        }
      }
      setLoading(false)
    }

    const [authUser, setAuthUser] = React.useState(null);
  
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user)
          if (auth.currentUser.emailVerified === false) {
            return;
          }
          navigate('/usermockapi')

        // } else if (isSignInWithEmailLink(auth, window.location.href)) {
        //   let email = window.localStorage.getItem('email');
        //   if (!email) {
        //     email = window.prompt('Please provide your email')
        //   }
          // signInWithEmailLink(auth, localEmail, window.location.href)
          // .then((result) => {
          //   window.localStorage.removeItem('email');
          // })
        }
        else {
          setAuthUser(null)
        }
      })
  
      return () => {
        listen();
        setLocalEmail(window.localStorage.getItem('email'))
      }
      
    }, [])

    // const handleKeyPress = React.useCallback((event) => {
    //   if (event.key === 'Enter') {
    //     event.preventDefault();
    //   }
    // }, []);
  
    // useEffect(() => {
    //   document.addEventListener('keydown', handleKeyPress);
    //   return () => {
    //     document.removeEventListener('keydown', handleKeyPress);
    //   };
    // }, [handleKeyPress]);

  return (
    <FormProvider>
    <Container maxWidth="xs" style={{marginTop: '50px'}}>
    <Box sx={{p: 2, width: 360}}>
    <Stack spacing={1} direction='column' className='btns'>
      <Typography sx={{pb: 0}} variant='h4' component='h4'>Login Page</Typography>
      <TextField {...register("login")} fullWidth variant="outlined" name='login' label='Почта' onChange={e => setForm({...form, login: e.target.value})} helperText={formState.errors.login && formState.errors.login.message} error={!!formState.errors.login}/>
      <TextField {...register("password")} fullWidth variant="outlined" name='password' label='Пароль' onChange={e => setForm({...form, password: e.target.value})} helperText={formState.errors.password && formState.errors.password.message} error={!!formState.errors.password} type='password' />
      <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small'>Войти</Button>
      <Button
      onClick={handleSubmit(handleSignup)}
      disabled={loading}
      variant='contained'
      color='primary'
      size='small'
      >
        Зарегистрироваться
      </Button>
    </Stack>
    </Box>
    </Container>
    </FormProvider>
  )
}

export default Loginpage
