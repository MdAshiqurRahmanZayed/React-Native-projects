import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Picker, StyleSheet } from 'react-native';
import { addPlace } from '../../redux/actionCreators';
import { connect } from 'react-redux';
import axios from 'axios';

const mapStateToProps = state => ({
    token: state.token,
    userId: state.userId,
});

const mapDispatchToProps = dispatch => {
    return {
        addPlace: place => dispatch(addPlace(place))
    }
}

const AddBooks = props => {
    const [bookName, setBookName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [publishedDate, setPublishedDate] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        axios.get('https://helloreactnative-f1259-default-rtdb.firebaseio.com/categories.json?auth=' + props.token)
            .then(response => {
                const categoriesArray = Object.keys(response.data).map(key => ({
                    id: key,
                    name: response.data[key]
                }));
                setCategories(categoriesArray);
                // console.log(categoriesArray);
            })
            .catch(error => {
                console.error("Error fetching categories: ", error);
            });
    }, []);

    const handleAddingBook = () => {
        if (bookName === "" || description === "" || author === "" || publishedDate === "" || selectedCategory === "") {
            alert("All fields must be filled out");
        } else {
            const newBook = {
                bookName,
                description,
                author,
                publishedDate,
                category: selectedCategory,
                user_id: props.userId
            };

            axios.post('https://helloreactnative-f1259-default-rtdb.firebaseio.com/books.json?auth=' + props.token, newBook)
                .then(response => {
                    props.addPlace({ ...newBook, id: response.data.name });
                    setSuccessMessage("Book added successfully!");
                    setTimeout(() => {
                        setSuccessMessage("");
                        props.navigation.navigate('Book List');
                    }, 2000);
                })
                .catch(error => {
                    console.error("Error adding book: ", error);
                    alert("Error adding book");
                });

            setBookName("");
            setDescription("");
            setAuthor("");
            setPublishedDate("");
            setSelectedCategory("");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Book Name"
                value={bookName}
                onChangeText={setBookName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Author"
                value={author}
                onChangeText={setAuthor}
            />
            <TextInput
                style={styles.input}
                placeholder="Published Date (YYYY-MM-DD)"
                value={publishedDate}
                onChangeText={setPublishedDate}
            />
            <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
                <Picker.Item label="Select a Category" value="" />
                {categories.map(category => (
                    <Picker.Item key={category.id} label={category.name.name} value={category.name.name} />
                ))}
            </Picker>
            {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
            <View style={styles.buttonContainer}>
                <Button
                    title="Add Book"
                    onPress={handleAddingBook}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 20
    },
    successMessage: {
        color: 'green',
        marginBottom: 10,
        textAlign: 'center'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBooks);
