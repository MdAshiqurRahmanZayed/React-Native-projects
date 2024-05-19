import React from 'react';
import {
    createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import AddBooks from '../AddBooks/AddBooks';
import FindBooks from '../FindBooks/FindBooks';
import Icons from 'react-native-vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

const navigationTab = props => {
    return ( 
            <Tab.Navigator>
            <Tab.Screen
                name="Add Books"
                component={AddBooks}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-sharp" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Find Books"
                component={FindBooks}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icons name="book" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default navigationTab;