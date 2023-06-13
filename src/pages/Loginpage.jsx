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
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const schema = yup.object().shape({
    login: yup.string().min(2, 'Логин должен содержать минимум 2 символа').required('Это обязательное поле'),
    password: yup.string().min(6, 'Пароль должен содержать минимум 6 символов').max(32).required('Это обязательное поле')
  });

const Loginpage = () => {
    // const methods = useForm({
    //     resolver: yupResolver(schema),
    //   });

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

        signInWithEmailAndPassword(auth, form.login, form.password)
        .then((userCredential) => {
          navigate('/usermockapi')
          console.log('Вы вошли')
          window.localStorage.setItem('token', userCredential.user.accessToken);
          window.localStorage.setItem('email', userCredential.user.email);
          reset({login: '', password: ''})
        }).catch((error) => {
          console.log(error);
          alert('Ошибка! Неверная почта или пароль')
        });
    }

    async function handleSignup() {
      setLoading(true)
      try {
        await signup(form.login, form.password)
        console.log('Вы успешно зарегистрировались')
        reset({login: '', password: ''})
      } catch (error) {
        alert('Такой пользователь уже существует!')
      }
      setLoading(false)
    }

    const [authUser, setAuthUser] = React.useState(null);
  
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user)
          navigate('/usermockapi')
        } else {
          setAuthUser(null)
        }
      })
  
      return () => {
        listen();
      }
      
    }, [])

  return (
    <FormProvider>
    <Container maxWidth="xs" style={{marginTop: '50px'}}>
    <Box sx={{p: 2, width: 360}}>
    <Stack spacing={1} direction='column' className='btns'>
      <Typography sx={{pb: 0}} variant='h4' component='h4'>Login Page</Typography>
      <TextField {...register("login")} fullWidth variant="outlined" name='login' label='Логин' onChange={e => setForm({...form, login: e.target.value})} helperText={formState.errors.login && formState.errors.login.message} error={!!formState.errors.login}/>
      <TextField {...register("password")} fullWidth variant="outlined" name='password' label='Пароль' onChange={e => setForm({...form, password: e.target.value})} helperText={formState.errors.password && formState.errors.password.message} error={!!formState.errors.password} type='password' />
      <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small'>Войти</Button>
      <Button onClick={handleSubmit(handleSignup)} disabled={loading} variant='contained' color='primary' size='small'>Зарегистрироваться</Button>
    </Stack>
    </Box>
    </Container>
    </FormProvider>
  )
}

export default Loginpage
