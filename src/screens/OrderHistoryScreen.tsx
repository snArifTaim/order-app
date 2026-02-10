import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, Order } from '../types';
import { formatPrice } from '../utils/formatPrice';
import OrderItem from '../components/OrderItem';

type OrderHistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderHistory'>;

interface Props {
    navigation: OrderHistoryScreenNavigationProp;
}

export default function OrderHistoryScreen({ navigation }: Props) {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        // BUG FIX #4: Proper cleanup of Firestore listener on unmount
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        items: data.items,
                        total: data.total,
                        // BUG FIX #5: Correct date formatting for Firestore timestamps
                        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                        orderNumber: data.orderNumber,
                    } as Order;
                });
                setOrders(ordersData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← </Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Order History</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                renderItem={({ item }) => (
                    <OrderItem
                        order={item}
                        onPress={() => navigation.navigate('OrderDetails', { order: item })}
                    />
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No orders yet</Text>
                        <TouchableOpacity
                            style={styles.placeOrderButton}
                            onPress={() => navigation.navigate('PlaceOrder', {})}
                        >
                            <Text style={styles.placeOrderButtonText}>Place Your First Order</Text>
                        </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.listContent}
            />

            {orders.length > 0 && (
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate('PlaceOrder', {})}
                >
                    <Text style={styles.floatingButtonText}>+ New Order</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        paddingRight: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        padding: 15,
    },
    emptyList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginBottom: 20,
    },
    placeOrderButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    floatingButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
