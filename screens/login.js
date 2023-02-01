import * as React from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, ToastAndroid, Keyboard, Dimensions } from 'react-native';
import Constants from 'expo-constants';
const { height } = Dimensions.get('screen');
import { useDispatch } from 'react-redux';


export default function Login() {
  let dispatch = useDispatch();

  let usernameref = React.useRef();
  let [username, setUsername ] = React.useState("");

  React.useEffect(()=>{
    const hideSubscription = Keyboard.addListener('keyboardDidHide', ()=>{
      usernameref.current?.blur();
    });

    fetch(`https://impartial-tasteful-mozzarella.glitch.me/token/test`).catch(()=>{});
    
    return () => { 
      hideSubscription.remove();
    };
  }, []);

  function button(){
    Keyboard.dismiss();
    ToastAndroid.show("Logging in... (This might take few seconds)", ToastAndroid.SHORT);
    
    fetch(`https://impartial-tasteful-mozzarella.glitch.me/token/${username}`)
      .then(res=> res.json())
      .then(res=>{ 
        dispatch({ type: "SET_IDENTITY", data: res });
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twilio Conversation</Text>
      <View style={styles.box}>
        <TextInput
          style={styles.input}
          label="Username"
          ref={usernameref}
          value={username}
          placeholder="Username"
          placeholderTextColor={'#ffffff'}
          onChangeText={(text)=> setUsername(text)}
        />
        <Pressable style={styles.button} onPress={()=> button() }>
          <Text style={styles.buttontext}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#121b22',
    padding: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  box: {
    marginTop: height / 4,
    width: '100%',
    paddingBottom: 5
  },
  input: {
    height: 50,
    marginTop: 5,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#1f2c34',
    color: '#ffffff',
    borderRadius: 5,
    paddingLeft: 10
  },
  button: {
    backgroundColor: '#00a884',
    width: '95%',
    height: 45,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 5
  },
  buttontext: {
    color: '#ffffff',
    height: '100%',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
