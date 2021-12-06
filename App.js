import * as React from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator
} from '@react-navigation/drawer';
import Notes from './components/Notes'
import AddNote from './components/AddNote'
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
          drawerLabelStyle: styles.drawerLabel,
          drawerIcon: () => <Image source={iNotes} />
        }} />
        <Drawer.Screen name="Add note" component={AddNote} options={{
          headerStyle: { backgroundColor: "#0cc" },
          drawerLabelStyle: styles.drawerLabel,
          drawerIcon: () => <Image source={iPlus} />
        }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>

      <Image source={iPencil} style={styles.bigIcon} />

      <DrawerItemList {...props} />

      <DrawerItem
        label="Info"
        icon={() => <Image source={iInfo} />}
        onPress={() => Alert.alert("Info")}
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
