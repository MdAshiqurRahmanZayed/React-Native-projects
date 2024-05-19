import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ListItem from '../ListItem/ListItem';

const PlaceList = (props) => {
    const placesArray = Object.keys(props.placeList).map(key => ({
        key: key,
        ...props.placeList[key]
    }));

    return (
        <View >
            <FlatList
                style={{ width: "100%" }}
                data={placesArray}
                renderItem={({ item }) => (
                    <ListItem 
                        book = {item} 
                        navigation = {props.navigation}
                        selectBook = {()=>props.navigation.navigate('BookDetail',{book:item})}
                        onItemPressed={() => props.handleSelectedPlace(item.key)} 
                    />
                )}
                keyExtractor={item => item.key}
            />
        </View>
    );
}

export default PlaceList;
