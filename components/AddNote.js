import React from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

export default class Notes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            note: {
                title: "",
                content: "",
                date: "",
                key: "",
                color: "",
                cat: ""
            },
            cats: []
        }
        this.props.navigation.addListener("focus", () => { this.getCats(); });
    }
    setNoteInput(key, text) {
        let n = this.state.note;
        n[key] = text;
        this.setState({ note: n })
    }
    setNote(note) {
        this.setState({ note })
    }
    async saveItem() {
        let n = this.state.note;
        let key = Date.now().toString();
        let date = new Date();
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear().toString().substr(2, 2);
        n.date = `${day}/${month}/${year}`;
        n.key = key;
        n.color = '#' + Math.floor((Math.random() * 156) + 50).toString(16)
            + Math.floor((Math.random() * 156) + 50).toString(16) + Math.floor((Math.random() * 156) + 50).toString(16);
        this.setNote(n);
        await SecureStore.setItemAsync(key, JSON.stringify(this.state.note));
        let keys = await SecureStore.getItemAsync("keys");
        keys = keys != null ? JSON.parse(keys) : [];
        keys.push(key);
        await SecureStore.setItemAsync("keys", JSON.stringify(keys));
        this.setNote(
            {
                title: "",
                content: "",
                date: "",
                key: "",
                color: ""
            }
        )
        this.props.navigation.navigate('Notes')
    }
    async getCats() {
        let cats = await SecureStore.getItemAsync("cats");
        cats = cats != null ? JSON.parse(cats) : ["DEFAULT"];
        this.setState({ cats });
        this.setNoteInput('cat', cats[0]);
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    underlineColorAndroid="#ccc"
                    placeholder="Title"
                    placeholderTextColor="#888"
                    onChangeText={(text) => this.setNoteInput('title', text)}
                    style={styles.input}
                    value={this.state.note.title}
                />
                <TextInput
                    underlineColorAndroid="#ccc"
                    placeholder="Content"
                    placeholderTextColor="#888"
                    onChangeText={(text) => this.setNoteInput('content', text)}
                    style={styles.input}
                    value={this.state.note.content}
                />
                <Picker
                    selectedValue={this.state.note.cat}
                    onValueChange={(cat) => { this.setNoteInput('cat', cat) }}
                    style={styles.picker}
                >
                    {
                        this.state.cats.map((val) => {
                            return <Picker.Item label={val} value={val} key={val} />
                        })
                    }
                </Picker>
                <TouchableOpacity style={styles.button} onPress={() => this.saveItem()}>
                    <Text style={styles.buttonText}>Add note</Text>
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
    },
    picker: {
        height: 50,
        width: "80%",
        margin: 12,
        padding: 5,
        color: '#ccc',
        alignSelf: 'center'
    }
});