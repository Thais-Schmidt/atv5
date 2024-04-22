import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';

const db = DatabaseConnection.getConnection();

export default function Editar({ route }) {
  const { item } = route.params;
  const [nome, setNome] = useState(item.nome);
  const [dataNasc, setDataNasc] = useState(item.data_nasc);
  const [numero, setNumero] = useState(item.numero);
  const [tipo, setTipo] = useState(item.tipo);
  const navigation = useNavigation();

  const atualizarContato = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_clientes SET nome = ?, data_nasc = ? WHERE id = ?;',
        [nome, dataNasc, item.clientes_id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            tx.executeSql(
              'UPDATE tbl_telefones SET numero = ?, tipo = ? WHERE id = ?;',
              [numero, tipo, item.telefones_id],
              (_, result) => {
                if (result.rowsAffected > 0) {
                  navigation.goBack();
                } else {
                  console.error('Erro ao atualizar dados do telefone');
                }
              }
            );
          } else {
            console.error('Erro ao atualizar dados do contato');
          }
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Insira o nome do contato"
        />

        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInput
          style={styles.input}
          value={dataNasc}
          onChangeText={setDataNasc}
          placeholder="DD/MM/AAAA"
        />

        <Text style={styles.label}>Número:</Text>
        <TextInput
          style={styles.input}
          value={numero}
          onChangeText={setNumero}
          placeholder="Insira o número de contato"
        />

        <Text style={styles.label}>Tipo:</Text>
        <TextInput
          style={styles.input}
          value={tipo}
          onChangeText={setTipo}
          placeholder="Celular/Trabalho/Casa"
        />

        <TouchableOpacity style={styles.botao} onPress={atualizarContato}>
          <Text style={styles.botaoTexto}>Atualizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#333B20',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
});