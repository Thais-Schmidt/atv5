import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/pages/Home';
import Cadastro from './src/pages/Cadastro';
import Contatos from './src/pages/Contatos';
import Editar from './src/pages/Editar';
import Pesquisar from './src/pages/Pesquisar';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
          />
          <Stack.Screen
            name='Editar'
            component={Editar}
          />
          <Stack.Screen
            name='Cadastro'
            component={Cadastro}
          />
          <Stack.Screen
            name='Contatos'
            component={Contatos}
          />
          <Stack.Screen
            name='Pesquisar'
            component={Pesquisar}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
