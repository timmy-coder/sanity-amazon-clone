import { Button, Link, List, ListItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import {useForm, Controller} from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { Store } from '../utils/Store';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';


export default function LoginScreen() {
    const { state, dispatch } = useContext(Store);
    const {userInfo } = state;
    const router = useRouter();
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect');
    useEffect(() => {
        if (userInfo){
            router.push(redirect || '/');
        }
    }, [router, userInfo, redirect]);

    
    const {handleSubmit, control, formState: {errors }} = useForm();
    const {enqueueSnackbar} = useSnackbar();
    const submitHandler = async ({email, password}) =>{
        try{
            const {data} = await axios.post('/api/users/login', {
                email, password
            });
            dispatch({type: 'USER_LOGIN', payload: data});
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(err){
            enqueueSnackbar(err.message, {variant: 'error'});
            return;
        }

    }
  return (
    <Layout title="Login">
        <div className='flex items-center justify-center'>
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <Controller name="email" control={control} defaultValue="" 
                        rules={{required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/}} render={({field}) => (
                            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{type: 'email'}} 
                            error={Boolean(errors.email)} 
                            helperText={errors.email? errors.email.type === 'pattern'?'Email is not valid': 'Email is required': ''} {...field}>
                                
                            </TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                    <Controller name="password" control={control} defaultValue="" 
                        rules={{required: true, minLength: 6}} render={({field}) => (
                            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{type: 'password'}} 
                            error={Boolean(errors.password)} 
                            helperText={errors.password? errors.password.type === 'minLength'?'Password length is more than 5': 'Password is required': ''} {...field}>

                            </TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Login</Button>
                    </ListItem>
                    <div className='text-center'>
                        Do not have an account? <NextLink href={`/register?redirect=${redirect || '/'}`} passHref><Link>Register</Link></NextLink>
                    </div>
                </List>

        </Form>
        </div>
       
    </Layout>
  )
}
