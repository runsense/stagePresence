import React, {useEffect, useState} from "react";
import {Button, View} from "react-native";
import Sign from "../composant/Sign";
import {persStyle} from "../style";
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen-hooks';
import {useNavigation, useRoute} from "@react-navigation/native";

export default function SignScreen(props) {
    const route = useRoute()
    const p=route.params.p
    const navigation = useNavigation()

    const [sign,setSigner]=useState(p.sign);
    const [clear,setClear]=useState({});
    const [orientation, setOrientation] = useState('?');
    let style=persStyle();

    useEffect(() => {
        // TODO: Pass setter function of useState to the listenOrientationChange as a parameter.
        lor(setOrientation);
        return () => {
            rol();

        };
    }, [props]);

    useEffect(() => {
        p.sign=sign
        console.log(p.sign)
    }, [sign]);

const goTOPersonne=()=>{

    navigation.navigate({
        name: 'Personne',
        params: {p:p},
        merge: true,
    })
}

    return (
        <View style={style.containerp}>

            <Sign onOK={(img) => {setSigner(img)} }
                  onClear={setClear}/>
            <View style={{...style.button,marginTop:5}}>
                <Button
                    color
                    title="Fin de la Signature"
                    onPress={()=>goTOPersonne()}
                />
            </View>
        </View>
    );
}