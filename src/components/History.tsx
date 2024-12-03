import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';


let pulseRatesHistory = [
    { id: '1', date: '2024-12-01', pulseRate: 70 },
    { id: '2', date: '2024-12-02', pulseRate: 68 },
    { id: '3', date: '2024-12-02', pulseRate: 72 },
    // Add more history data here
];

const History = () => {
    const  historySessions = useSelector((state) => state.bpmHistory.sessions);
    // const historySessions = useSelector((state) => state.bpmHistory.sessions);
    console.log('historySessions', historySessions);
    const combinedHistory = [
        ...pulseRatesHistory,
        ...historySessions.map((session, index) => ({
            id: `mock-${pulseRatesHistory.length + index + 1}`,
            date: session.date,
            pulseRate: session.pulseRate
        }))
    ];

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{item.pulseRate}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pulse Rates History</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Date</Text>
                    <Text style={styles.headerCell}>Pulse Rate</Text>
                </View>
                <FlatList
                    data={combinedHistory}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
    },
    headerCell: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
});

export default History;
// Example function to fetch pulse rate history from backend
// const fetchPulseRateHistory = async () => {
//     try {
//         const response = await fetch('http://your-api-endpoint/pulse-history');
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching pulse rate history:', error);
//         return [];
//     }
// };

// Usage with React hooks:
// const [pulseHistory, setPulseHistory] = useState([]);
// 
// useEffect(() => {
//     const loadPulseHistory = async () => {
//         const history = await fetchPulseRateHistory();
//         setPulseHistory(history);
//     };
//     loadPulseHistory();
// }, []);