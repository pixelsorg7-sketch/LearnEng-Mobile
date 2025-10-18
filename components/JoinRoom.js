import {AppState,BackHandler,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View, KeyboardAvoidingView } from 'react-native';
import React, { useCallback,memo, useRef,useContext, useState , useEffect} from 'react';
import {useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import axios from 'axios'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore, { doc } from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid';
import { AnimatePresence, MotiView } from 'moti'
import {MyInGameStor} from '../gameData/InGameStorage'; 
import SoundPlayer from "react-native-sound-player";
import { server } from '../metro.config';
import { Timestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const JoinRoom=()=>{

     const navigation = useNavigation(); //navigation

     useEffect(() => {
       
             const subscription = AppState.addEventListener('change', nextAppState => {
     
               const autoleaveroomfunc=async()=>{

             
                 const joinroomlistdb = firestore().collection('joinroom-list');
                const getjoinroomlist = await joinroomlistdb
                .where('studentid','==',studProfile.studentID)
                .limit(1)
                .get()
     
                const searchjoinroomlist = getjoinroomlist.docs.map(doc=>({
                 ...doc.data(),
                 uid:doc.id
                }))
     
                 firestore()
                 .collection('joinroom-list')
                 .doc(searchjoinroomlist[0].uid)
                .delete()
     
                setjoinActive(false)
                setplayerRoomList([])
     
                 Toast.show({
                 type:'error',
                 text1:'Disconnected',
                 text2:'You automatically leave the playroom',
               visibilityTime: 2000,
                      })
               
                
               }
     
               autoleaveroomfunc()
     
             })
       
              return () => {
             subscription.remove();
           };
            },[])

       //back btn func
            useFocusEffect(
            React.useCallback(() => {
            const onBackPress = () => {
             
           navigation.replace('mainscreen')
              return true; 
                
                  
                   
              };
             const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
              return () => backHandler.remove();    
            }, [])
          );

     //context state for ingame
    const {ingameQues,setingameQues}=useContext(MyInGameStor)
    const {ingameAns,setingameAns}=useContext(MyInGameStor);
    const {quesCount,setquesCount}=useContext(MyInGameStor)
    const {ansActModule,setansActModule}=useContext(MyInGameStor)

       const {studProfile,setstudProfile}=useContext(MyStorage)
       const {studAssets,setstudAssets}=useContext(MyStorage)
    //reponse useState toggle
    const {joinActive,setjoinActive}=useContext(MyInGameStor)

    //textinput useState

    const [roomcodeHold,setroomcodeHold]=useState(0); 


     const {roomInformation,setroomInformation}=useContext(MyInGameStor);

     //static useState

     const [playerRoomList,setplayerRoomList]=useState([]); //player list in the room useState
  const [playerDocuid,setplayerDocuid]=useState(""); //for holding studentid in joinroom-list for deletion

  //for keeping avatar img location 
    const localImageMap = {
  char1: require('../assets/characters/char1.png'),
  char2: require('../assets/characters/char2.png'),
  char3: require('../assets/characters/char3.png'),
  char4: require('../assets/characters/char4.png'),
  char5: require('../assets/characters/char5.png'),
  char6: require('../assets/characters/char6.png'),
  char7: require('../assets/characters/char7.png'),
  char8: require('../assets/characters/char8.png'),
  char9: require('../assets/characters/char9.png'),

};

//get current time
const API_KEY = 'B7HYJWPYIN1K'; // Replace with your actual API key
// const TIMEZONE_NAME = '	Asia/Manila';
const [serverTime,setserverTime]=useState(null)

 const getCurrentTime=useCallback(async()=>{
    try{
         const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Manila');
        const data = await response.json();
        
        const serverTimeDate = new Date(data.datetime);
        setserverTime(serverTimeDate);

    }
    catch(error){
        console.log(error)
    }
 })
useEffect(()=>{
 getCurrentTime()
},[joinActive])

//animated values------
  const loadingJoinX = useRef(new Animated.Value(1)).current;
    //functions

    useEffect(()=>{ //leave player trigger

        if(joinActive === false){
            firestore()
            .collection('joinroom-list')
            .doc(playerDocuid)
           .delete()
        }

    },[joinActive])

    //join func
    const [joinbtnLoad,setjoinbtnLoad]=useState(false)
    const JoinroomFunc=useCallback(async()=>{

         Animated.spring(loadingJoinX,{
            toValue:0.5,
            duration:500,
            useNativeDriver:true
          }).start()

       setjoinbtnLoad(true)

        try{
      
        if(joinActive === false){ //find room---------------
             SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
            //if the user inputted the code------------------
             
            const roomdblist = firestore().collection('joinroom');
            const getroom = await roomdblist
            .where('roomcode','==',roomcodeHold)
            .limit(1)
            .get()
        
            const searchroom = getroom.docs.map(doc=>({
                ...doc.data(),
                roomid:doc.id //get room document id
            }))

            if(searchroom.length === 0){ //no room found response handling
                Alert.alert(
                    "Notice",
                    "Room not Found"
                )
            }

            //put to room information useState

            const convertroom={    //may cut down responses when undefined
                roomid:searchroom[0].roomid,
                roomcode:searchroom[0].roomcode,
                teacherid:searchroom[0].teacherid,
                timeopen:searchroom[0].timeopen.toDate()
            }
            console.log(searchroom[0].timeopen)

            //join player from the room (joinroom-list)------------------

            // firestore().collection

            firestore().collection('joinroom-list').doc(uuid.v4())
            .set({
                roomcode:searchroom[0].roomcode,
                studentid:studProfile.studentID,
                studentname:studProfile.username,
                studenttitle:studAssets.titleequiptext,
                studentavatar:studAssets.characterequipimg  
            })

              //render available player/s in the room
     const joinroomlistdb = firestore().collection('joinroom-list')
       const unsubscribe = joinroomlistdb
      .where('roomcode', '==', roomcodeHold)
      .onSnapshot(snapshot => {
        const players = snapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        }));
        setplayerRoomList(players);
      });

        //    const joinroomlistdb = firestore().collection('joinroom-list')
        //    const allplayerroom = await joinroomlistdb
        //    .where('roomcode','==',roomcodeHold)
        //    .get()

        //    const searchallplayerroom = allplayerroom.docs.map(doc=>({       
        //     ...doc.data(),
        //     uid:doc.id
        //    }))

        //    setplayerRoomList(searchallplayerroom)
          
    

            setroomInformation(convertroom)
            setjoinActive(true)
            return () => unsubscribe();
        }

        else{ //leave room

            SoundPlayer.playAsset(require("../assets/sounds/clickedOut.mp3"))
            //search player in joinroom-list first before triggering deletion effect
           const joinroomlistdb = firestore().collection('joinroom-list');
           const getjoinroomlist = await joinroomlistdb
           .where('studentid','==',studProfile.studentID)
           .limit(1)
           .get()

           const searchjoinroomlist = getjoinroomlist.docs.map(doc=>({
            ...doc.data(),
            uid:doc.id
           }))

           setplayerDocuid(searchjoinroomlist[0].uid)

             setroomInformation({}) 
               setplayerRoomList([])
            setjoinActive(false)  //trigerring useEffect leave player
             
        }
        }

        catch{
            console.log("error")
        }
        finally{
            Animated.spring(loadingJoinX,{
            toValue:1,
            duration:500,
            useNativeDriver:true
          }).start(()=>{
             setjoinbtnLoad(false)
          })
       
        } 
        
    })

    const startgameFunc=useCallback(async()=>{ 
SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3")) 
const formatTo12Hour = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-PH', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        });
    };

    console.log("manilatime zone " + serverTime);
    console.log("roomtime zone " + roomInformation.timeopen);

      const manilaTimeMs = serverTime ? serverTime.getTime() : new Date().getTime();
    const roomTime = roomInformation.timeopen; 

    let roomTimeMs;
    if (typeof roomTime === 'string') {
        roomTimeMs = new Date(roomTime).getTime();
    } else {
        const roomTimeNum = Number(roomTime);
        roomTimeMs = roomTimeNum > 10000000000 ? roomTimeNum : roomTimeNum * 1000;
    }

    // Validate timestamps
    if (isNaN(manilaTimeMs) || isNaN(roomTimeMs)) {
        console.error("Invalid timestamp format");
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid time format',
            visibilityTime: 2000,
        });
        return;
    }

    // Format both times for display
    const manilaTimeFormatted = formatTo12Hour(manilaTimeMs);
    const roomTimeFormatted = formatTo12Hour(roomTimeMs);

    console.log("manilatime " + manilaTimeMs);
    console.log("roomtime " + roomTimeMs);
    console.log("Manila time (12hr): " + manilaTimeFormatted);
    console.log("Room time (12hr): " + roomTimeFormatted);

    if (manilaTimeMs > roomTimeMs) {
        console.log("Manila time is later than room time - proceeding!");
        navigation.replace('categorieschoose');
    } else {
        console.log("Manila time is not later than room time");
        const difference = roomTimeMs - manilaTimeMs;
        console.log("Room time is ahead by " + difference + "ms");

        Toast.show({
            type: 'error',
            text1: 'Room Not Ready Yet',
            text2: `Available at ${roomTimeFormatted}`,
            visibilityTime: 3000,
        });
    }




    })

    return(
        <>

        <ImageBackground source={require('../assets/joinroom-bg2.png')} style = {styles.container}>


        <View style = {styles.backbtncon}> 
        <TouchableOpacity
        disabled={joinActive}
        onPress={()=>navigation.replace('mainscreen')}
        >
            <View style = {joinActive ? [styles.backbtn,{backgroundColor:'lightblue'}] :styles.backbtn}>
            <Text style = {{fontSize:16,top:10,color:'brown',fontWeight:'bold'}}>{joinActive ? "IN ROOM..." : 'BACK'}</Text>
            </View>
        </TouchableOpacity>
       </View>

       {/* playercount */}
       <View style = {styles.playerscountcon}>

      
       <Text style = {{fontSize:19,color:'#8c6006',fontWeight:'bold'}}>Players in the Room</Text>
       <View style = {styles.playerscount}> 
       
         <Text style = {{fontSize:15,fontWeight:'bold',bottom:hp('1%')}}>{ playerRoomList.length}</Text>
     
       </View>
       </View>

       {/* joinpanel------------------- */}

       <View style = {styles.joincodecon}>

       <TextInput
        placeholder='Code'
        style={joinActive ? styles.roomcodetfactive : styles.roomcodetf}
        editable={!joinActive} selectTextOnFocus={!joinActive}
        onChangeText={(text)=>setroomcodeHold(Number(text))}
       ></TextInput>
       
       <View style = {styles.joinbtncon}>

       {/* joinbtn */}
       <TouchableOpacity 
       onPress={JoinroomFunc}
       disabled={joinbtnLoad}
       >
       <Animated.View style = {[joinActive ? styles.joinbtnactive : styles.joinbtn,{
        transform:[
            {scaleX:loadingJoinX}
        ]
       } ]}>
       {joinbtnLoad ?
       <ActivityIndicator size='small' color="#00ff73ff" />
        : 
        <Text 
        style = {joinActive ? {fontSize:wp('3.4%'),color:'white',fontWeight:'bold'} : {fontSize:15,color:'black',fontWeight:'bold'}}
        >{joinActive ? "LEAVE ROOM" : "JOIN"}</Text>
        }
        </Animated.View>
       </TouchableOpacity>

         {/* startgamebtn */}
       <TouchableOpacity 
       style = {!joinActive ? styles.startgamebtndis : styles.startgamebtn}
       onPress={startgameFunc}
       disabled={!joinActive}
       >
        <Text
        style = {!joinActive ? {fontSize:14,color:'white',fontWeight:'bold'} :  {fontSize:15,color:'white',fontWeight:'bold'} }
        >{!joinActive ? "game not set" : "Start game"}</Text> 
       </TouchableOpacity>

       </View>


       </View>

       <View style = {{width:wp('100%'), alignContent:'center',alignItems:'center',top:30,backgroundColor:'#64d43e',borderWidth:3,borderColor:'white'}}>
       <Text style = {{color:'white',fontSize:25,fontWeight:'bold'}}>Players</Text>
       </View>

       {/* playerlist */}
       
       <View style = {styles.playerlistcon}>

        {joinActive ? 
       <ScrollView>
       {playerRoomList.map((element,index)=>(
        <View style = {styles.playerbox}>
       {/* <Image style = {styles.playerprofile} source={{uri:'https://img.freepik.com/premium-vector/boy-with-black-hair-use-school-uniform-outfit-pixel-art-style_682225-30.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/> */}
        <View style = {[styles.playerinfo]}>
        <Text style = {styles.playername}>{element.studentname}</Text>
        <Text style = {styles.playertitle}>{element.studenttitle}</Text>
        </View>
        <Image style = {styles.playermedal} source={localImageMap[studAssets.characterequipimg]}/>
       </View>
     
      ))}
       </ScrollView>
         : ''}
       </View>
        

        </ImageBackground>

        </>
    );
};

const styles = StyleSheet.create({

      container:{
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor:'#4483E4'

    },

    backbtncon:{

        width:wp('100%'),
        height:hp('9%'),
        // borderWidth:2,
        paddingLeft:wp('5%'),
        paddingTop:wp('2%'),


    },
    backbtn:{
        width:wp('29%'),
        height:hp('6%'),
        borderWidth:3,
        borderColor:'white',
        borderRadius:10,
        alignContent:'center',
        alignItems:'center',
        backgroundColor:'lightgreen'
    },
    playerscountcon:{
        width:wp('80%'),
        height:hp('8%'),
        borderWidth:3,
        borderRadius:20,
        // position:'relative',
        // top:hp('7%'),
        alignContent:'center',
        alignItems:'center',
        flexDirection:'row',
        columnGap:40,
        left:wp('11%'),
        borderColor:'#8c6006',
        backgroundColor:'white',
        paddingLeft:wp('9%')
    },
    playerscount:{
        width:wp('13%'),
        height:hp('5%'),
        right:wp('4%'),
        borderWidth:5,
        borderColor:'#abdaea',
        borderRadius:10,
        backgroundColor:'#a8684f',
        alignContent:'center',
        alignItems:'center',
        paddingTop:10
    },
    
    joincodecon:{

        width:wp('90%'),
        height:hp('20%'),
        backgroundColor:'#bad393',
        borderRadius:10,
        position:'relative',
        left:wp('5%'),
        alignContent:'center',
        alignItems:'center',
        rowGap:20,
        paddingTop:20,
        borderRadius:20
    },
    roomcodetf:{
        width:'70%',
        height:50,
        borderWidth:3,
        borderRadius:10,
        fontSize:20,
        color:'black',
      borderColor: 'white',
      borderRadius: 20,
       backgroundColor: '#abdaea',
    },
    roomcodetfactive:{
        width:'70%',
        height:50,
        borderWidth:3,
        borderRadius:10,
        fontSize:20,
        color:'white',
        backgroundColor:'lightgray'
    },

    joinbtncon:{
        width:wp('90%'),
        height:'auto',
        // borderWidth:2,
        alignContent:'center',
        alignItems:'center',
        flexDirection:'row',
        columnGap:30,
        paddingLeft:60
    },
    joinbtn:{
        width:wp('25%'),
        height:hp('6%'),
        alignContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingTop:12,
        backgroundColor:'#a8684f',
         elevation:20,
    },

    joinbtnactive:{
        width:wp('25%'),
        height:hp('6%'),
        alignContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingTop:12,
        backgroundColor:'#655b10',
        elevation:20,
    },
      startgamebtndis:{
        width:wp('25%'),
        height:hp('6%'),
        alignContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingTop:12,
        backgroundColor:'#655b10',
        elevation:20,
    },
     startgamebtn:{
        width:wp('25%'),
        height:hp('6%'),
        alignContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingTop:12,
        backgroundColor:'#a8684f',
        elevation:20,
    },

    playerlistcon:{
        width:wp('80%'),
        height:350,
         backgroundColor: 'rgba(99, 156, 230, 0.5)',
        left:wp('10%'),
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
       paddingLeft:20,
       paddingTop:20,
       paddingBottom:20,
       top:hp('7%'),
    //    columnGap:30
       
    },

    playerbox:{
        width:wp('68%'),
        height:70,
        // borderWidth:2,
        marginTop:10,
        // borderRadius:15,
        flexDirection:'row',
        alignContent:'center',
        paddingLeft:20,
        alignItems:'center',
        backgroundColor:'#92e775',
        columnGap:30,
       
    },
    playerinfo:{
        width:wp('35%')
    },
    playerprofile:{
        width:50,
        height:50,
        borderWidth:2,
        borderColor:'blue',
        borderRadius:20
    },

    playermedal:{
        width:wp('15%'),
        height:hp('7%'),
        // borderWidth:2,
        // borderColor:'yellow',
        borderRadius:20
    },
    playername:{
        fontSize:19,
        fontWeight:'bold',
        color:'red'
    },
    playertitle:{
        fontSize:14,
        color:'red'
     
    }


});

export default memo(JoinRoom);