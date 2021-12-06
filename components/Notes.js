import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notes: [] }
        this.props.navigation.addListener("focus", () => { this.getNotes() });
        this.getNotes();
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
    render() {
        console.log(this.state.notes)
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity onLongPress={() => { this.confirmDel(item.key) }} style={[styles.item, { backgroundColor: item.color }]}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.content}>{item.content}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={styles.container}>
                <FlatList numColumns={2} data={this.state.notes}
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
        fontSize: 20,
        color: '#ccc'
    }
});