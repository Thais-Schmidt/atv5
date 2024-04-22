import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';


import { DatabaseConnection } from '../../database/database';
const db = DatabaseConnection.getConnection();

export default function Contatos() {

  const [registros, setRegistros] = useState([]);
  const navigation = useNavigation();

  /* Atualizar os registros */

  const atualizar = () => {
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
            INNER JOIN tbl_telefones AS t ON tc.telefones_id = t.id;`,
          [],
          (_, { rows }) => {
            setRegistros(rows._array);
          },
          (_, error) => {
            console.error('Erro ao executar consulta no sql:', error);
          }
        );
      });
    } catch (error) {
      console.error('Erro ao atualizar', error);
    }
  };

  useEffect(() => {
    atualizar();
  }, []);

  /* Excluir registro */

  const excluirClientePorId = (clientes_id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM tbl_telefone_has_clientes WHERE clientes_id = ?',
          [clientes_id],
          (_, result) => {
            // Verifica se pelo menos um registro foi afetado
            if (result.rowsAffected > 0) {
              // Exclui o cliente da tabela tbl_clientes
              return tx.executeSql(
                'DELETE FROM tbl_clientes WHERE id = ?',
                [clientes_id],
                (_, result) => {
                  // Verifica se pelo menos um registro foi afetado
                  if (result.rowsAffected > 0) {
                    // Cliente excluído com sucesso
                    resolve('Cliente e telefones excluídos com sucesso.');
                  } else {
                    // Se nenhum registro foi afetado, o cliente não foi encontrado na tabela
                    reject('Nenhum cliente encontrado para excluir.');
                  }
                },
                (_, error) => reject('Erro ao excluir cliente: ' + error)
              );
            } else {
              // Se nenhum registro foi afetado, o cliente não foi encontrado na tabela de relacionamento
              reject('Nenhum cliente encontrado para excluir.');
            }
          },
          (_, error) => reject('Erro ao excluir relação de telefones: ' + error)
        );
      });
    });
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Lista de contatos:</Text>

      <ScrollView>

        {registros.map((item) => (

          <View style={styles.box} key={item.clientes_id}>

            <View style={{ gap: 10, width: 370, borderRadius: 7, height: 320 }}>

              <Text style={styles.text}>Contato:</Text>
              <Text style={styles.registro}>{item.nome}</Text>

              <Text style={styles.text}>Data_nascimento: </Text>
              <Text style={styles.registro}>{item.data_nasc}</Text>

              <Text style={styles.text}>Número para contato: </Text>
              <Text style={styles.registro}>{item.numero}</Text>

              <Text style={styles.text}>Tipo:</Text>
              <Text style={styles.registro}>{item.tipo}</Text>

              <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'flex-end', paddingEnd: 4, paddingBottom: 10 }}>

                <TouchableOpacity onPress={() => excluirClientePorId(item.clientes_id)}>
                  <FontAwesome name='trash' size={30} color="#333B20" />
                </TouchableOpacity>

                <TouchableOpacity>
                  <FontAwesome name='edit' size={30} color="#333B20" onPress={() => navigation.navigate('Editar', { item: item })} />
                </TouchableOpacity>

              </View>

            </View>

          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD48A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    color: "#333B20"
  },
  registro: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: 300,
    gap: 5
  },
  fontCard: {
    fontSize: 16
  },
  box: {
    backgroundColor: '#fcfdf4',
    width: 390,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 13,
    borderRadius: 10
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingTop: 10
  },
  registro: {
    paddingLeft: 20,
    fontSize: 15,
  }
});
