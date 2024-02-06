import { Button, Link, List, ListItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import {useForm, Controller} from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';
import NextLink from 'next/link'
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {useRouter, redirect} from 'next/navigation'
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

export default function RegisterScreen() {
    const { state, dispatch } = useContext(Store);
    const {userInfo } = state;
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    
    useEffect(() => {
        if (userInfo){
            router.push(redirect || '/');
        }
    }, [router, userInfo, redirect]);
    const {handleSubmit, control, formState: {errors }} = useForm();
    
    
    const submitHandler = async ({name, email, password, confirmPassword}) =>{
        if(password !== confirmPassword){
            enqueueSnackbar("Passwords don't match", {variant: 'error'});
            return;
        }
        try{
            const {data} = await axios.post('/api/users/register', {
                name, email, password
            });
            dispatch({type: 'USER_LOGIN', payload: data});
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(err){
            enqueueSnackbar(getError(err), {variant: 'error'});
            return;
        }

    }
  return (
    <Layout title="Register">
        <div className='flex items-center justify-center'>
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Register
                </Typography>
                <List>
                <ListItem>
                        <Controller name="name" control={control} defaultValue="" 
                        rules={{required: true, minLength: 2}} render={({field}) => (
                            <TextField variant="outlined" fullWidth id="name" label="Name" inputProps={{type: 'name'}} 
                            error={Boolean(errors.name)} 
                            helperText={errors.name? errors.name.type === 'pattern'?'Name is not valid': 'Name is required': ''} {...field}>
                                
                            </TextField>
                        )}></Controller>
                    </ListItem>
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
                    <Controller name="confirmPassword" control={control} defaultValue="" 
                        rules={{required: true, minLength: 6}} render={({field}) => (
                            <TextField variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}} 
                            error={Boolean(errors.confirmPassword)} 
                            helperText={errors.confirmPassword? errors.confirmPassword.type === 'minLength'?'confirm Passwordlength is more than 5': 'confirm Password is required': ''} {...field}>

                            </TextField>
                        )}></Controller>
                    </ListItem>
                    
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Register</Button>
                    </ListItem>
                    <ListItem>
                        Alread have an account {' '}<NextLink href={`/login?redirect=${redirect || '/'}`} passHref><Link>login</Link></NextLink>
                    </ListItem>
                </List>

            </Form>
        </div>
        
        
    </Layout>
  )
}
