import React, {useEffect, useState,useRef} from "react";
import { useRoute,useNavigation } from '@react-navigation/native';
import {Alert, Button, Text, View} from "react-native";
import {getIntervenant} from '../database/Store'
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen-hooks';
import {Picker} from '@react-native-picker/picker';
import chargeJson from "../database/chargeJson";
import webStyle ,{interStyle} from '../style'
import SignatureScreen from "react-native-signature-canvas";

 function IntervenantScreen() {
     let style=interStyle();

    const route = useRoute()
    const navigation = useNavigation()

    const [ind, setInd] = useState(false);
    const [orientation, setOrientation] = useState('?');

    const [list,setList]=useState([]);

    const [intervenant,setIntervenant]=useState({});
    const [id,setId]=useState('');
    const [civilite,setCivilite]=useState('');
    const [nom,setNom]=useState('');
    const [prenom,setPrenom]=useState('');

    const [sign,setSigner]=useState();
    const [clear,setClear]=useState(false);
    const [errors,setErrors]=useState({});

    const [ show, setShow ] = useState(false);
    const ref = useRef();

    const [items,setItems]=useState([]);
    const [déjà,setDéjà]=useState({});

     console.log('IntervenantScreen')
    !list[0]?getIntervenant().then((dt)=>{
        setList(dt)
        return chargeItems(dt)
    }).then((dt)=>setItems(dt)):'';

     const alert = (title,text) =>
         Alert.alert(
             title,
             text.toString(),
             [
             ],{cancelable:true}
         );
    const chargeItems=(dt)=>{
         let temp=[]
        let si=route.params.signinterv
         for(let i=0;i<dt.length;i++){
             let inter=dt[i]

                 if(si.indexOf(inter.id)>=0){
                     let tmp=déjà
                     tmp[i]=true
                     setDéjà(tmp)
                     temp.push(<Picker.Item enabled={false} style={{color:'red'}} label={inter.nom}  value={i} key={i} />)
                 }else{
                     setIntervenant(i)
                     temp.push(<Picker.Item enabled={true} style={{color:'black'}} label={inter.nom} value={i} key={i} />)
                 }
         }
         return temp
     }


    const onSubmit = async () => {
        list[intervenant]['id_sea_temps']=route.params.id_sea_temps;

        const save= await chargeJson(route.params.token,'presenceinterv',list[intervenant])

        if(save&&!save.error){
            route.params.signinterv.push(list[intervenant].id)
            console.log(' route.params.signinterv', route.params.signinterv)
            Alert.alert(
                "l'intervenant "+list[intervenant].nom,
                save.message,
                [
                    {
                        text: "Fin de Session",
                        onPress: () => goTo(save)
                    },
                    route.params.signinterv.length===1&&list.length>1?{
                        text: "prochaine Intervenant",
                        onPress: () => {
                            let tmp=déjà
                            tmp[intervenant]=true
                            setDéjà(tmp)

                            setItems(chargeItems(list))
                            for(let i=0;i<list.length;i++){
                                if(i!=intervenant){
                                    setIntervenant(!déjà[i]?i:intervenant);
                                }
                            }
                            setInd(true)
                            ref.current.clearSignature()
                        }
                    }:null
                ],{cancelable:true}
            );

        }else{
         alert('onSubmit error',errors)

        };

    };

    const goTo=async ()=>{
         const save= await chargeJson(route.params.token,'finseatemps', {"id_sea_temps": route.params.id_sea_temps})
         save?navigation.navigate({
            name: 'ErrorInfo',
            params: { error:{good:save.message},
                suivante:'IdentificationScreen'},
            merge: true,
        }):navigation.navigate({
             name: 'ErrorInfo',
             params: { error:save.error+" "+save.message,
                 suivante:'Intervenant'},
             merge: true,
         })
    }
    const handleSignature = signature => {

        setSigner(signature);
        setShow(true);
        console.log(signature);
    };

    const handleEmpty = () => {
        console.log('Empty');
    }

    const handleClear = () => {
        ref.current.clearSignature();
        setClear(true);
    }

    const handleEnd = () => {
        console.log('handleEnd');
        ref.current.readSignature();
    }

    const handleBegin = () => {
        console.log('begin!');
    };

    const handleData = (data) => {
         console.log('enregistrement',list);
        setInd(true)
        onSubmit().then(()=>{
            setInd(false)}
        )


    };
     const handleFinS = () => {
         Alert.alert(
             "Confirmation ",
             'Fin de session',
             [
                 {
                     text: "Fin de Session",
                     onPress: () => goTo()
                 }
             ],{cancelable:true}
         );

     };

    useEffect(() => {
        lor(setOrientation);
        return () => {
            rol();

        };
    }, [orientation]);

    useEffect(() => {
        setSigner(null)
        console.log(clear)
        setClear(false)
    },[clear]);
    useEffect(() => {
        setErrors({ sign:!sign?'Veuillez signer':''} )
        if(list[intervenant]) { list[intervenant].signatureinterv = sign}
    },[sign]);
    useEffect(() => {
        if(list[0]){
            const inter=list[intervenant]
            setId(inter.id)
            setCivilite(inter.civilite_interv)
            setPrenom(inter.prenom)
            setNom(inter.nom)
        }
    },[intervenant]);


     list[intervenant]&&list[intervenant].signatureinterv?ref.current.draw(false):''

     const boolButton=route.params.signinterv.length<list.length
    return (
        <View style={{alignItems: 'center',...style.container}}>
            <Picker
                selectedValue={intervenant}
                style={{ height: 50, width: 250 }}
                onValueChange={(itemValue, itemIndex) => {
                    setIntervenant(itemValue)
                }}
            >
                {items}
            </Picker>

            <Text style={{fontSize:18,fontWeight: 'bold',...style.label}}>{civilite+' '+nom+' '+prenom}</Text>
            <Text style={style.label}>Signature</Text>
            <Text style={style.errors}>{errors.sign}</Text>
            {boolButton?<SignatureScreen
                ref={ref}
                webStyle={webStyle}
                onEnd={handleEnd}
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onGetData={handleData}
                onBegin={handleBegin}
                penColor={"rgba(255,117,2,1)"}
                imageType="image/png"
                maxWidth={1}
                clearText="Nettoyer"
                confirmText="Enregistrer"
            />:null}


            <View style={style.buttonContSign}>
                {boolButton?<Button title="Supprimer signature" style={style.buttonSign} onPress={handleClear} />:null}
                {route.params.signinterv.length>=1?<Button title="Fin de Session" style={{color:'red',...style.buttonSign}} onPress={handleFinS}/>:null}
                {boolButton?<Button title="Enregistrer" style={style.buttonSign} onPress={handleData} />:null}
            </View>



            {/*<ActivityIndicator style={style.indicator} size="large" color="black" animating={ind} />*/}

        </View>
    );
}
export default IntervenantScreen