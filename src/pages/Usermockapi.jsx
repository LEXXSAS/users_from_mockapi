import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup'
import UserForm from '../forms/UserForm'
import Container from '@mui/material/Container';
import { signup, auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const schema = yup.object().shape({
    username: yup.string().min(2, 'Имя пользователя должно содержать минимум 2 символа').required('Это обязательное поле'),
  });

const Usermockapi = () => {
    const [users, setUsers] = React.useState([]);
    const [form, setForm] = React.useState({
        username: '',
    })

    const methods = useForm({
      resolver: yupResolver(schema),
    });

    async function getUsers() {
        try {
          await axios.get(`https://6479b0d7a455e257fa639154.mockapi.io/userstwo`)
          .then((res) => {
                setUsers(res.data)
          })
          } catch(isError) {
              console.log(isError)
          }
      }
    
      async function createUser() {
        try {
            if (form.username.length > 1) {
                await axios.post(`https://6479b0d7a455e257fa639154.mockapi.io/userstwo`, form)
                .then((res) => {
                  alert('Пользователь добавлен!')
                  getUsers()
                  methods.reset({username: ''})
                })
            }
          }
          catch(error) {
              console.log(error)
          }
      }

      async function deleteUser(id) {
        try {
          await axios.delete(`https://6479b0d7a455e257fa639154.mockapi.io/userstwo/${id}`)
          .then((res) => {
            getUsers()
          })
          } catch(error) {
              console.log(error)
          }
      }

      const [authUser, setAuthUser] = React.useState(null);
      let navigate = useNavigate();
    
      useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthUser(user)
          } else {
            setAuthUser(null)
            navigate('/')
          }
        })
    
        return () => {
          listen();
        }
        
      }, [])
    
      let name = null;
    
      if (authUser !== null) {
        name = authUser;
      } else {
        return;
      }
    
      const userSignOut = () => {
        signOut(auth).then(() => {
          console.log('вы вышли')
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('email');
        }).catch(error => console.log(error))
      }

  return (
    <div>
        <FormProvider {...methods}>
        <Container maxWidth="xs" style={{marginTop: '50px'}}>
        <Box sx={{p: 2, pb: 0, width: 360}}>
        <Typography sx={{pb: 0}} variant='h5' component='h5'>{`Рады тебя видеть ${name.email.charAt(0).toUpperCase() + name.email.slice(1).split('@')[0]}`}</Typography>
        </Box>
        <Box sx={{p: 2, pb: 0, width: 360}}>
          <Stack spacing={1} direction='column' className='btns'>
                  <Button onClick={userSignOut} variant='contained' color='primary' size='small'>Выйти</Button>
                  <Button onClick={getUsers} variant='contained' color='primary' size='small'>Получить список пользователей</Button>
          </Stack>
        </Box>
        <Box sx={{p: 2, width: 360}}>
            {users.length > 0 ? <TableContainer component={Paper}>
              <Table sx={{ minWidth: 325 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell ></TableCell> */}
                    {/* <TableCell align="left">Message</TableCell> */}
                    {/* <TableCell ></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                {users.map((obj) => (
                    <TableRow key={obj.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row"> {obj.username}</TableCell>
                      <TableCell align='right'><Button onClick={() => deleteUser(obj.id)} variant='contained' color='primary' size='small'>X</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </TableContainer> : null}
        </Box>
        <Box sx={{p: 2, width: 360}}>
            <Divider />
        </Box>
        <UserForm createUser={createUser} form={form} setForm={setForm} />
        </Container>
        </FormProvider>
    </div>
  )
}

export default Usermockapi
