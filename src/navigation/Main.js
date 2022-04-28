import { createStackNavigator } from '@react-navigation/stack';
import IdentificationScreen from "../Screen/IdentificationScreen";
import ListScreen from "../Screen/ListScreen";
import PersonneScreen from "../Screen/PersonneScreen";
import IntervenantScreen from "../Screen/IntervenantScreen";
import ErrorInfo from "../Screen/ErrorInfo";
import Cam from "../Screen/Camera";
import FraisScreen from "../Screen/FraisScreen";
import SignScreen from "../Screen/SignScreen";
import {
    TouchableOpacity, View,Image,Alert,Button
} from 'react-native';

const Stack = createStackNavigator();

export default function Main() {
    console.log('Main')
    function LogoTitle(props) {
        return (
            <View
                // style={{flexDirection:'row',flexGrow:2}}
            >
                    <Image
                        style={{  width: 70, height: 50}}
                        source={require('./logo.png')}
                    />


            </View>

        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                // headerTitleAlign: 'center',
                headerStyle: {
                    // backgroundColor: '#008acc',
                },
                headerTintColor: 'black',
                headerTitleStyle :{
                    fontWeight: 'bold',
                },
                headerTitle: (props) => <LogoTitle {...props} />
            }}
        >
            <Stack.Group>


            <Stack.Screen
                name="IdentificationScreen"
                component={IdentificationScreen}
                options={{
                    title: 'Identification',

                }}

            />
            <Stack.Screen
                name="List"
                component={ListScreen}
                // options={({ route }) => ({ title: route.params.paramsSession.libelle_session })}
                initialParams={{ paramsSession: null,list:null,listSign:null }}
            />
            <Stack.Screen
                name="Personne"
                component={PersonneScreen}
                options={{ title: 'Détails'  }}
                initialParams={{ p:{},listSign:null }}
            />
             <Stack.Screen
                    name="Intervenant"
                    component={IntervenantScreen}
                    options={{ title: 'Formateur'  }}
             />
                <Stack.Screen
                    name="Camera"
                    component={Cam}
                />
                <Stack.Screen name="Sign" component={SignScreen} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="ErrorInfo" component={ErrorInfo} />
                {/*<Stack.Screen name="Camera" component={Cam} />*/}
                <Stack.Screen name="Frais" component={FraisScreen} />

            </Stack.Group>

        </Stack.Navigator>
    );
}