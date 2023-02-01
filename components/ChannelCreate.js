import * as React from 'react';
import { Text, View, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChannelCreate({ twilio, close }) {
  let state = useSelector((state)=> state);
  let [name, setName] = React.useState("");

  async function createChannel(){
    if(name == ""){
      ToastAndroid.show("Please enter a username", ToastAndroid.SHORT);
      return;
    }

    if(name == state.identity){
      ToastAndroid.show("You can't create a conversation with yourself", ToastAndroid.SHORT);
      return;
    }

    twilio.getUser(name).then(async (user)=>{
      if(user == null){
        ToastAndroid.show("User not found", ToastAndroid.SHORT);
      }else{
        twilio.createChannel({
          friendlyName: user.identity + state.identity,
          uniqueName: user.identity + state.identity,
        }).then(async (channel)=>{
          close(false);

          ToastAndroid.show("Conversation created", ToastAndroid.SHORT);

          await channel.join();
          await channel.add(user.identity);
        }).catch((err)=>{
          ToastAndroid.show("Error creating conversation", ToastAndroid.SHORT);
        });
      }
    }).catch((err)=>{
      ToastAndroid.show("User not found", ToastAndroid.SHORT);
    });

  }

  return (
    <Pressable style={styles.container} onPress={()=> close(false)}>
      <View style={styles.popup}>
        <Text style={styles.head}>Create Conversation</Text>
        <View style={styles.body}>
          <TextInput
            label="Username"
            mode="outlined"
            style={styles.input}
            value={name}
            onChangeText={(text)=> setName(text)}
          />
          <Pressable style={styles.create_button} onPress={()=> createChannel()}>
            <Text style={styles.create_button_text}>Create</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090',
    position: 'absolute',
  },
  popup: {
    height: 200,
    width: '90%',
    alignSelf: 'center',
  },
  head: {
    height: 50,
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },  
  body: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  create_button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10
  },
  create_button_text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});