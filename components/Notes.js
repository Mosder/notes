import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notes: [], filter: "", fontSize: 1, howSort: 0 };
        this.props.navigation.addListener("focus", () => { this.getNotes(); this.getPrefs(); });
    }
    async getNotes() {
        let keys = await SecureStore.getItemAsync("keys");
        if (keys == null) {
            return;
        }
        keys = JSON.parse(keys);
        for (let key of keys) {
            this.setNotes(this.antiDuplicate(this.state.notes, JSON.parse(await SecureStore.getItemAsync(key))));
        }
    }
    antiDuplicate(notes, note) {
        for (let n of notes)
            if (n.key == note.key)
                return notes;
        return [...notes, note];
    }
    setNotes(notes) {
        this.setState({ notes });
    }
    confirmDel(key) {
        Alert.alert("Delete note?", "Are you sure you want to delete this note?", [
            { text: "Cancel" },
            { text: "OK", onPress: () => { this.deleteNote(key); } }
        ])
    }
    async deleteNote(key) {
        await SecureStore.deleteItemAsync(key);
        let keys = await SecureStore.getItemAsync("keys");
        await SecureStore.setItemAsync("keys", JSON.stringify(JSON.parse(keys).filter((k) => k != key)));
        this.setNotes(this.state.notes.filter((note) => note.key != key));
    }
    setFilter(filter) {
        this.setState({ filter })
    }
    async getPrefs() {
        let prefs = await SecureStore.getItemAsync("prefs");
        if (prefs != null) {
            this.setFontSize(JSON.parse(prefs).fontSize);
            this.setHowSort(JSON.parse(prefs).howSort);
        }
    }
    setFontSize(fontSize) {
        this.setState({ fontSize });
    }
    setHowSort(howSort) {
        this.setState({ howSort });
    }

    render() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("Edit note", { item }) }}
                    onLongPress={() => { this.confirmDel(item.key) }} style={[styles.item, { backgroundColor: item.color }]}>
                    <View style={styles.cat}>
                        <Text style={[styles.catText, { color: item.color }]}>{item.cat}</Text>
                    </View>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={[styles.content, { fontSize: this.state.fontSize * 5 + 15 }]}>{item.content}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Search note"
                    placeholderTextColor="#ccc"
                    onChangeText={(text) => this.setFilter(text)}
                    style={styles.input}
                    value={this.state.filter}
                />
                <FlatList numColumns={2} data={this.state.notes.filter((val) => {
                    if (val.cat.toUpperCase().includes(this.state.filter.toUpperCase())
                        || val.title.toUpperCase().includes(this.state.filter.toUpperCase())
                        || val.content.toUpperCase().includes(this.state.filter.toUpperCase())) {
                        return val;
                    }
                }).sort((a, b) => this.state.howSort ? a.key - b.key : b.key - a.key)}
                    keyExtractor={(item) => item.key} renderItem={renderItem} />
            </View>
        );
    }
}

const side = Dimensions.get('window').width / 2 - 30;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666'
    },
    item: {
        width: side,
        height: side,
        marginLeft: 20,
        marginTop: 20,
        padding: 20,
        borderRadius: 15,
        overflow: 'hidden'
    },
    date: {
        fontSize: 15,
        textAlign: 'right',
        color: '#ccc'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ccc'
    },
    content: {
        color: '#ccc'
    },
    cat: {
        flexDirection: 'row'
    },
    catText: {
        padding: 5,
        backgroundColor: '#111',
        borderRadius: 5,
    },
    input: {
        height: 50,
        margin: 12,
        padding: 10,
        color: "#eee",
        borderRadius: 15,
        backgroundColor: '#777'
    },
});