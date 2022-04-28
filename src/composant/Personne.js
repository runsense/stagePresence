import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Text, View, TouchableOpacity, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import Sign from  './Sign';
import {storeData} from '../database/Store'
import PropTypes from 'prop-types';
import { useRoute,useNavigation } from '@react-navigation/native';
import chargeJson from "../database/chargeJson";
import { Ionicons } from '@expo/vector-icons';
import {persStyle,responsivite} from "../style";
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from "react-native-responsive-screen-hooks";
import Frais from "./Frais";


const  Personne=()=> {//props empty because Hook
    const route = useRoute()
    const p=route.params.p
    let savePers=route.params.list[p.pos]
    const navigation = useNavigation()


    const id=p.id;
    const prenom=p.prenom_agent;
    const nom=p.nom_agent;
    const [mail,setEmail]=useState(p.email);

    const [iban,setIban]=useState(p.iban);
    const [modif,setModif]=useState(false);
    let eye=false;
    const [affIb,setAffIb]=useState();

    const[frais,setFrais]=useState(route.params.frais?route.params.frais:[]);

    const [errors,setErrors]=useState({mail:null,sign:"Veuillez signé",iban:null});
    const [clear,setClear]=useState({});


    const [sign,setSigner]=useState(p.sign);


    const [ind, setInd] = useState(false);
    const [orientation, setOrientation] = useState('?');
    let style=persStyle();

    if(p.sign!==sign)
        setSigner(route.params.p.sign)
    console.log(sign,p.sign)
    useEffect(() => {
        lor(setOrientation);
        return ()=>{rol();};
    }, [orientation]);


    useLayoutEffect(() => {
        console.log(sign)
        setErrors(
            {
                iban:errors.iban,
                mail:!mail?'Entrer un EMAIL':
                    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)?'Mail Invalid':'',
                sign:!sign?"Veuillez signé":''
            }
        )
        console.log(sign,errors)

    },[mail,sign]);

    useEffect(() => {
        savePers.iban=iban
        affIb?
            setAffIb(iban):
            setAffIb(/.{0,4}/.exec(iban).pop()+'*'.repeat(iban.length-4))
    },[iban]);


    useEffect(() => {
        setErrors(
            {
                ...errors,
                iban:!iban?null:!/FR\d{12}[A-Z0-9]{11}\d{2}/.test(iban)?'Iban incorrect':null
            }
        )
        if(affIb)
            if(affIb.length!==iban.length){
                if(affIb.includes('*')){
                    setAffIb(iban)
                }else{
                    setIban(affIb)
                }
            }else if(!affIb.includes('*')){
                setIban(affIb)
            }

    },[affIb]);

    useEffect(() => {
        clear?setSigner(null):null
        setClear(false)
    },[clear]);

    const alert = (title,text,buttons=[]) =>
        Alert.alert(
            title,
            text.toString(),
            buttons,{cancelable:true}
        );

    const onSubmit = async () => {
        setInd(true)
        if(frais['id_trans'])
           for(let i=0;i<frais['id_trans'].length;i++)
               if(frais['id_trans'][i]===0)
                   frais['id_trans'][i]=null
        Object.entries(frais).forEach(entry => {
            const [key, value] = entry;
            console.log(entry)
            if(value===1&&key!='nbtrajet')
                frais[key]=false
        });
        const dt={
            id_sea_jour:p.id_sea_jour,
            id_sea_temps:p.id_sea_temps,
            id_agent:id,
            prenom_agent:prenom,
            nom_agent:nom,
            email:mail,
            iban:iban,
            photo:route.params.camera?route.params.camera.base64:null,
            signature:sign,
            frais:frais,
            temps:new Date().getHours()<12?"AM":"PM"
        };
        console.log('dt',dt)
            const error= await storeData(dt)
        const save= await chargeJson(route.params.token,'presence',dt)

        route.params.list[p.pos]=savePers;
        if(error==id&&save&&!save.error){

            const ls=route.params.listSign;
            console.log('save',save)
            ls[id]={sign:save}
            navigation.navigate({
                name: 'ErrorInfo',
                params: { error:{good:save.message},
                    params:{ listSign: ls,list:route.params.list },
                    suivante:'List'},
                merge: true,
            })

        }else{

            save.error?navigation.navigate({
                name: 'ErrorInfo',
                params: { error:save.error+" "+save.message,
                    params:{ listSign: route.params.listSign,list:route.params.list },
                    suivante:'Personne'},
                merge: true,
            }):navigation.navigate({
                name: 'ErrorInfo',
                params: { error:error,
                    params:{ listSign: route.params.listSign,list:route.params.list },
                    suivante:'List'},
                merge: true,
            })

        };
        setInd(false)


    };
    const handleButton = onSubmit => {

        if(!errors.mail&&!errors.iban&&sign){
            onSubmit()
        }else{
            let o= {t:'',v:''}
            if(errors.iban){o.t+='Problème IBAN ',o.v+=errors.iban+' \n'}
            if(errors.mail){o.t+='Problème EMAIL ',o.v+=errors.mail+' \n'}
            if(!sign){o.t+='Veuillez Signer',o.v+=errors.sign+' \n'}
            alert(o.t,o.v)
        }
    };

    const modifIban=()=>{
        setModif(p=>!p)
    }
    const goToFrais=()=>{
        navigation.navigate({
            name: 'Frais',
            params: route.params.frais,
            merge: true,
        })
    }
    const goToSign=()=>{
        navigation.navigate({
            name: 'Sign',
            params: {p:p},
            merge: true,
        })
    }
    const afficheCam=()=>{
        navigation.navigate({
            name: 'Camera',
            p:p
        })
    }

// console.log('sign',sign)
    return (
        <View style={style.containerp}>

            <Text  style={{ color: '#008acc',...style.label}}>Nous vous remercions de vérifier les informations{'\n'}
                ci-dessous vous concernant.{'\n'}
                Si ces information sont manquantes ou incorrectes,{'\n'}
                veuillez les completer ou les corriger en cliquant sur le champs concerné.</Text>
            <View style={{alignItems:'center'}}>
                <Text style={{fontSize:18,fontWeight: 'bold',color: '#000000',...style.label}}>{nom+' '+prenom}</Text>
            </View>

            <View style={style.containerI}>
                <Text style={style.label}>Email( Adresse électronique )</Text>

                <TextInput
                    style={style.inputp}
                    // onBlur={onBlur}
                    onChangeText={ setEmail}
                    value={mail}
                />

                <Text style={style.errors}>{errors.mail}</Text>
            </View>

            <View style={style.containerI}>
                <Text style={style.label}>IBAN</Text>
                {!modif?<View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000000', ...style.label}}>{affIb}</Text>
                    <TouchableOpacity onPress={modifIban} style={style.icon}>
                        <Ionicons name={"create-outline"} size={35} color="green"/>
                    </TouchableOpacity>
                </View>:<View style={{flexDirection: 'row'}}>

                    <TextInput
                        style={{paddingRight: 0, ...style.inputp}}
                        textContentType={'newPassword'}
                        onChangeText={setIban}
                        value={iban}
                    />
                    <TouchableOpacity onPress={afficheCam} style={style.icon}>
                        <Ionicons name={"camera"} size={35} color="blue"/>
                    </TouchableOpacity>

                </View>}
                <Text style={style.errors}>{errors.iban}</Text>
            </View>

            <View style={style.butF}>
                <Button
                    color={'#751730'}
                    title="Remboursement"
                    onPress={()=>goToFrais()}
                />
            </View>
            
            <Text style={style.label}>Signature</Text>
            <Text style={style.errors}>{errors.sign}</Text>
            {responsivite()?
                <Sign
                onOK={(img) => {setSigner(img)}}
                onClear={setClear}
                />:<View style={style.butF}>
                <Button
                    color={'#751730'}
                    title="Page Signature"
                    onPress={()=>goToSign()}
                />
            </View>}


            <ActivityIndicator style={style.indicator} size="large" color="black" animating={ind} />
            <View style={{...style.button,marginTop:5}}>
                <Button
                    color
                    title="Valider"
                    onPress={()=>handleButton(onSubmit)}
                />
            </View>
        </View>
    );
};

Personne.propTypes = {
    personne: PropTypes.string,
};

export default Personne;