import React from "react";
import { View} from "react-native";
import OldPersonne from "../composant/Personne";


export default function PersonneScreen(props) {
    const [nom,setNom]=React.useState(null);
    React.useEffect(function effectFunction() {

    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <OldPersonne/>

        </View>
    );
}


