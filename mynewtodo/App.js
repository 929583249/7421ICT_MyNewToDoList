import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import NewToDoScreen from './src/NewToDoScreen';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';  // 引入 uuid 库
import 'react-native-get-random-values';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route }) {
  const [todos, setTodos] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    const loadTodos = async () => {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    if (route.params?.newTodo) {
      const newTodo = route.params.newTodo;
      const newId = uuidv4();  // 使用 uuid 生成唯一的 id
      const updatedTodos = [...todos, { ...newTodo, id: newId, completed: false }];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      navigation.setParams({ newTodo: null });
    }
  }, [route.params?.newTodo]);

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      Alert.alert('Error', 'Failed to save the todos.');
    }
  };

  const handleComplete = (id) => {
    const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setLastAction({ type: 'complete', id, completed: !todos.find(todo => todo.id === id).completed });
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setLastAction({ type: 'delete', item: todos.find(todo => todo.id === id) });
  };

  const handleUndo = () => {
    if (!lastAction) return;
    if (lastAction.type === 'complete') {
      const updatedTodos = todos.map(todo => todo.id === lastAction.id ? { ...todo, completed: lastAction.completed } : todo);
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    } else if (lastAction.type === 'delete') {
      const updatedTodos = [...todos, lastAction.item].sort((a, b) => a.id.localeCompare(b.id));
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    }
    setLastAction(null);
  };

  const toggleExpand = (id) => {
    setExpanded(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTitle, item.completed && { color: 'green' }]}>{item.title}</Text>
        <Ionicons name={expanded[item.id] ? 'chevron-up' : 'chevron-down'} size={24} color="black" />
      </View>
      {expanded[item.id] && (
        <View>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <View style={styles.buttonContainer}>
            {!item.completed && (
              <TouchableOpacity onPress={() => handleComplete(item.id)} style={styles.smallButton}>
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.smallButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
        <Ionicons name="arrow-back-circle-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>My to do list</Text>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <TouchableOpacity onPress={() => navigation.navigate('NewToDo')} style={styles.button}>
        <Text style={styles.buttonText}>Add New ToDo</Text>
      </TouchableOpacity>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewToDo" component={NewToDoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  undoButton: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    padding: 10,
    borderRadius: 30,
    zIndex: 1000
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 20,
    color: 'black',
  },
  list: {
    marginTop: 100,
    width: '100%',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    color: 'red',
  },
  itemDescription: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
  smallButton: {
    padding: 5,
    margin: 5,
    backgroundColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});

export default App;
