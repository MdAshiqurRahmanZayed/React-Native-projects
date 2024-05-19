import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import PlaceList from '../PlaceList/PlaceList';
import { connect } from 'react-redux';
import { loadBooks } from '../../redux/actionCreators';
import axios from 'axios';

const mapStateToProps = state => ({
    bookList: state.bookList,
    token: state.token,
});

const mapDispatchToProps = dispatch => ({
    loadBooks: () => dispatch(loadBooks()),
});

const FindBooks = props => {
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        props.loadBooks();
        axios.get(`https://helloreactnative-f1259-default-rtdb.firebaseio.com/categories.json?auth=${props.token}`)
            .then(response => {
                const categoriesArray = Object.keys(response.data).map(key => ({
                    id: key,
                    name: response.data[key]
                }));
                setCategories(categoriesArray);
            })
            .catch(error => {
                console.error("Error fetching categories: ", error);
            });
    }, [props.token]);

    useEffect(() => {
        const bookArray = Object.keys(props.bookList).map(key => ({
            id: key,
            ...props.bookList[key]
        }));

        if (selectedCategory === "All") {
            setFilteredBooks(bookArray);
        } else {
            const filtered = bookArray.filter((book) => book.category === selectedCategory);
            setFilteredBooks(filtered);
        }
    }, [props.bookList, selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <View style={styles.container}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>All Categories:</Text>
                <View style={styles.categoryButtons}>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            title={category.name.name}
                            onPress={() => handleCategoryChange(category.name.name)}
                        />
                    ))}
                </View>
            </View>
            <PlaceList
                placeList={filteredBooks}
                navigation={props.navigation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    categoryContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    categoryButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FindBooks);
