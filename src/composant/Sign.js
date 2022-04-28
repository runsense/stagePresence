import React, {useRef} from 'react';
import { Button, View} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import webStyle from '../style'

const Sign = ({ onOK,onClear}) => {
    const ref = useRef();

    const handleSignature = signature => {
        console.log('signature',signature);
        onOK(signature);

    };

    const handleEmpty = () => {
        console.log('Empty');
    }

    const handleClear = () => {
        console.log('clear button')
        ref.current.clearSignature();
        onClear(true);
    }

    const handleEnd = () => {
        console.log('handleEnd');
        ref.current.readSignature();

    }

    const handleBegin = () => {
        console.log('begin!');
    };

    const handleData = (data) => {
        console.log('data',data);
    };
    return (
        <View style={{ flex: 1}}>
            <SignatureScreen
                ref={ref}
                webStyle={webStyle}
                onEnd={handleEnd}
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onGetData={handleData}
                autoClear={false}
                onBegin={handleBegin}
                backgroundColor="rgb(255,255,255)"
                penColor={"rgba(255,117,2,1)"}
                imageType="image/png"
                maxWidth={1}
                clearText="Nettoyer"
            />
            <Button title="Supprimer signature" style={{
                display: "flex",
                borderRadius: 4,
                height:40,
                width: '100%',
                marginBottom:'2%'
            }} onPress={handleClear} />
        </View>
    );
}

export default Sign;

