import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ListItem = (props) =>{

    
    // console.log(props)
    
    return (

                <TouchableOpacity  style={styles.card} onPress = {props.selectBook} > 
                <View style={styles.listItem}>
                    <Text style={styles.title}>{props.book.bookName}</Text>
                    <Text>Author: {props.book.author}</Text>
                    <Text>Published Date: {props.book.publishedDate}</Text>
                </View>
            </TouchableOpacity>
);
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginVertical: 6,
        marginHorizontal: 4,
        padding: 10
    },
    listItem: {
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
});

export default ListItem;
