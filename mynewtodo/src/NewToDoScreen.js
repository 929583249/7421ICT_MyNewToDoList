import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

function NewToDoScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // 检查输入是否为空
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in both title and description.");
      return;
    }

    // 将新任务传回HomeScreen
    navigation.navigate('Home', { newTodo: { title, description } });
    
    // 显示成功提示
    Alert.alert("Success", "ToDo Added Successfully");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title here"
          multiline
          value={title}
          onChangeText={setTitle} // 更新标题
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description here"
          multiline
          value={description}
          onChangeText={setDescription} // 更新描述
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Save"
            onPress={handleSave} // 调用handleSave处理保存逻辑
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 60,
  },
  buttonContainer: {
    flexDirection: 'row', // 使按钮并排显示
    justifyContent: 'space-between', // 分散对齐
    width: '100%', // 容器宽度为100%
  },
  buttonSpacer: {
    width: 10, // 在两个按钮之间添加一些空间
  },
});

export default NewToDoScreen;
