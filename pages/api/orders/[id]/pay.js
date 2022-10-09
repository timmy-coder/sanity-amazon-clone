import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import config from '../../../../utils/config';
import axios from 'axios';

const handler = nc();
handler.use(isAuth);
handler.put(async (req, res) => {
    const projectId = config.projectId;
    const dataset = config.dataset;
    const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
    await axios.post(
        `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`,
        {
            mutations: [
                {
                    patch: {
                        id: req.query.id,
                        set: {
                            isPaid: true, paidAt: new Date().toISOString(),
                            'paymentResult.id': req.body.id,
                            'paymentResult.status': req.body.id,
                            'paymentResult.email_address': req.body.email_address,
                            
                        },
                        
                        },
                },
            ],
                
        },
        {
            headers: {
                'Content-type': 'application/json', Authorization: `Bearer ${tokenWithWriteAccess}`,
            }
        }
    );
    res.send({ message: 'order paid'})
    
})


export default handler;