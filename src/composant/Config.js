import React, {useEffect, useState} from "react";
import {ActivityIndicator, SafeAreaView,  Text, TextInput} from "react-native";
import {setConfig, getConfig} from '../database/Store'
import st,{identStyle} from '../style'
//configuration de la page
//d'identification

const Config = (props) => {
    let style=identStyle();
    const [ad, setAd] = useState(null);
    const [ind, setInd] = useState(false);

    console.log('Config')
    !ad?getConfig().then(
        (dt)=>{
            setAd(dt)
        }
    ):null
    const changé=(html)=>{
        setAd(html)
    }
    useEffect(()=>{
        setInd(true)
        setConfig(ad).then(()=>setInd(false))
    },[ad])

    return (
        <SafeAreaView >
            <Text style={style.text}>Vérifié Adresse Réseau</Text>
            <TextInput
                style={style.input}
                autoCapitalize='characters'
                onChangeText={setAd}
                value={ad}
                placeholderTextColor={'rgba(40, 130, 148, 0.3)'}
            />

            <SafeAreaView style={style.indicator}>
                <ActivityIndicator size="large" color="blue" animating={ind} />
            </SafeAreaView>

        </SafeAreaView>
    );
}
export default Config;