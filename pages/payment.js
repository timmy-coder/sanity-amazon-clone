import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CheckOutWizard  from '../components/CheckoutWizard'
import Form  from '../components/Form'
import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import { useSnackbar } from 'notistack'

export default function PaymentScreen(){
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('');
    const { state, dispatch } = useContext(Store);
    const {userInfo, cart: {shippingAddress}, } = state;
    useEffect(() => {
        if(!shippingAddress.address){
            router.push('/shipping');
        }
        else{
            setPaymentMethod(Cookies.get('paymentMethod') || '');
        }
    }, [router, shippingAddress]);
    const submitHandler = (e) => {
        e.preventDefault();
        if (!paymentMethod){
            enqueueSnackbar('Payment method is requird', {variant: 'error'});
        } else {
            dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod});
            Cookies.set('paymentMethod', paymentMethod);
            router.push('/placeorder');
        }
    }
    return (
        <Layout title="Payment Method">
            <CheckOutWizard activeStep={2}></CheckOutWizard>
            <Form onSubmit={submitHandler}>
                <Typography component="h1" variant="h1">
                    Payment Method
                </Typography>
                <List>
                    <ListItem>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Payment Method" name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel label="Paypal" value="Paypal" control={<Radio/>}></FormControlLabel>
                                <FormControlLabel label="Stripe" value="Stripe" control={<Radio/>}></FormControlLabel>
                                <FormControlLabel label="Cash" value="Cash" control={<Radio/>}></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth type="submit" variant="contained" color="primary">Continue</Button>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth type="button" variant="contained" color="secondary" onClick={() => router.push('/shipping')}>Back</Button>
                    </ListItem>
                </List>
            </Form>


        </Layout>
        
    )

}