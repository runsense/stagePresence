import React, { useEffect, useState } from 'react';
import {getConfig} from './Store'
//Enregistrement interne
//
let erreur=[];
export const getErreur = () => {
    return erreur;
}
const errorCherche=res=>{
    return {error:res.error+' \n'+res.message}
}

const chargeJson = async (token,call,value) => {
    console.log('chargeJson call',value)
    let h=token?{ "Accept": 'application/json','Content-Type': 'application/json','x-access-token':token}:{"Accept": 'application/json','Content-Type': 'application/json'}
    console.log('h',h)
    try {
        const config=await getConfig()
        const response = await fetch('http://'+config+':5500/api/'+call, {//ipv4 of localhost car conflit de server
            method: 'POST',
            headers:h,
            body: JSON.stringify(value)
        });
        const json = await response.json()
        console.log('json',json)
        console.log({error:json.error})
        return response.status==200?json:{error:json.error+' \n'+json.message}

    } catch (e) {
        console.error('chargeJson error',e)
        return {error:e};

    } finally {
        // console.log(data);
        // setLoading(false);
    }
}

export default chargeJson;