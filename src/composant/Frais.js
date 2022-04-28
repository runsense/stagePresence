import React, {useEffect, useState, useReducer, useLayoutEffect} from "react";
import {Text, View, SafeAreaView, Alert, TextInput} from "react-native";
import {Picker} from '@react-native-picker/picker';
import st,{fraisStyle} from '../style'
import {CheckBox} from "react-native-elements";

let nb=0


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
const Frais = (props) => {
    const [check, setCheck] = useState(false);
    const [secondP, setSecondP] = useState(false);

    const [checkmidi, setCheckmidi] = useState(false);
    const [checksoir, setChecksoir] = useState(false);
    const [checkheb, setCheckheb] = useState(false);

    const [chcov, setChcov] = useState(null);
    const [nom, setNom] = useState(null);


    const reducer=(state, action)=>{
        console.log('reducer',state)
        console.log('reducer action',action)
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
    const [data, setData] =useReducer(reducer,{...props.list,'id_trans':[0,0]});

    let partieFrais=null;
    let style=fraisStyle();

    useLayoutEffect(() => {

        props.value(data)

    },[check]);


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



    const getNbTrajet=()=>{
        return !secondP||(secondP&&data['id_trans'][1]!=0)?2:secondP?1:null
    }

    const Item = ({val,titre,value,fonction}) => {

        return (
            <View style={style.frais}>
                {val == 'fraisdep' ?
                    <SafeAreaView>
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
                        {chcov !== null ? <View style={{flexDirection: 'row'}}><CheckBox
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
                            addNom={n=>setNom(n)}
                            getNom={nom}
                            switch={chcov?'Passager':'Conducteur'} >

                        </CovText></View> : null}
                    </SafeAreaView>
                    : <View style={style.sscont}>
                        <CheckBox
                            center
                            title={titre}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={value}
                            onPress={fonction}
                        />
                    </View>}


            </View>)
    }

    const addItem=(text)=>{
    let titre,value,fonction;
        switch(text){
            case 'fraisrepmidi' :
                titre='Frais repas du midi' ;
                value=checkmidi;
                fonction=()=>{
                    setCheckmidi(p => {
                        setData({type: 'put',
                            val:{...data,fraisrepmidi:!p}})
                       return !p
                    });

                }
                break;
            case 'fraisrepsoir':
                titre ='Frais repas du Soir' ;
                value=checksoir;
                fonction=()=> {
                    setChecksoir(p => {
                        setData({type: 'put',
                            val:{...data,fraisrepsoir:!p}})
                        return !p
                    });

                }
                    break;
            case 'fraisheb':
                titre="Frais d'Hébergement";
                value=checkheb;
                fonction=()=> {
                        setCheckheb(p => {
                            setData({type: 'put',
                                val:{...data,fraisheb:!p}})
                            return !p
                        });

                    }
                    break;
            default:
                titre=null;value=null;fonction=null;
        }
        return (<Item
                key={text}
                val={text}
                titre={titre}
                value={value}
                fonction={fonction}
            />
        )
    }
    const renderFrais=(dt)=>{
        let retour=[]
        for(let k in dt){

            dt[k]!==0&&k[0]==='f'?retour.push(addItem(k)):null
        }
        partieFrais=retour;
    }

    renderFrais(props.list);

    return (
        <View style={style.ckbox}>
            <CheckBox
                center
                title="Remboursement"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={check}
                onPress={() => {
                    setCheck(previousState => !previousState)
                }}
            />
            <View  style={style.contFrais}>
                {check?partieFrais:null}
            </View>
        </View>

    );
}
export default Frais;