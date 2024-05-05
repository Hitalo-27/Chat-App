import React from 'react';
import { Stack } from 'expo-router';
import HomeHeader from '../../components/HomeHeader';

export default function _layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1e1e1e',
                },
            }}
        >
            <Stack.Screen
                name="home"
                options={{
                    header: () => <HomeHeader title="Conversas" />,
                }}
            />
            <Stack.Screen
                name="contacts"
                options={{
                    header: () => <HomeHeader title="Contatos" />,
                }}
            />
        </Stack>
    );
}