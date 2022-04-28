import {StatusBar, StyleSheet,ScaledSize} from 'react-native';
import Constants from "expo-constants";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol, widthPercentageToDP,
} from 'react-native-responsive-screen-hooks';
import {useEffect, useState} from "react";

const errIndic={
    errors:{
        color: 'red',
        alignItems: 'center',
    },
    indicator:{
        position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
}

export const responsivite=()=> {
    const modele = {haut: 1200, bas: 800}
    console.log(hp('100%') ,wp('100%') )
    return modele.haut<=hp('100%') && modele.bas<=wp('100%')
}
export const identStyle=()=>{

    const ratio=wp('100%')/hp('100%')>1;
    console.log(wp('1%'),hp('1%'))
    return StyleSheet.create({
        text: {
            position:'relative',
            marginTop:20,
            fontSize: ratio?30:20,
            fontWeight: '500'
        },
        input:{
            color:'blue',
            fontWeight: 'bold',
            fontSize: ratio?20:15
        },
        button: {
            backgroundColor: '#a7145a',
            borderRadius: 4,
            height:40,

        },
        ...errIndic
    })
}
export const listStyle=()=>{
    const ratio=wp('100%')/hp('100%')>1;
    return StyleSheet.create({
        container:{
            flex: 1,
            marginTop: StatusBar.currentHeight || 0,
            height:hp('80%')
        },
        header: {
            backgroundColor:'#008acc',
            width: '100%',
            position: 'relative',
            top: 0,
            left: 0,
            alignItems:'center',
        },
        title: {
            fontSize: 32,
        },
        item: {
            borderWidth: 1,
            marginVertical: 8,
            marginHorizontal: 16,
            color:'black',
            height:'auto',
        },
        signé:{
            backgroundColor:'gray',
        },
        itemTitre: {
            fontWeight:"bold",
            fontSize:30,
            textAlign:'center',
        },
        itemCol: {
            textAlign:'center',
            includeFontPadding:false,
        },
        bottom: {
            width: wp('100%'),
        },
        button: {
            backgroundColor: '#a7145a',
            borderRadius: 4,
            height:40,

        },
        shadow:{
            shadowColor: '#a7145a',
            shadowOpacity: 0.4,
            elevation: 4
        },

        indicator:{
            position:'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
}
export const persStyle=()=>{
    responsivite()
    const ratio=wp('100%')/hp('100%')>1;
    return StyleSheet.create({
        containerp: {
            flexWrap: ratio?"wrap":'nowrap',
            flex: 1,
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
            backgroundColor: 'lightgray',
            height:hp('50%'),
            width:wp('100%')
        },
        label: {
            // color: '#008acc',
            margin: 20,
            width: wp('50%'),
        },
        containerI:{
            marginTop:ratio?'10%':'0%',
        },
        inputp: {
            backgroundColor: 'white',
            height:40,
            width: ratio?wp('40%'):wp('90%'),
            padding: 10,
            borderRadius: 4,
            shadowColor: 'black',
            shadowOpacity: 1,
            elevation: 4
        },
        icon:{
            marginTop:'0%',
            marginLeft:10
        },
        button: {
            backgroundColor: '#a7145a',
            borderRadius: 4,
            height:40,

        },
        butF: {
            // backgroundColor: '#751730',
            borderRadius: 4,
            height:40,
            alignItems:'center',

        },
        ...errIndic
    })
}
export const fraisStyle=()=>{
    const ratio=wp('100%')/hp('100%')>1;
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        sscont:{
            marginBottom:5,
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
            alignSelf: 'center',
            // backgroundColor: '#ec5990',
        },
        text: {
            fontSize: 18,
            color: 'white',
        },
        input: {
            backgroundColor: 'white',
            height:40,
            width: 'auto',
            padding: 10,
            borderRadius: 4,
            shadowColor: 'black',
        },
        indicator:{
            position:'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        picker:{
            backgroundColor: 'rgba(211,211,211,0.6)',
        }
    })
}
export const camStyle=()=>{
    const ratio=wp('100%')/hp('100%')>1;
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        camera: {
            flex: 1,
        },
        buttonContainer: {
            width:wp('100%'),
            flex: 3,
            flexDirection: 'row',
            // justifyContent: "space-between",
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20,
        },
        buttonload:{
            backgroundColor: 'rgba(256,256,256,0.3)',
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
    })
}
export const interStyle=()=>{
    const ratio=wp('100%')/hp('100%')>1;
    return StyleSheet.create({
        container:{
            flex: 1,
            marginTop: StatusBar.currentHeight || 0,
            height:hp('80%')
        },
        label: {
            color: '#008acc',
            margin: 20,
            width: wp('50%'),
        },
        buttonContSign:{
            display: "flex",
            flexDirection:'row',
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            borderRadius: 4,
            height:40,
            width: wp('100%'),
        },
        buttonSign:{
            flex:1,
            marginTop: 40,
            borderRadius: 4,
            height:40,
        },
        ...errIndic

    })
}
const webStyle = `.m-signature-pad--footer
    .description {
        color: white;
      }
    .save {
        display: none;
    }
    .clear {
        display: none;
    }
    @media screen and (min-device-width: 768px) and (max-device-width: 1024px) {
                          .m-signature-pad {
                            margin: 0%;
                            
                          }
                          .m-signature-pad--footer {
                            display:none;
                            }
                        }
    .m-signature-pad--footer {
        display:none;
        }
     body,html {
              width: 100%; height: 90%;}
`;


export default webStyle;