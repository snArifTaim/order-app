import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, OrderItem } from '../types';
import { formatPrice } from '../utils/formatPrice';

type PlaceOrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceOrder'>;
type PlaceOrderScreenRouteProp = RouteProp<RootStackParamList, 'PlaceOrder'>;

interface Props {
    navigation: PlaceOrderScreenNavigationProp;
    route: PlaceOrderScreenRouteProp;
}

export default function PlaceOrderScreen({ navigation, route }: Props) {
    const { user } = useAuth();
    const [items, setItems] = useState<OrderItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [loading, setLoading] = useState(false);

    // BUG FIX #1: Handle reorder items from route params
    useEffect(() => {
        if (route.params?.reorderItems) {
            setItems(route.params.reorderItems);
        }
    }, [route.params?.reorderItems]);

    const addItem = () => {
        if (!itemName || !itemPrice) {
            Alert.alert('Error', 'Please enter item name and price');
            return;
        }

        const price = parseFloat(itemPrice);
        if (isNaN(price) || price <= 0) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }

        const newItem: OrderItem = {
            id: Date.now().toString(),
            name: itemName,
            price: price,
            quantity: 1,
        };

        setItems([...items, newItem]);
        setItemName('');
        setItemPrice('');
    };

    const updateQuantity = (id: string, increment: boolean) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: Math.max(1, newQuantity) };
                }
                return item;
            })
        );
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // BUG FIX #2: Correct total calculation (quantity × price for each item)
    const calculateTotal = (): number => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const confirmOrder = async () => {
        if (items.length === 0) {
            Alert.alert('Error', 'Please add at least one item to your order');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to place an order');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                userId: user.uid,
                items: items,
                total: calculateTotal(),
                createdAt: serverTimestamp(),
                orderNumber: `ORD-${Date.now()}`,
            };

            await addDoc(collection(db, 'orders'), orderData);

            Alert.alert('Success', 'Order placed successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setItems([]);
                        navigation.navigate('OrderHistory');
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to place order: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: OrderItem }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.quantityControls}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, false)}
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, true)}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
            >
                <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Place Order</Text>
                <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
                    <Text style={styles.historyLink}>View History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Item name"
                    value={itemName}
                    onChangeText={setItemName}
                />
                <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="Price"
                    value={itemPrice}
                    onChangeText={setItemPrice}
                    keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Text style={styles.addButtonText}>Add Item</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                // BUG FIX #3: Proper key extraction for FlatList
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No items added yet</Text>
                }
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.confirmButton, loading ? styles.buttonDisabled : null]}
                    onPress={confirmOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirm Order</Text>
                    )}
                </TouchableOpacity>
            </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    historyLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fafafa',
    },
    priceInput: {
        width: '100%',
    },
    addButton: {
        backgroundColor: '#34C759',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 15,
        flexGrow: 1,
    },
    cartItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        backgroundColor: '#007AFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantity: {
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    removeButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
