import React,{useState} from "react";
import {ActivityIndicator, Button, SafeAreaView, Text, TextInput, View} from "react-native";
import {setIntervenant, storeList} from '../database/Store'
import chargeJson from "../database/chargeJson";
import {identStyle} from '../style'


const Ident = (props) => {
    let style=identStyle();
    const [id, setId] = useState(null);
    const [ind, setInd] = useState(false);
    const [but, setBut] = useState(false);
    const [errors, setErrors] = useState('');

    console.log('Ident')

    const changé=(id)=>{
        setId(id)
        if(id.length==8){
           setBut(true)

        }else
            setBut(false)
    }

    const validé=()=>{
        const d=new Date()
        console.log(d.toISOString().split('T')[0],d.getHours()>=13?'PM':'AM')
        setInd(true)
        chargeJson(null,"session",{
            'identifiant_session': 'IA111060',
            'date_jour':"2022-02-03",
            "temps":'AM'
        }).then(data=>
        {

            console.log('ident receive data',data)
            const i=id
            if(data['error']) {
                typeof  data['error']==='object'?
                    setErrors(data.error.TypeError):
                    setErrors( data.error)
                props.config(true)
                setInd(false)
            }else  if(data[1]) {

                data[0]['signagent']=data[1].signagent
                data[0]['signinterv']=data[1].signinterv
                data[0]['token']=data[1].token
                storeList(data[1].inscrit).then(
                    listSign => {
                        listSign = listSign['undefined'] ? {} : listSign
                        props.nav.navigate('List', {
                            paramsSession: data[0],
                            list: data[1].inscrit,
                            listSign: listSign
                        })
                        setInd(false)
                        props.config(false)
                    }
                )
                setIntervenant(data[1].intervenant);
            }
            else {
                setErrors("Problème d'identification \n" +
                    "Vérifié la connection Internet ")
                props.config(true)
                setInd(false)
            }

            props.onChange(i);

        },e=>{setErrors(' '+e)});

    }

    return (
        <SafeAreaView >
            <Text style={style.text}>Identifiant de Session</Text>
            <TextInput
                style={style.input}
                autoCapitalize='characters'
                onChangeText={changé}
                onSubmitEditing={({ text, eventCount, target })=>{console.log('eventCount',eventCount);validé()}}
                value={id}
                placeholder="Cliquer pour Entré l'Identifiant "
                placeholderTextColor={'rgba(40, 130, 148, 0.3)'}
                maxLength={8}
                clearTextOnFocus={true}
            />
            <Text style={style.errors}>{errors}</Text>
            <SafeAreaView style={style.indicator}>
                <ActivityIndicator size="large" color="blue" animating={ind} />
            </SafeAreaView>
            {but?<View style={style.button}>
                <Button
                    color
                    title="Valider"
                    onPress={validé}
                />
            </View>:null}
        </SafeAreaView>
    );
}
export default Ident;