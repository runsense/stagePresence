import React, {useEffect, useState} from 'react';
import { View,ScrollView,Text, TouchableOpacity,Button,ActivityIndicator } from 'react-native';
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from "react-native-responsive-screen-hooks";
import {listStyle} from "../style";

let style=listStyle();

const Item = ({ item, onPress, st }) => (
    <TouchableOpacity style={st} onPress={onPress}>
        <Text style={style.itemTitre}>{item.civilite_agent+' '+item.nom_agent+' '+item.prenom_agent}</Text>
        <Text style={style.itemCol} >De {item.nom_col}</Text>
    </TouchableOpacity>

);

const ListScreen = (props) => {
    style=listStyle();
    let params=props.route.params;
    const [ind, setInd] = useState(false);

    const sessionData=params.paramsSession
    const [orientation, setOrientation] = useState('?');


     console.log('sessionData',sessionData)
    useEffect(() => {
        lor(setOrientation);
        return () => {
            rol();
        };
    }, [props]);

    const handlePress =  (item,i) => {
        try {
            item['pos']=i
            item['id_sea_jour']=sessionData.id_sea_jour;
            item['id_sea_temps']=sessionData.id_sea_temps;
            console.log('sessionData.token',sessionData.token)
                    props.navigation.navigate('Personne',{
                        p:item,list:params.list,token:sessionData.token,listSign:params.listSign,signagent:sessionData.signagent,
                        frais: {
                            fraisdep:sessionData.fraisdep,
                            fraisheb:sessionData.fraisheb,
                            fraisrepmidi:sessionData.fraisrepmidi,
                            fraisrepsoir:sessionData.fraisrepsoir
                        }
                    });
            setInd(false)


        } catch (error) {
            // console.error(error);
        }
    }

    const renderItem = ( dt,i  ) => {
        params.listSign[dt.id]
        const test=params.listSign[dt.id]||sessionData.signagent.includes(dt.id)
        test?console.log(params.listSign[dt.id]):''
        const st=test?[style.item,style.signé]:[style.item,style.shadow]

        return (

            <Item
                item={dt}
                key={i.toString()}
                onPress={() => {
                    if(!test){
                        setInd(true)
                        handlePress(dt,i)
                    }
                }}
                st={st}
            />
        );
    }

    const bouttonSubmit=()=>{
        setInd(true)
        afterSubmit()
    }
    const afterSubmit=()=>{
        console.log('sessionData.signinterv',sessionData.signinterv)
        props.navigation.navigate({
                name: 'Intervenant',
                params:{
                    id_sea_temps:sessionData.id_sea_temps,
                    token:sessionData.token,
                signinterv:sessionData.signinterv},
            merge:true
            })
        setInd(false)
    }

    //préparation rendu
    let l=[]
    params.list.map((data,i)=>{
        l.push(renderItem(data,i))

    });

    return (
            <View style={style.container}>
                <View style={style.header} >
                    <Text style={style.title}>Bienvenue à la Formation:{'\n'}
                        {sessionData.libelle_session}</Text>
                </View>
                <ActivityIndicator style={style.indicator} size="large" color="black" animating={ind} />
                <ScrollView >
//liste de personne
                    {l}

                <View style={style.bottom} >

                    <View style={style.button}>
                        <Button
                            color
                            title="Valider"
                            hasTVPreferredFocus={true}
                            onPress={()=>bouttonSubmit()}
                        />
                    </View>
                </View>
                </ScrollView>
            </View>
    );

}


export default ListScreen;