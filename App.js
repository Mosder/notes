import * as React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
    createDrawerNavigator
} from '@react-navigation/drawer';
import Notes from './components/Notes'
import AddNote from './components/AddNote'
import AddCat from './components/AddCat'
import EditNote from './components/EditNote'
import iInfo from "./icons/info.png"
import iPlus from "./icons/plus.png"
import iNotes from "./icons/notes.png"
import iPencil from "./icons/pencil.png"
const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Notes" component={Notes} options={{
                    headerStyle: { backgroundColor: "#c00" },
                    headerRight: () => (
                        <TouchableOpacity>
                            <Image source={iInfo} />
                        </TouchableOpacity>
                    )
                }} />
                <Drawer.Screen name="Add note" component={AddNote} options={{
                    headerStyle: { backgroundColor: "#0cc" },
                }} />
                <Drawer.Screen name="Add category" component={AddCat} options={{
                    headerStyle: { backgroundColor: "#da8" },
                }} />
                <Drawer.Screen name="Edit note" component={EditNote} options={{
                    headerStyle: { backgroundColor: "#0c0" },
                }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} style={styles.container}>

            <Image source={iPencil} style={styles.bigIcon} />

            <DrawerItem
                label="Notes"
                icon={() => <Image source={iNotes} />}
                onPress={() => props.navigation.navigate("Notes")}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Add note"
                icon={() => <Image source={iPlus} />}
                onPress={() => props.navigation.navigate("Add note")}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Add category"
                icon={() => <Image source={iPlus} />}
                onPress={() => props.navigation.navigate("Add category")}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Info"
                icon={() => <Image source={iInfo} />}
                onPress={() => Alert.alert("Info", "notes, version 2.0.0")}
                labelStyle={styles.drawerLabel}
            />

        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#444',
    },
    drawerLabel: {
        color: '#ccc'
    },
    bigIcon: {
        margin: 20,
        alignSelf: 'center'
    }
});
