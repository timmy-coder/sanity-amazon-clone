import { Router } from '@mui/icons-material'
import React, { useContext, useEffect } from 'react'
import { Store } from '../utils/Store';
import {useRouter} from 'next/router';
import { useForm, Controller} from 'react-hook-form';
import Layout from '../components/Layout';
import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Form from '../components/Form';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import axios from "axios";
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

function ProfileScreen() {
    const router = useRouter();
    const {state, dispatch } = useContext(Store)
    const { userInfo } = state;
    const {handleSubmit, control, formState: {errors}, setValue,} = useForm();
    useEffect(() => {
        if(!userInfo){
            return router.push('/login');
        }

        setValue('name', userInfo.name);
        setValue('email', userInfo.email);
    }, [router, setValue, userInfo])
    const { enqueueSnackbar, closeSnackbar} = useSnackbar();
    const submitHandler = async ({ name, email, password, confirmPassword}) => {
        closeSnackbar();
        if (password !== confirmPassword){
            enqueueSnackbar("Passwords don't match", {variant: 'error'})
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name, email, password,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({type: 'USER_LOGIN', payload: data})
            Cookies.set('userInfo', JSON.stringify(data));
            enqueueSnackbar('Profile updated successfully', {variant: 'success'})
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'})
        }

    };
    return (
        <Layout title="profile">
            <Typography component="h1" variant='h1'>Profile</Typography>

            <Form onSubmit={handleSubmit(submitHandler)}>
                <List>
                    <ListItem>
                        <Controller
                        name="name" control={control} defaultValue="" 
                        rules={{required: true, minLength: 2}}
                        render={({field}) => (
                            <TextField
                            variant="outlined" fullWidth id="name" label="Name" inputProps={{type: 'text'}}
                            error={Boolean(errors.name)} helperText={
                                errors.name? errors.name.type === 'minLength'? 'Name length is more than 1': 'Name is required': ''
                            }
                            {...field}

                            ></TextField>
                        )}
                        
                        ></Controller>
                    </ListItem>
                    
                    <ListItem>
                        <Controller
                        name="email" control={control} defaultValue="" 
                        rules={{required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/}}
                        render={({field}) => (
                            <TextField
                            variant="outlined" fullWidth id="email" label="email" inputProps={{type: 'email'}}
                            error={Boolean(errors.email)} helperText={
                                errors.email? errors.email.type === 'pattern'? 'Email is not valid': 'Email is required': ''
                            }
                            {...field}

                            ></TextField>
                        )}
                        
                        ></Controller>
                    </ListItem>

                    <ListItem>
                        <Controller
                        name="password" control={control} defaultValue="" 
                        rules={{
                            validate: (value) => 
                            value === '' || 
                            value.length > 5 ||
                            'Password length is more than 5',
                        }}
                        render={({field}) => (
                            <TextField
                            variant="outlined" fullWidth id="password" label="password" inputProps={{type: 'password'}}
                            error={Boolean(errors.password)} helperText={
                                errors.password?'Password length is more than 5': ''
                            }
                            {...field}

                            ></TextField>
                        )}
                        
                        ></Controller>
                    </ListItem>

                    <ListItem>
                        <Controller
                        name="confirmPassword" control={control} defaultValue="" 
                        rules={{
                            validate: (value) => 
                            value === '' || 
                            value.length > 5 ||
                            'Confirm Password length is more than 5',
                        }}
                        render={({field}) => (
                            <TextField
                            variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}}
                            error={Boolean(errors.confirmPassword)} helperText={
                                errors.confirmPassword?'Confirm Password length is more than 5': ''
                            }
                            {...field}

                            ></TextField>
                        )}
                        
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Update</Button>
                    </ListItem>
                </List>
            </Form>

        </Layout>

    )
}

export default dynamic(() => Promise.resolve(ProfileScreen), {ssr: false})