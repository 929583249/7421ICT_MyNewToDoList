import React, { useState, useEffect }from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import NewToDoScreen from './src/NewToDoScreen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();


function HomeScreen({ navigation, route }) {
  useEffect(() => {
    if (route.params?.newTodo) { // 检查是否有新任务传入
      const newTodo = route.params.newTodo;
      const newId = todos.length + 1; // 简单生成新ID
      setTodos([...todos, { ...newTodo, id: `${newId}`, completed: false }]);
      route.params.newTodo = null; // 清除参数避免重复添加
    }
  }, [route.params?.newTodo]); // 依赖于新任务的参数

  const [expanded, setExpanded] = useState({});
  const [todos, setTodos] = useState([
    { id: '1', title: 'FIRST THING', description: '1', completed: false },
    { id: '2', title: 'SECOND THING', description: '2', completed: false },
    { id: '3', title: 'THIRD THING', description: '3', completed: false },
    { id: '4', title: 'FOURTH THING', description: '4', completed: false }
  ]);
  const [lastAction, setLastAction] = useState(null);  // 用于追踪最后一次操作的状态

  const toggleExpand = (id) => {
    setExpanded(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleComplete = (id) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: true } : todo
    ));
    setLastAction({ action: 'complete', id: id });  // 确保这里正确设置了
  };
  
  const handleDelete = (id) => {
    const deletedItem = todos.find(todo => todo.id === id);
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setLastAction({ action: 'delete', id: id, item: deletedItem });  // 确保这里正确设置了
  };

  const handleUndo = () => {
    console.log("Undo clicked");  // 检查这个函数是否被调用
    if (!lastAction) return;  // 如果没有可撤销的操作，则不执行任何操作
    const { action, id, item } = lastAction;
    if (action === 'complete') {
      // 撤销完成操作
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: false } : todo
      ));
    } else if (action === 'delete') {
      // 撤销删除操作
      setTodos(prevTodos => [...prevTodos, item].sort((a, b) => parseInt(a.id) - parseInt(b.id))); // 确保列表按ID排序
    }
    setLastAction(null);  // 清除最后一次操作的记录
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTitle, item.completed && {color: 'green'}]}>{item.title}</Text>
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
        <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
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
      <TouchableOpacity
      onPress={() => navigation.navigate('NewToDo')}
      style={styles.button}
    >
      <Text style={styles.buttonText}>Add new to do list</Text>
    </TouchableOpacity>
    <StatusBar style="auto" />
    <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
      <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
    </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewToDo" component={NewToDoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  undoButton: {
    position: 'absolute',
    right: 20,
    top: 30,
    backgroundColor: 'rgba(255,0,0,0.2)', // 红色背景透明度20%用于可视化位置
    padding: 10 // 增加填充使按钮更容易点击
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
    color: 'black',  // Changed color to black
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
    color: 'red',  // Title color set to red
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
