import React, { useState, useEffect,useRef } from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView} from 'react-native';
import { Camera } from 'expo-camera';
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import {camStyle} from "../style";

// import RNTextDetector from "react-native-text-detector";

export default function Cam() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [ind, setInd] = useState(false);
    const route = useRoute()
    const navigation = useNavigation()
    const [cameraRef,setCameraRef] = useState(null)
    let style=camStyle();

    Camera.Constants.FlashMode=true
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const lance=async () => {
            if (cameraRef) {
                let photo= await cameraRef.takePictureAsync({quality:0.5,base64:true});

                return photo

            }

    }

    const detectText = async () => {

            const options = {
                quality: 0.8,
                base64: true,
                skipProcessing: true,
            };
            const photo = await cameraRef.takePictureAsync(options);
            console.log(RNTextDetector)
            const visionResp = await RNTextDetector.fromURI(photo.uri);
            // console.log('visionResp', visionResp);
            return [photo,visionResp]

    }

    const dynStyle=(load)=>{
        return !load?[style.buttonContainer]:[style.buttonContainer,style.buttonload]
    }
    return (
        <View style={style.container}>
            <ActivityIndicator style={style.indicator} size="large" color="red" animating={ind} />
            <Camera
                style={style.camera}
                type={type}
                ref={ref => {
                    setCameraRef(ref);
                }}
            >

                <View style={dynStyle(ind)}>

                    {/*<TouchableOpacity*/}
                    {/*    style={style.button}*/}
                    {/*    onPress={() => {*/}
                    {/*        setType(*/}
                    {/*            type === Camera.Constants.Type.back*/}
                    {/*                ? Camera.Constants.Type.front*/}
                    {/*                : Camera.Constants.Type.back*/}
                    {/*        );*/}
                    {/*    }}>*/}
                    {/*    <Ionicons name={"aperture"} size={50} color="blue"/>*/}
                    {/*</TouchableOpacity>*/}

                        <TouchableOpacity
                            style={style.button}
                            onPress={()=>{
                                // setInd(true)
                               /* try{
                                    detectText().then(result=> {
                                        // setInd(false)
                                        navigation.navigate({
                                            name: 'Personne',
                                            params: {p:{...route.params.p,iban:result[1]}, camera: result[0]},
                                            merge: true,
                                        })
                                    })
                                }catch (e) {*/
                                    lance.then(result=> {
                                    // setInd(false)
                                    navigation.navigate({
                                    name: 'Personne',
                                    params: {camera: result[0]},
                                    merge: true,
                                    })
                                })
                             // }

                            }}>
                            <Ionicons name={"camera-outline"} size={50} color="white"/>
                        </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        width:'100%',
        flex: 3,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',

    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    indicator:{
        position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});