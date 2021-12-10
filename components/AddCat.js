import React from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class AddCat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cat: ""
        }
    }
    setCat(cat) {
        this.setState({ cat })
    }
    async saveCat() {
        let cats = await SecureStore.getItemAsync("cats");
        cats = cats != null ? JSON.parse(cats) : ["DEFAULT"];
        let cat = this.state.cat.toUpperCase();
        if (!cats.includes(cat)) {
            cats.push(cat);
        }
        await SecureStore.setItemAsync("cats", JSON.stringify(cats));
        this.setCat("");
        this.props.navigation.navigate('Add note')
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    underlineColorAndroid="#ccc"
                    placeholder="Category"
                    placeholderTextColor="#888"
                    onChangeText={(text) => this.setCat(text)}
                    style={styles.input}
                    value={this.state.cat}
                />
                <TouchableOpacity style={styles.button} onPress={() => this.saveCat()}>
                    <Text style={styles.buttonText}>Add category</Text>
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
    input: {
        height: 50,
        margin: 12,
        padding: 5,
        color: "#ccc",
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
    }
});