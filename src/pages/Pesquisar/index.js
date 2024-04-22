import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
const db = DatabaseConnection.getConnection();

export default function Pesquisar() {
  const [pesquisa, setPesquisa] = useState('');
  const [resultados, setResultados] = useState([]);
  const navigation = useNavigation();

  const pesquisarContatos = () => {
    if (!pesquisa.trim()) {
      setResultados([]);
      return;
    }

    try {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            c.id as clientes_id,
            c.nome,
            c.data_nasc,
            t.id as telefones_id,
            t.numero,
            t.tipo
          FROM
            tbl_clientes AS c
            INNER JOIN tbl_telefone_has_clientes AS tc ON c.id = tc.clientes_id
            INNER JOIN tbl_telefones AS t ON tc.telefones_id = t.id
          WHERE
            c.nome LIKE ?;`,
          [`%${pesquisa}%`],
          (_, { rows }) => {
            setResultados(rows._array);
          },
          (_, error) => {
            console.error('Erro ao executar consulta no sql:', error);
          }
        );
      });
    } catch (error) {
      console.error('Erro ao pesquisar', error);
    }
  };

  const visualizarContato = (cliente) => {
    navigation.navigate('Detalhes', { cliente });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={pesquisa}
        onChangeText={setPesquisa}
        placeholder="Digite o nome do contato"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.botao} onPress={pesquisarContatos}>
        <Text style={styles.botaoTexto}>Pesquisar</Text>
      </TouchableOpacity>
      <ScrollView style={styles.resultadosContainer}>
        {resultados.map((item) => (
          <TouchableOpacity key={item.clientes_id} style={styles.resultadoItem} onPress={() => visualizarContato(item)}>
            <Text>{item.nome}</Text>
            <Text>{item.numero}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  botao: {
    backgroundColor: '#333B20',
    padding: 10,
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultadosContainer: {
    width: '100%',
    marginTop: 20,
  },
  resultadoItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
