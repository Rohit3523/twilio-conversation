import * as React from 'react';
import { Text, View, Image, Pressable, TextInput, FlatList, StyleSheet, Keyboard, Dimensions } from 'react-native';
import Constants from 'expo-constants';
const { height, width } = Dimensions.get('screen');
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Chat({ route }) {
    const state = useSelector((state)=> state);
    const navigation = useNavigation();

    const { name, sid } = route.params;

    let flatlistRef = React.useRef();
    let [content, setContent ] = React.useState("");
    let [messages, setMessages ] = React.useState([]);

    React.useEffect(()=>{
        state.twilioClient.getChannelBySid(sid).then((channel)=>{
            channel.getMessages().then((paginator)=>{
                let msgs = [];
                paginator.items.forEach((message)=>{
                    msgs.push({
                        sid: message.sid,
                        content: message.body,
                        memberSid: message.memberSid,
                        author: message.author
                    });
                });
                setMessages(msgs);
            });

            channel.on('messageAdded', (message)=>{
                setMessages((messages) => [...messages, {
                    sid: message.sid,
                    content: message.body,
                    memberSid: message.memberSid,
                    author: message.author
                }]);

                flatlistRef.current?.scrollToEnd();
            });
        });

        return () => {
            state.twilioClient.getChannelBySid(sid).then((channel)=>{
                channel.removeAllListeners();
            });
        }
    }, []);

    async function sendMessage(){
        setContent("");
        state.twilioClient.getChannelBySid(sid).then((channel)=>{
            channel.sendMessage(content);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back-sharp" size={24} color="white" onPress={()=>{
                    if(navigation.canGoBack()){
                        navigation.goBack();
                    }
                }}/>
                <View style={styles.user_image}>
                    <Ionicons name="person" size={30} color="white" />
                </View>
                <Text style={styles.header_text}>{name.replace(state.identity, "")}</Text>
            </View>
            <FlatList
                style={styles.message_box}
                ref={flatlistRef}
                data={messages}
                renderItem={({ item }) => (
                    <Card style={[ item.author == state.identity ? styles.message_self : styles.message_other ]}>
                        <Card.Content> 
                            <Text style={styles.message_text}>{item.content}</Text>
                        </Card.Content>
                    </Card>
                )}
                keyExtractor={item => item.sid}
            />
            <View style={{ flexDirection: 'row' }}>
                <TextInput 
                    placeholder="Message"
                    value={content}
                    onChangeText={(text)=> setContent(text)}
                    style={styles.input}
                    placeholderTextColor={"#ffffff"}
                />
                <Pressable style={styles.send_button} onPress={()=>{
                    if(content != ""){
                        sendMessage();
                    }
                }}>
                    <Ionicons name="send" size={30} color="white" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#121b22'
  },
  header: {
    height: 50,
    width: '100%',
    backgroundColor: '#1f2c34',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  user_image: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: '#121b22',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  header_text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10
  },
  message_box: {
    marginTop: 15,
    width: '100%',
    paddingBottom: 5
  },
  message_self: {
    width: '80%',
    marginTop: 2,
    marginBottom: 2,
    alignSelf: 'flex-end',
    backgroundColor: '#00a884',
  },
  message_other: {
    width: '80%',
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#1f2c34'
  },
  message_text: {
    color: '#ffffff',
  },
  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#1f2c34',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#ffffff'
  },
  send_button: {
    height: 50,
    width: 50,
    backgroundColor: '#00a884',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0064e0',
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
