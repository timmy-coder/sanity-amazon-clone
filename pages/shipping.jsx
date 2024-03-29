import { Button, List, ListItem, MenuItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import CheckOutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import Form from '../components/Form';
import {useForm, Controller} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function ShippingScreen (){
    const {handleSubmit, control, formState: {errors }, setValue} = useForm();
    const router = useRouter();
    const options = [
        { value: 'Ikeja' },
        { value: 'Ojota' },
        { value: 'Ogudu' },
        { value: 'ketu' },
        { value: 'Mile 12' },
        { value: ' Yaba' },
        { value: 'Ebute Metta' },
        { value: 'Surulere' },
        { value: 'Okota' },
      ];
    const { state, dispatch } = useContext(Store);
    const {userInfo, cart: {shippingAddress}, } = state;
    useEffect(() => {
        if(!userInfo){
            return router.push('/login?redirect=/shipping')

        }
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('phoneNumber', shippingAddress.phoneNumber);
        setValue('country', shippingAddress.country);

        console.log(userInfo)
    }, [router, setValue, shippingAddress, userInfo])

    const submitHandler = ({ fullName, address, city, postalCode,country  }) => {
            dispatch({
                type: 'SAVE_SHIPPING_ADDRESS',
                payload: {fullName, address, city, postalCode, country}
            })
            Cookies.set('shippingAddress', JSON.stringify({fullName, address, city, postalCode, country}));
            router.push('/payment')
    }
    return (
        <Layout title="Shipping Address">
            <CheckOutWizard activeStep={1}></CheckOutWizard>
            <div className='flex items-center justify-center'>
                <Form onSubmit={handleSubmit(submitHandler)}>
                    <Typography component="h1" variant="h1">
                        Shipping Address
                    </Typography>
                    <List>
                        <ListItem>
                            <Controller name="fullName" control={control} defaultValue="" 
                            rules={{required: true, minLength: 2}} render={({field}) => (
                                <TextField variant="outlined" fullWidth id="fullName" label="Full Name" inputProps={{type: 'fullName'}} 
                                error={Boolean(errors.fullName)} 
                                helperText={errors.fullName? errors.fullName.type === 'pattern'?'Full Name is not valid': 'Full Name is required': ''} {...field}>
                                    
                                </TextField>
                            )}></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="address" control={control} defaultValue="" 
                            rules={{required: true, minLength: 2}} render={({field}) => (
                                <TextField variant="outlined" fullWidth id="address" label="Address" inputProps={{type: 'address'}} 
                                error={Boolean(errors.address)} 
                                helperText={errors.address? errors.address.type === 'pattern'?'Address is not valid': 'Address is required': ''} {...field}>
                                    
                                </TextField>
                            )}></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="city" control={control} defaultValue="" 
                            rules={{required: true, minLength: 2}} render={({field}) => (
                                <TextField select placeholder='e.g Ikeja' variant="outlined" fullWidth id="city" label="City" inputProps={{type: 'city'}} 
                                error={Boolean(errors.city)} 
                                helperText={errors.city? errors.city.type === 'pattern'?'City is not valid': 'City is required': ''} {...field}>
                                    {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
                                       
                                    
                                </TextField>
                                
                            )}></Controller>
                            
                        </ListItem>
                        <ListItem>
                            <Controller name="phoneNumber" control={control} defaultValue="" 
                            rules={{required: true, minLength: 11, maxLength: 11}} render={({field}) => (
                                <TextField variant="outlined" fullWidth id="phoneNumber" label="Phone Number" inputProps={{type: 'phoneNumber'}} 
                                error={Boolean(errors.phoneNumber)} 
                                helperText={errors.phoneNumber? errors.phoneNumber.type === 'pattern'?'Phone Number is not valid': 'Phone Number is required': ''} {...field}>
                                    
                                </TextField>
                            )}></Controller>
                        </ListItem>
                        <ListItem>
                            <Controller name="country" control={control} defaultValue="" 
                            rules={{required: true, minLength: 2}} render={({field}) => (
                                <TextField variant="outlined" fullWidth id="country" label="Country" inputProps={{type: 'country'}} 
                                error={Boolean(errors.country)} 
                                helperText={errors.country? errors.country.type === 'pattern'?'Country is not valid': 'Countryis required': ''} {...field}>
                                    
                                </TextField>
                            )}></Controller>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" type="submit" fullWidth color="primary">Continue</Button>
                        </ListItem>
                    </List>
                </Form>
            </div>
            
        </Layout>
    )
}