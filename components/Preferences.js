import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

export default class Preferences extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fontSize: 1,
            sort: 0
        }
        this.getPrefs();
        this.props.navigation.addListener("focus", () => { this.getPrefs(); });
    }
    async getPrefs() {
        let prefs = await SecureStore.getItemAsync("prefs");
        this.setFontSize(parseInt(prefs.split(';')[0]));
        this.setSort(parseInt(prefs.split(';')[1]));
    }
    async savePrefs() {
        let prefs = this.state.fontSize + ';' + this.state.sort;
        await SecureStore.setItemAsync("prefs", prefs);
        this.props.navigation.navigate("Notes");
    }
    setFontSize(fontSize) {
        this.setState({ fontSize });
    }
    setSort(sort) {
        this.setState({ sort });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>Font size:</Text>
                <Picker
                    selectedValue={this.state.fontSize}
                    onValueChange={(size) => { this.setFontSize(size) }}
                    style={styles.picker}
                >
                    <Picker.Item label={"Small"} value={0} key={0} />
                    <Picker.Item label={"Medium"} value={1} key={1} />
                    <Picker.Item label={"Large"} value={2} key={2} />
                </Picker>
                <Text style={styles.label}>How sorted:</Text>
                <Picker
                    selectedValue={this.state.sort}
                    onValueChange={(sort) => { this.setSort(sort) }}
                    style={styles.picker}
                >
                    <Picker.Item label={"New to old"} value={0} key={0} />
                    <Picker.Item label={"Old to new"} value={1} key={1} />
                </Picker>
                <TouchableOpacity style={styles.button} onPress={() => this.savePrefs()}>
                    <Text style={styles.buttonText}>Save preferences</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#ccc",
        width: "60%",
        color: "#ccc",
        backgroundColor: "#444"
    },
    buttonText: {
        height: 20,
        margin: 12,
        color: "#ccc",
    },
    label: {
        marginTop: 12,
        width: "80%",
        color: '#aaa',
        alignSelf: 'center'
    },
    picker: {
        height: 50,
        width: "80%",
        padding: 5,
        color: '#ccc',
        alignSelf: 'center',
    }
});