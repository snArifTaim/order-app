import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface OrderItemProps {
    order: Order;
    onPress: () => void;
}

export default function OrderItem({ order, onPress }: OrderItemProps) {
    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.total}>{formatPrice(order.total)}</Text>
            </View>
            <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
            <Text style={styles.itemCount}>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    itemCount: {
        fontSize: 12,
        color: '#999',
    },
});
