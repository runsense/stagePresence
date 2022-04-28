import React, {useEffect, useLayoutEffect, useReducer, useState} from "react";
import {Alert, Image, SafeAreaView, Text,  View, TextInput, Button} from "react-native";
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen-hooks';
import {Picker} from "@react-native-picker/picker";
import {CheckBox} from "react-native-elements";
import {fraisStyle} from "../style";
import {useNavigation, useRoute} from "@react-navigation/native";

const alert = (title,text,buttons=[]) =>
    Alert.alert(
        title,
        text.toString(),
        buttons,{cancelable:true}
    );

const CovText=(props)=>{
    let style=fraisStyle();
    const [nom, setNom] = useState(props.getNom);

    return (
        <TextInput
            style={style.input}
            placeholder={'Entrez Nom du '+props.switch}
            onChangeText={text=> {
                setNom(text)
            }}
            onEndEditing={({text, eventCount, target}) => {
                props.addNom(nom)
            }}
            value={nom}
        />
    )
}
export default function FraisScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const params=route.params
    //let pour recharger
    let style=fraisStyle();
    const [orientation, setOrientation] = useState('?');

    const lOb={dep:params.fraisdep!==0,midi:params.fraisrepmidi!==0,soir:params.fraisrepsoir!==0,heb:params.fraisheb!==0,}
    console.log(lOb.heb,params.fraisheb)
    const [checkmidi, setCheckmidi] = useState(lOb.midi?Number.isInteger(params.fraisrepmidi)?false:params.fraisrepmidi:null);
    const [checksoir, setChecksoir] = useState(lOb.soir?Number.isInteger(params.fraisrepsoir)?false:params.fraisrepsoir:null);
    const [checkheb, setCheckheb] = useState(lOb.heb?Number.isInteger(params.fraisheb)?false:params.fraisheb:null);

    const reducer=(state, action)=>{
        switch (action.type) {
            case 'select':
                return action.val;
            case 'checked':
                state[action.id]=!state[action.id]
                return state
            case 'put':
                state=action.val
                return state

            default:
                throw new Error();
        }

    }
    const [data, setData] =useReducer(reducer,{...params,'id_trans':params.id_trans?params.id_trans:[0,0]});
    const [secondP, setSecondP] = useState(params.id_trans&&params.id_trans[1]!==0?params.id_trans[1]:false);

    const [chcov, setChcov] = useState(params.nomconduc?true:params.nompassager?false:null);
    const [nom, setNom] = useState(params.nomconduc?params.nomconduc:params.nompassager?params.nompassager:null);

    useEffect(() => {
        // console.log('orientation',widthPercentageToDP('100%'))
        // TODO: Pass setter function of useState to the listenOrientationChange as a parameter.
        // In case of class component you need to pass context of class that is 'this' keyword.
        // NOTE: This library will only work for functional component using useEffect
        // For class based component please refer the original library package :-
        // Original Author:- https://www.npmjs.com/package/react-native-responsive-screen
        lor(setOrientation);
        return () => {
            rol();

        };
    }, [params]);



    useEffect(() => {
        let add;
        if(chcov){
            add={...data,'nompassager':nom}
            delete add.nomconduc
        }else{
            add={...data,'nomconduc':nom}
            delete add.nompassager
        }
        setData({type: 'put',val:add})


        console.log('chcov',add)
    },[nom]);

    useEffect(() => {
        setData({
            type: 'put',
            val: {
                ...data,
                'fraisrepmidi': checkmidi
            }
        })
    },[checkmidi])
    useEffect(() => {
        setData({
            type: 'put',
            val: {
                ...data,
                'fraisrepsoir': checksoir
            }
        })
    },[checksoir])
    useEffect(() => {
        setData({
            type: 'put',
            val: {
                ...data,
                'fraisheb': checkheb
            }
        })
    },[checkheb])


    const getNbTrajet=()=>{
        return !secondP||(secondP&&data['id_trans'][1]!=0)?2:secondP?1:null
    }
    const retourToPersonne=()=>{
        navigation.navigate({
            name: 'Personne',
            params: {frais: {...data,}},
            merge: true,
        })
    }

    return (
        <View style={style.container}>
            {lOb.dep?<SafeAreaView>
                <Text>Déroulé pour votre choix de transport</Text>

                <View style={style.sscont}>
                    <Picker
                        selectedValue={data['id_trans'][0]}
                        style={style.picker}
                        onValueChange={(itemValue) => {
                            if (itemValue == 5) {
                                setChcov(true)

                            } else
                                setChcov(null)

                            alert('Choisissez le Nombre de Trajet', 'Quel type de trajet avez vous effectué :\n' +
                                '- Aller Simple (Un seule trajet)\n' +
                                '- Aller/Retour (Deux trajets)', [
                                {
                                    text: "Aller simple",
                                    onPress: () => {
                                        setSecondP(true);
                                        setData({
                                            type: 'put',
                                            val: {
                                                ...data,
                                                'fraisdep': itemValue !== 0 ? true : false,
                                                'nbtrajet': 1,
                                                'id_trans': [itemValue, data['id_trans'][1]]
                                            }
                                        })
                                    },
                                    style: "cancel",
                                },
                                {
                                    text: "Aller/Retour",
                                    onPress: () => {
                                        setSecondP(false);
                                        setData({
                                            type: 'put',
                                            val: {
                                                ...data,
                                                'fraisdep': itemValue !== 0 ? true : false,
                                                'nbtrajet': 2,
                                                'id_trans': [itemValue, data['id_trans'][1]]
                                            }
                                        })
                                    },
                                    style: "cancel",
                                },
                            ])
                        }}
                    >
                        <Picker.Item label='Sélectionner Transport' value='0'/>
                        <Picker.Item label='Véhicule personel' value='1'/>
                        <Picker.Item label='voiture de service ou de fonction' value='2'/>
                        <Picker.Item label='TGV' value='3'/>
                        <Picker.Item label='TER ou autre transport en commun terrestre' value='4'/>
                        <Picker.Item label='covoiturage' value='5'/>
                        <Picker.Item label='avion/bateau' value='6'/>
                        <Picker.Item label='non motorisé' value='7'/>
                    </Picker>

                </View>
                {secondP ? <Picker
                    selectedValue={data['id_trans'][1]}
                    style={style.picker}
                    onValueChange={(itemValue, itemIndex) => {
                        setData({
                            type: 'select',
                            val: {
                                ...data,
                                'id_trans': [data['id_trans'][0], itemValue],
                                'nbtrajet': getNbTrajet()
                            }
                        })
                    }}
                >
                    <Picker.Item label='Sélectionner Transport' value='0'/>
                    <Picker.Item label='Véhicule personel' value='1'/>
                    <Picker.Item label='voiture de service ou de fonction' value='2'/>
                    <Picker.Item label='TGV' value='3'/>
                    <Picker.Item label='TER ou autre transport en commun terrestre' value='4'/>
                    <Picker.Item label='covoiturage' value='5'/>
                    <Picker.Item label='avion/bateau' value='6'/>
                    <Picker.Item label='non motorisé' value='7'/>
                </Picker> : null}
                {chcov!=null ? <View style={{flexDirection: 'row'}}><CheckBox
                    center
                    title={'Conducteur'}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={chcov}
                    onPress={() => {
                        setChcov(p => !p)
                    }}
                /><CheckBox
                    center
                    title={"Passager"}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={!chcov}
                    onPress={() => {
                        setChcov(p => !p)
                    }}
                /><CovText
                    addNom={n => setNom(n)}
                    getNom={nom}
                    switch={chcov ? 'Passager' : 'Conducteur'}>

                </CovText></View> : null}
            </SafeAreaView>:null}
            {lOb.midi?<View style={style.sscont}>
                <CheckBox
                    center
                    title={'Frais repas du Midi'}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={checkmidi}
                    onPress={()=>setCheckmidi(p=>!p)}
                />
            </View>:null}
            {lOb.soir?<View style={style.sscont}>
                <CheckBox
                    center
                    title={'Frais repas du Soir'}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={checksoir}
                    onPress={()=>setChecksoir(p=>!p)}
                />
            </View>:null}
            {lOb.heb?<View style={style.sscont}>
                <CheckBox
                    center
                    title={"Frais d'Hébergement"}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={checkheb}
                    onPress={()=>setCheckheb(p=>!p)}
                />
            </View>:null}
            <View style={style.button}>
                <Button
                    color={'#a7145a'}
                    title="Valider"
                    onPress={()=>retourToPersonne()}
                />
            </View>
        </View>
    );
}