import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const QRScannerScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Màn hình Quét QR</Text>
            <View style={styles.scannerArea}>
                <Text>Giao diện camera để quét QR sẽ ở đây.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scannerArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#888',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QRScannerScreen;
