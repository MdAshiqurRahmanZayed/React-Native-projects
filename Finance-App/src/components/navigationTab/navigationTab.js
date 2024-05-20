import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/FontAwesome';
import FinanceMain from '../FinanceMain/FinanceMain';
import IncomeAccount from '../IncomeAccount/IncomeAccount';
import ExpenseAccount from '../ExpenseAccount/ExpenseAccount';


const Tab = createBottomTabNavigator();

const navigationTab = props => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name = "Finance Main site"
                component={FinanceMain}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icons name="delicious" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Add Income category"
                component={IncomeAccount}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icons name="plus-circle" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Add Expense category"
                component={ExpenseAccount}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icons name="minus-circle" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default navigationTab;