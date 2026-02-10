import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import InvoiceCard from '../components/InvoiceCard';

type OrderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetails'>;
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

interface Props {
    navigation: OrderDetailsScreenNavigationProp;
    route: OrderDetailsScreenRouteProp;
}

export default function OrderDetailsScreen({ navigation, route }: Props) {
    const { order } = route.params;

    const handleReorder = () => {
        Alert.alert(
            'Reorder',
            'Add these items to a new order?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        // Navigate to PlaceOrderScreen with the items from this order
                        // This does NOT duplicate the Firebase order record
                        navigation.navigate('PlaceOrder', { reorderItems: order.items });
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Order Details</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <InvoiceCard order={order} />

                <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
                    <Text style={styles.reorderButtonText}>🔄 Reorder</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Note: Reorder will copy these items to a new order for you to review and modify before confirming.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    reorderButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    reorderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    note: {
        marginTop: 15,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
