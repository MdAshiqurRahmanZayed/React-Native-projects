import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';

const mapStateToProps = state => ({
    token: state.token,
    userId: state.userId,
});
const BookDetail = ({ route,userId,token }) => {
    const book = route.params.book;
    const [comments, setComments] = useState([]);
    const [name, setName] = useState([]);
    const [newComment, setNewComment] = useState("");
    
    const url = 'https://helloreactnative-f1259-default-rtdb.firebaseio.com/comments.json?auth=' + token
    console.log(url);
    useEffect(() => {
        const fetchComments = () => {
            axios.get(url)
                .then(response => {
                    const fetchedComments = Object.keys(response.data).map(key => ({
                        id: key,
                        ...response.data[key]
                    })).filter(comment => comment.bookId === book.key);
                    setComments(fetchedComments);
                })
                .catch(error => {
                    console.error("Error fetching comments: ", error);
                });
        };

        fetchComments();
        const interval = setInterval(fetchComments, 2000); 
        return () => clearInterval(interval);
    }, []);

    const handleAddComment = () => {
        if (newComment.trim() === "") return;

        const commentData = {
            text: newComment,
            name: name,
            bookId: book.key,
            userId: userId,
            timestamp: new Date().toISOString()
        };

        axios.post(url, commentData)
            .then(() => {
                setNewComment("");
                setName("");
            })
            .catch(error => {
                console.error("Error adding comment: ", error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{book.bookName}</Text>
            <Text>Author: {book.author}</Text>
            <Text>Description: {book.description}</Text>
            <Text>Published Date: {book.publishedDate}</Text>
            <Text>Category: {book.category}</Text>

            <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Comments</Text>
                <FlatList
                    data={comments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.commentItem}>
                            <Text>{item.text}</Text>
                            <Text style={styles.commentMeta}>By <b>{item.name}</b>  at {new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    )}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment"
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <Button title="Post Comment" onPress={handleAddComment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    commentSection: {
        marginTop: 20,
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    commentMeta: {
        fontSize: 12,
        color: 'gray',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
});

export default connect(mapStateToProps) (BookDetail);
