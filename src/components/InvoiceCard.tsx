import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface InvoiceCardProps {
    order: Order;
}

export default function InvoiceCard({ order }: InvoiceCardProps) {
    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={styles.container}>
            {/* Invoice Header */}
            <View style={styles.header}>
                <Text style={styles.invoiceTitle}>INVOICE</Text>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
            </View>

            <View style={styles.divider} />

            {/* Items Section */}
            <View style={styles.itemsSection}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
                </View>

                {order.items.map((item, index) => (
                    <View key={item.id} style={styles.tableRow}>
                        <Text style={[styles.itemName, { flex: 2 }]}>{item.name}</Text>
                        <Text style={[styles.itemText, { flex: 1, textAlign: 'center' }]}>
                            {item.quantity}
                        </Text>
                        <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>
                            {formatPrice(item.price)}
                        </Text>
                        <Text style={[styles.itemText, { flex: 1, textAlign: 'right' }]}>
                            {formatPrice(item.price * item.quantity)}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.divider} />

            {/* Total Section */}
            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax:</Text>
                    <Text style={styles.totalValue}>$0.00</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotalRow]}>
                    <Text style={styles.grandTotalLabel}>TOTAL:</Text>
                    <Text style={styles.grandTotalValue}>{formatPrice(order.total)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Thank you for your order!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#999',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    itemsSection: {
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemName: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    itemText: {
        fontSize: 14,
        color: '#666',
    },
    totalSection: {
        marginTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
    },
    totalValue: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    grandTotalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#333',
    },
    grandTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    grandTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});
