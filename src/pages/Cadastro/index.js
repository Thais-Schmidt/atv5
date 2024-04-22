import { ScrollView, StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { DatabaseConnection } from '../../database/database';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

const db = new DatabaseConnection.getConnection;

export default function Cadastro() {

  const navigation = useNavigation();

  const navegaContatos = () => { navigation.navigate('Contatos') };

  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [tipo, setTipo] = useState('');
  const [numero, setNumero] = useState('');
  const [registros, setRegistros] = useState([]);

  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data_nasc DATE)',
        [],
        () => console.log('Tabela tbl_clientes criada com sucesso!'),
        (_, error) => console.error(error)
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_telefones (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT, tipo TEXT)',
        [],
        () => console.log('Tabela tbl_telefones criada com sucesso!'),
        (_, error) => console.error(error)
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_telefone_has_clientes (clientes_id INTEGER NOT NULL, telefones_id INTEGER NOT NULL,  FOREIGN KEY (clientes_id) REFERENCES tbl_clientes(id), FOREIGN KEY (telefones_id) REFERENCES tbl_telefones(id));',
        [],
        () => console.log('Tabela tbl_telefone_has_clientes criada com sucesso!'),
        (_, error) => console.error(error),
      );
    });

    //excluir a tabela
    // db.transaction(tx => {
    //  tx.executeSql(
    //    'DROP TABLE IF EXISTS tbl_telefone_has_clientes;',
    //    [],
    //    () => console.log('Tabela tbl_telefone_has_clientes excluída com sucesso!'),
    //    (_, error) => console.error('Erro ao excluir a tabela tbl_telefone_has_clientes:', error)
    //  );
    // });

  }, []);

  /* Cadastrar o contato */

  const cadastrar = () => {
    if (
      tipo === null || tipo.trim() === '' ||
      numero === null || numero.trim() === '' ||
      nome === null || nome.trim() === '' ||
      dataNasc === null || dataNasc.trim() === ''
    ) {
      Alert.alert('Amigo', 'Tu não preencheu todos os dados, volta lá e preenche.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tbl_clientes(nome, data_nasc) VALUES (?,?);',
        [nome, dataNasc],
        (_, res) => {
          const cclientesID = res.insertId;
          console.log(cclientesID);

          tx.executeSql(
            'INSERT INTO tbl_telefones(numero, tipo) VALUES (?,?);',
            [numero, tipo],
            (_, res) => {
              const ctelefonesID = res.insertId;
              console.log(ctelefonesID);

              tx.executeSql(
                'INSERT INTO tbl_telefone_has_clientes(telefones_id, clientes_id) VALUES (?,?);',
                [ctelefonesID, cclientesID],
                () => {
                  console.log(cclientesID, ctelefonesID);
                  Alert.alert('Contato adicionado com sucesso!');
                  setNome('');
                  setDataNasc('');
                  setNumero('');
                  setTipo('');
                  navegaContatos();
                },
                (_, error) => {
                  console.error('Erro ao inserir dados na tbl_telefone_has_clientes:', error);
                  Alert.alert('Ocorreu um erro ao adicionar o contato. Por favor, tente novamente.');
                }
              );
            },
            (_, error) => {
              console.error('Erro ao inserir dados na tbl_telefones:', error);
              Alert.alert('Ocorreu um erro ao adicionar o contato. Por favor, tente novamente.');
            }
          );
        },
        (_, error) => {
          console.error('Erro ao inserir dados na tbl_clientes:', error);
          Alert.alert('Ocorreu um erro ao adicionar o contato. Por favor, tente novamente.');
        }
      );
    });
  };

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

  return (

    <ScrollView>

      <View style={styles.container}>

        <Text style={{ color: '#323b20', marginTop: 90, fontSize: 20, fontWeight: 'bold' }}>Insira as informações necessárias</Text>
        <Text style={{ color: '#323b20', marginTop: 5, fontSize: 20, fontWeight: 'bold', marginBottom: 70 }}>para cadastrar um novo contato:</Text>

        <Text style={styles.label}>Nome:</Text>
        <TextInput
          value={nome}
          style={styles.input}
          placeholder='Insira o nome do contato'
          onChangeText={setNome}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Data de nascimento:</Text>
        <TextInput
          value={dataNasc}
          style={styles.input}
          placeholder='DD/MM/AAAA'
          onChangeText={setDataNasc}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Número:</Text>
        <TextInput
          value={numero}
          style={styles.input}
          placeholder='Insira o número'
          onChangeText={setNumero}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Tipo:</Text>
        <TextInput
          value={tipo}
          style={styles.input}
          placeholder='Celular/Trabalho/Casa'
          onChangeText={setTipo}
          autoCapitalize="characters"
        />

        <Pressable
          onPress={cadastrar}
          style={({ pressed }) => [
            styles.btns,
            {
              backgroundColor: pressed ? '#b5c7a7' : '#323b20',
            }
          ]}
        >

          <Text style={{ color: '#fafafa', fontWeight: 'bold' }}>
            REGISTRAR
          </Text>

        </Pressable>


      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'F1EEE5',
    alignItems: 'center',
    gap: 10
  },
  input: {
    height: 40,
    width: 270,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#323b20',
    borderLeftWidth: 2,
    borderLeftColor: '#323b20'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#323b20',
  },
  title: {
    fontSize: 23
  },
  btns: {
    width: 170,
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    fontSize: 22
  }
});
