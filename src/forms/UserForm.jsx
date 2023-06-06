import React from 'react'
import { Button, Box } from '@mui/material';
import FormField from '../components/FormField';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const UserForm = ({createUser, form, setForm}) => {
    const {handleSubmit} = useFormContext();

  return (
    <div>
        <Box sx={{p: 2, width: 360}}>
            <Typography sx={{pb: 1}} variant='h6' component='h6'>Создать пользователя:</Typography>
            <Stack spacing={1} direction='column' className='btns'>
                <FormField form={form} setForm={setForm}  name='username' label='Имя пользователя' />
                <Button onClick={handleSubmit(createUser)} variant='contained' color='primary' size='small'>Добавить пользователя</Button>
            </Stack>
        </Box>
    </div>
  )
}

export default UserForm
