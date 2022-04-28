import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Enregistrement externe
//
    const setConfig = async (value) => {
        try {
            await AsyncStorage.setItem('@'+'config', value)
        } catch (e) {
            // saving error
        }
    }
    const getConfig= async () => {
        try {
            const value = await AsyncStorage.getItem('@config')
                return value?value:"Aucune IP Enregistré";

        } catch(e) {
            // error reading value
        }
    }

    const setIntervenant = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@'+'intervenant', jsonValue)
        } catch (e) {
            // saving error
        }
    }
    const getIntervenant= async () => {
        try {
            const value = await AsyncStorage.getItem('@intervenant')
            return value?JSON.parse(value):"Aucuns intervenant";

        } catch(e) {
            // error reading value
        }
    }

    const setSelection = async (value) => {
        try {
            await AsyncStorage.setItem('@'+'sel', value)
        } catch (e) {
            // saving error
        }
    }
    const getSelection= async () => {
        try {
            const value = await AsyncStorage.getItem('@sel')
            return value?value:"Aucune Session Enregistré";

        } catch(e) {
            // error reading value
        }
    }

    const storeList = async (value) => {
        try {
            let listId= {}

            for(let p in value){
                    const i=await storeData(value[p]);
                    listId[i]={sign:false}
            }
            const key='@list'
            console.log('listId',listId);
            const jsonValue = JSON.stringify(listId)
            await AsyncStorage.setItem(key, jsonValue)
            return listId
        } catch (e) {
            return e
        }
    }
    const getList = async (k) => {
        try {
            const key='@list'
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    const storeData = async (value) => {
        try {
            const id=value.id_agent
            const key='@'+id
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
            return id
        } catch (e) {
            // saving error
            return e
        }
    }
    const getData = async (k) => {
        try {
            const key='@'+k
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    setConfig('192.168.1.24').then(()=>console.log('Config','http://192.168.1.24:5500/api/'))
    export {setConfig, getConfig,setIntervenant,getIntervenant,setSelection,getSelection,storeList,getList, storeData,getData};