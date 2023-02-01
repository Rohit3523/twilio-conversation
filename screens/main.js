import * as React from 'react';
import { Text, View, Pressable, FlatList, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { Client } from 'twilio-chat';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ChannelCreate from '../components/ChannelCreate';

const { height } = Dimensions.get('screen');

export default function Home() {
  const state = useSelector((state)=> state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let twilioClient = React.useRef(null);
  let [createChannelVisible, setCreateChannelVisible] = React.useState(false);

  let [channels, setChannels] = React.useState([]);

  NavigationBar.setBackgroundColorAsync('#121b22');

  React.useEffect(()=>{
    async function main(){
      if(state.twilioClient != null){
        twilioClient.current = state.twilioClient;
      }else{
        twilioClient.current = new Client(state.token);

        dispatch({ type: 'SET_TWILIO_CLIENT', data: twilioClient.current });
      }

      await twilioClient.current.getSubscribedChannels().then((paginator) => {
        setChannels(paginator.items);
      });

      twilioClient.current.on('channelAdded', (channel) => {
        setChannels((channels) => [...channels, channel]);
      });
    } 

    main();

    return () => {
      twilioClient.current.removeAllListeners();
    }
  }, []);
  
  return (
    <SafeAreaView>
      <StatusBar backgroundColor='#1f2c34' style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>Home (User: {state.identity})</Text>
        </View>
        <View style={styles.body}>
          <FlatList
            data={channels}
            renderItem={({ item }) => (
              <Pressable style={styles.channel} onPress={()=>{
                navigation.navigate('Chat', { sid: item.sid, name: item.friendlyName });
              }}>
                <View style={styles.user_image}>
                  <Ionicons name="person" size={30} color="white" />
                </View>
                <Text style={styles.user_name}>{item.friendlyName.replace(state.identity, "")}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.sid}
          />
          <Pressable style={styles.create_chat_button} onPress={()=> setCreateChannelVisible(true)}>
            <MaterialCommunityIcons name="message-reply-text-outline" size={26} color="white" />
          </Pressable>
        </View>
        {
          createChannelVisible ? (
            <ChannelCreate twilio={twilioClient.current} close={setCreateChannelVisible}/>
          ) : null
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121b22'
  },
  header: {
    height: 70,
    backgroundColor: '#1f2c34',
    justifyContent: 'center'
  },
  header_text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20
  },

  body: {
    marginTop: 10,
    height: height - 160
  },


  create_chat: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  create_chat_button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 10
  },
  create_chat_button_text: {
    fontSize: 30,
    fontWeight: 'bold'
  },

  channel: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2c34',
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 20
  },
  user_image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginLeft: 10,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center'
  },
  user_name: {
    fontSize: 20,
    marginLeft: 15,
    color: '#fff',
    fontWeight: 'bold'
  }
});