import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {

    const navigation = useNavigation();

    const cadastro = () => {
        navigation.navigate('Cadastro');
    };

    const pesquisar = () => {
        navigation.navigate('Pesquisar');
    };

    const contatos = () => {
        navigation.navigate('Contatos');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>AGENDA</Text>

            <View style={{ gap: 10 }}>

                <Pressable
                    onPress={cadastro}
                    style={({ pressed }) => [
                        styles.btns,
                        {
                            backgroundColor: pressed ? '#b5c7a7' : '#F1EEE5',
                        }
                    ]}
                >

                    <Text style={{ color: '#333B20', fontWeight: 'bold' }}>
                        NOVO CONTATO
                    </Text>

                </Pressable>

                <Pressable
                    onPress={pesquisar}
                    style={({ pressed }) => [
                        styles.btns,
                        {
                            backgroundColor: pressed ? '#b5c7a7' : '#F1EEE5',
                        }
                    ]}
                >

                    <Text style={{ color: '#333B20' , fontWeight: 'bold' }}>
                        PROCURAR CONTATO
                    </Text>

                </Pressable>

                <Pressable
                    onPress={contatos}
                    style={({ pressed }) => [
                        styles.btns,
                        {
                            backgroundColor: pressed ? '#b5c7a7' : '#F1EEE5',
                        }
                    ]}
                >

                    <Text style={{ color: '#333B20', fontWeight: 'bold' }}>
                        TODOS OS CONTATOS
                    </Text>

                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333B20',
        alignItems: 'center',
    },
    title: {
        fontSize: 23,
        color: '#F1EEE5',
        fontWeight: 'bold',
        marginTop: 170,
        marginBottom: 160,
        fontSize: 50
    },
    btns: {
        backgroundColor: '#323b20',
        width: 170,
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        fontSize: 22
    }


});
