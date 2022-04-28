import React, {useEffect, useState} from "react";
import { Image, TouchableOpacity, View} from "react-native";
import Ident from "../composant/Ident";
import Config from "../composant/Config";
import {
    listenOrientationChange as lor,
    removeOrientationListener as rol,
} from 'react-native-responsive-screen-hooks';

export default function IdentificationScreen(props) {
    const [id,setId]=useState('');
    const [conf,setConf]=useState(false);
    const [orientation, setOrientation] = useState('?');


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
    }, [props]);
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: (props) => (
                <LogoConfig {...props} />
            ),
        });
    }, [props.navigation]);

    const onConfig=()=>{

        setConf(p=>!p)

    }
    function LogoConfig(props) {
        return (
            <View>
                <TouchableOpacity onPress={()=>onConfig()} >
                    <Image
                        style={{  width: 40, height: 40}}
                        source={require('../navigation/config.jpg')}
                    />
                </TouchableOpacity>
            </View>

        );
    }


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <Ident onChange={setId} nav={props.navigation} error={props.route.params} config={(b)=>setConf(b)}/>
            {conf?<Config></Config>:null}
        </View>
    );
}