import React, {useEffect, useState} from "react";
import {Modal, Text, View} from "react-native";
import { useRoute,useNavigation } from '@react-navigation/native';
import style from "../style";

const ErrorInfo=()=> {
    const route = useRoute()
    const p=route.params,
        gg=p.error['good']
    console.log('errorInfo',p)
    const navigation = useNavigation()

    const [ind, setInd] = useState();
    setTimeout(() => {
        let tmp={
            name: p.suivante
        };
        if(p['params']){
            tmp['params']=p.params
            tmp['merge']=true
        }
        navigation.navigate(tmp)
    }, gg?1800:2700)
    return (


                <View style={[{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 22,
                },gg?
                    {backgroundColor: 'rgba(0, 255, 0,1)',}:
                    {backgroundColor: 'rgba(255, 0, 0,1)',}]}>
                    {/*<Text style={{fontSize:18,fontWeight: 'bold',...style.label}}>{p.error['good']?"Application bien Enregistré":"Erreur de l'Application"}</Text>*/}
                    <Text style={gg?{fontSize:30,fontWeight: 'bold',...style.label}:{fontSize:30,fontWeight: 'bold',...style.error}}>{gg?'Information bien enregistré :\n'+gg:"problème d'enregistrement: "+p?p.error:''}</Text>
                </View>


    );
}


export default ErrorInfo;