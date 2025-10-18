import {BackHandler,PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import {useFocusEffect, useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from '../components/StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios';
// import ResultPanel from './ResultPanel';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import RNFS from "react-native-fs";
import LottieView from 'lottie-react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Progress from 'react-native-progress';
import Storage from '@react-native-firebase/storage';
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
// import TTSService from '../inBattInter/ttsService';

//AI components
const API_KEY = 'AIzaSyDKGzLk0TbdALjTFl5J8fH-e-cIBgvYwp0'; // Replace with your actual env var setup
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




const InGameReading=()=>{


  const navigation = useNavigation(); //navigation

    //localimage

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

  perfect_assessmentspellingmedal1:require('../assets/medals/perfect_assessmentspellingmedal1.png'),
  countspellmedal1:require('../assets/medals/countspellmedal1.png'),
  gamecountgrammar1:require('../assets/medals/gamecountgrammar1.png'),
  countgrammarmedal1:require('../assets/medals/countgrammarmedal1.png'),
  comprehensionfruitharvestmedal1:require('../assets/medals/comprehensionfruitharvestmedal1.png')

};

  ///force back tab
      useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
       
        console.log("cant exit")
        return true; 
          
            
             
       };
     const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();    
     }, [])
    );

  const [dataReady, setDataReady] = useState(false); //data state preparation


  //useState---------------
 const {studAssets,setstudAssets}=useContext(MyStorage)
 
  //story value
 const {storyContent,setstoryContent}=useContext(MyInGameStor); //story content
 const {storyQuestion,setstoryQuestion}=useContext(MyInGameStor);
  const [storyText,setstoryText]=useState("") //store current read speech
  const [storyImage,setstoryImage]=useState("") //stote current read image
  const [Storycount,setStorycount]=useState(0) //storySpeechcount

    //room information
    const {practiceEnabled,setpracticeEnabled}=useContext(MyInGameStor)    //practice enabled
  const {roomInformation,setroomInformation}=useContext(MyInGameStor);
   const {analyticsDocid,setanalyticsDocid}=useContext(MyInGameStor);
   const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);
  const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor);
  const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor);

  //game id value 
    const {gameTypeVal,setgameTypeVal}=useContext(MyInGameStor)
  

  const [loadingAssets,setloadingAssets]=useState(true);
  const [isLoading,setisLoading]=useState(false)

  const [readyUpStory,setreadyUpStory]=useState(false); //show ready up con

  //animated value---------------

  const storyconY = useRef(new Animated.Value(1)).current;
  // hp('0.12%')
  const readyupX = useRef(new Animated.Value(0)).current;
  const readyupY = useRef(new Animated.Value(0)).current;

  //for story panel anim
  const bounceStoryPanelY = useRef(new Animated.Value(0)).current;

   //for character idle animation
  
    const charidleX = useRef(new Animated.Value(0)).current;
    const charidleY = useRef(new Animated.Value(0)).current;


  //animation function---------------


  //animated idle character
  
         useEffect(() => {
      // Horizontal movement animation
      const horizontalAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(charidleX, {
            toValue: 20,
            duration: 2000, // 4 seconds to move across
            useNativeDriver: true,
          }),
          Animated.timing(charidleX, {
            toValue:-20,
            duration: 2000, // 4 seconds to return
            useNativeDriver: true,
          }),
            Animated.timing(charidleX, {
        toValue: 0, // Return to center
        duration: 2000,
        useNativeDriver: true,
      }),
        ]),
        { iterations: -1 }
      );
  
      // Jumping animation with random intervals
      const createRandomJump = () => {
        const jump = Animated.sequence([
          Animated.timing(charidleY, {
            toValue: -40, // Jump up 40px
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(charidleY, {
            toValue: 0, // Land back down
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(Math.random() * 3000 + 1500), // Random delay 1.5-4.5 seconds
        ]);
        
        jump.start(() => {
          // Recursively create next jump
          createRandomJump();
        });
      };
  
      // Start animations
      horizontalAnimation.start();
      createRandomJump();
  
      return () => {
        horizontalAnimation.stop();
        charidleY.stopAnimation();
      };
    }, [charidleX, charidleY]);


  //get data from the firebase

  useEffect(()=>{

    const readingFunc=async()=>{

      setisLoading(true)
      //practice mode----
      try{
        if(practiceEnabled === true){

        //get firebase storyreading
      const practicereadingdblist = firestore().collection('practice-storyreading')
      const practicereadingget = await practicereadingdblist
      .where('difficulty','==',inGameDifficulty)
      .get()


      let searchpracticereading = practicereadingget.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))

      searchpracticereading = searchpracticereading.slice(0,1);


      const newSetofreading=[...storyContent,searchpracticereading[0]];
      console.log(newSetofreading)
      setstoryContent(newSetofreading)

   
     //get firebase storyreadingques

      const readingquesdblist = firestore().collection('practice-readingques')
      const readingquesget = await readingquesdblist
      .where('difficulty','==',inGameDifficulty)
      .where('title','==',searchpracticereading[0].title)
      .get()

      let searchreadingques = readingquesget.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))

      
      setstoryQuestion(searchreadingques)
 

       }

       else{ //if practice is off

          //get firebase storyreading
      const readingdblist = firestore().collection('storyreading')
      const readingget = await readingdblist
      .where('thirdgameval','==',Number(gameTypeVal))
      .get()

       let searchreading = readingget.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))

     searchreading = searchreading.slice(0,1);


      const newSetofreading=[...storyContent,searchreading[0]];
      setstoryContent(newSetofreading)

      
      const readingquesdblist = firestore().collection('story-readingques')
      const readingquesget = await readingquesdblist
      .where('thirdgameval','==',Number(gameTypeVal))
      .get()

      let searchreadingques = readingquesget.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))

     setstoryQuestion(searchreadingques)




  

       };

   

      
      }

      catch(error){
        console.log(error)
         setloadingAssets(false)
      }

      setDataReady(true)
      setisLoading(false)
    }

    readingFunc()

  },[])


  //animated function------\

  const exitstoryConAnim=()=>{

    Animated.timing(storyconY,{

      toValue:0,
      duration:500,
      useNativeDriver:true,

    }).start(()=>{

      setreadyUpStory(true)

      //proceed to readyUp anim

      Animated.parallel([

        Animated.spring(readyupX,{
          toValue:1,
          duration:500,
          useNativeDriver:true
        }),
        Animated.spring(readyupY,{
          toValue:1,
          duration:300,
          useNativeDriver:true
        })

      ]).start();


    });

 }


  //story next
  useEffect(()=>{

    const getStories=async()=>{

      setloadingAssets(true)

    if (!dataReady ){ return;}

    //if storycount is less than the number of story contenet itself
  if(Storycount < storyContent[0].tellstory.length){
  try{
  const imageUrl = await Storage().ref(storyContent[0].imagepath[Storycount]).getDownloadURL();
  setstoryText(storyContent[0].tellstory[Storycount])
  setstoryImage(imageUrl)
    setloadingAssets(false)
  }
  catch(error){
    console.log(error)
     
  }
  return
  }


  //after you read all the story

  exitstoryConAnim()

    }
  
  getStories()


  },[Storycount,dataReady])

  //functions-----

    //adjust voce tone 
  //speak up

  // Setup TTS when component loads
  useEffect(() => {
    setupTTS();
    
    // Listen for speech events
    const startListener = Tts.addEventListener('tts-start', () => {
    });

    const finishListener = Tts.addEventListener('tts-finish', () => {
    });

    // Cleanup when component unmounts
    return () => {
      startListener?.remove();
      finishListener?.remove();
    };
  }, []);

  // Setup TTS with best settings
  const setupTTS = async () => {
    try {
      // Set speech speed (0.5 = slower for clarity)
      await Tts.setDefaultRate(0.5);
      
      // Set pitch (1.0 = normal female pitch)
      await Tts.setDefaultPitch(1.0);
      
      // Set language
      await Tts.setDefaultLanguage('en-US');
      
      // Find and use female voice
      const voices = await Tts.voices();
      const femaleVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('female') || 
               name.includes('samantha') || 
               name.includes('karen') || 
               name.includes('anna') ||
               name.includes('siri');
      });
      
      if (femaleVoice) {
        await Tts.setDefaultVoice(femaleVoice.id);
        console.log('Using female voice:', femaleVoice.name);
      }
      
    } catch (error) {
      console.log('TTS setup error:', error);
    }
  };

  // Speak the text
  const speakText = async (text) => {
    try {
       Tts.stop(); // Stop any current speech
       Tts.speak(text); // Speak the text
    } catch (error) {
      console.log('Speech error:', error);
    }
  };

  // Stop speaking
  const stopSpeaking = async () => {
    try {
      await Tts.stop();

    } catch (error) {
      console.log('Stop error:', error);
    }
  };


  const speakupfunc=()=>{
    // Tts.stop()
    // Tts.speak(storyText)
  speakText(storyText)

  }

  //next/prev func
  const nextBtnFunc=(nextprev)=>{
    stopSpeaking()
    if(nextprev === "prev"){
   setStorycount(Storycount - 1)
  }
  else if(nextprev === "next"){
    setStorycount(Storycount + 1)
  }

  //bounce animated

  Animated.sequence([
    Animated.spring(bounceStoryPanelY,{
      toValue:-10,
      bounciness: 10,
        speed: 240,  // Controls how quickly the spring slows down (damping)
      useNativeDriver:true
    }),
    Animated.spring(bounceStoryPanelY,{
      toValue:0,
      bounciness: 10,
        speed: 240,
      useNativeDriver:true
    })
  ]).start()
   
  }

  const storyLength = storyContent?.[0]?.tellstory?.length ?? 0; // current story length (for avoiding undefined responses from the UI)


  return (
    <ImageBackground style={styles.container}
    source={require('../assets/ingamereadingbg.png')} 
    >



     {/* titlebox */}
     
    <View style = {styles.titleStorycon}>
    <Text style = {{fontSize:20,fontWeight:'bold'}}>{storyContent?.[0]?.title ?? 'Default Title'}</Text>
    </View>
       



  
  {readyUpStory ? 
  
  <>

   {/* readyUp panel here */}

   

   <Animated.View style = {[styles.readyupcon,
   {
    transform:[
      {scaleX:readyupX},
      {scaleY:readyupY}
    ]
   }
   ]}> 

   <LottieView
               style={{width:500,height:500,position:'absolute'}}
               source={require('../assets/circlefadeout.json')}
                  autoPlay
                 loop={false}
                  />


   <View style = {styles.readyuptitlecon}>
    <Text style = {{fontSize:20,fontWeight:'bold'}}>Question Time</Text>
   </View>

  <Animated.Image style = {[styles.character,{
     transform:[
              { translateX: charidleX },
              { translateY: charidleY },
                ]
  }]} source={localImageMap[studAssets.characterequipimg]}/>

  <TouchableOpacity onPress={()=>navigation.replace('ingamereadques')} style = {styles.startbutton}><Text style = {{fontSize:20,fontWeight:'bold',color:'yellow'}}>START </Text></TouchableOpacity>

   </Animated.View>


  </>
  
  : 
     <>   
  {/* story panel here */}
    <Animated.View style = {[styles.storycon,
    
    {
      transform:[
        {scaleY:storyconY}
        ]
    }
    ]}>
    {/* image */}
       
    {loadingAssets ? 
    
     <ContentLoader 
    speed={1}
    width={'100%'}
    height={'30%'}
    viewBox="0 0 800 460"
    backgroundColor="#225fa0"
    foregroundColor="#ecebeb"
  >
    <Rect width="100%" height="90%" />
  </ContentLoader>
    
     : <Image style={styles.imagestory}  source={{uri:storyImage}}/>}

     <View style = {{flexDirection:'column',rowGap:20,alignItems:'center',justifyContent:'center'}}>
    <Animated.View style = {[styles.speechbox,
     {
      transform:[
        {translateY:bounceStoryPanelY}
      ]
    }
    ]}>
    <ScrollView>
    {loadingAssets ? <ActivityIndicator size="large" color="#0011ffff" /> : <Text style = {{fontSize:15,fontWeight:500}}>{storyText}</Text>}
    </ScrollView>
    </Animated.View>
    <TouchableOpacity onPress={speakupfunc} style = {styles.speakcon}><Image style = {{width:50,height:50}} source={require('../assets/volumeicon.png')}/></TouchableOpacity>
</View>
    <View style = {styles.charnextcon}>

    {/* <Image style = {styles.character} source={require('../assets/characters/char1.png')}/> */}
    <TouchableOpacity onPress={()=>nextBtnFunc("prev")} disabled={Storycount === 0 ? true : false} style = {Storycount === 0 ? [styles.nextbutton,{backgroundColor:'gray'}] : styles.nextbutton}><Text style = {{fontSize:19,fontWeight:'bold'}}>PREV</Text></TouchableOpacity>
     <TouchableOpacity onPress={()=>nextBtnFunc("next")} style = {styles.nextbutton}><Text style = {{fontSize:19,fontWeight:'bold'}}>{Storycount === storyLength - 1 ? 'FINISH' : 'NEXT'}</Text></TouchableOpacity>
    </View>

    {/* count page */}

    <View style = {styles.countpagecon}>
    <Text style = {{fontSize:15,fontWeight:'bold'}}>Page/s: {Storycount + 1}/{storyLength}</Text>
    <Progress.Bar progress={storyLength > 0 ? (Storycount + 1)/storyLength : 0} width={wp('50%')} height={13} color="lightgreen"/>
    </View>


    <View>

    </View>

    </Animated.View>
    </>
   }

   {/* loading modal */}
          <Modal
          transparent={true}
          visible={isLoading}
          >
   
          <View style = {styles.loadingModal}>
   
          <ActivityIndicator size='large' color='yellow'/>
           <Text style = {{fontSize:25,color:'white'}}>Picking up Fruits...</Text>
          </View>
   
   
   
         </Modal> 
         
    </ImageBackground>
  );


};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({

 container: {
    flex: 1,
    backgroundColor: '#fffce0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding:50,
    rowGap:20
    
  },

  titleStorycon:{
    // width:wp('50%'),
    flexDirection:'row',
    padding:20,
    height:hp('10%'),
    borderWidth:2,
    borderColor:'green',
    borderRadius:20,
    elevation:10,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'lightgreen'
  },
  storycon:{
    width:wp('95%'),
    height:hp('74%'),
    backgroundColor:'rgba(99, 156, 230, 0.5)',
    padding:30,
    alignItems:'center',
    rowGap:5
  },
  imagestory:{
    width:wp('90%'),
    height:hp('20%'),
    borderRadius:20,
    borderColor:'green',
    borderWidth:2
  },
  speechbox:{
    width:wp('80%'),
    height:hp('20%'),
    backgroundColor:'lightblue',
    borderBottomWidth:4,
    elevation:5,
    borderColor:'blue',
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    borderRadius:20
  },
  charnextcon:{
    width:'100%',
    height:'23%',
    // borderWidth:2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    columnGap:20
  },
  character:{
    width:120,
    height:120
  },
  nextbutton:{
    width:150,
    height:40,
    backgroundColor:'#a3e25bff',
    elevation:5,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20

  },
  readyupcon:{
    width:wp('95%'),
    height:hp('70%'),
    // borderWidth:2,
    // backgroundColor:'lightgreen',
    justifyContent:'center',
    alignItems:'center',
    rowGap:50
  },
  readyuptitlecon:{
    width:wp('50%'),
    height:hp('10%'),
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'yellow',
    borderWidth:2,
    borderColor:'blue'
  },
  startbutton:{
      width:190,
    height:60,
    backgroundColor:'#D72DC3',
    borderWidth:2,
    borderBlockColor:'lightgreen',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20
  },
  countpagecon:{
    justifyContent:'center',
    alignItems:'center',
    bottom:18
  },
  leaf:{
    width:80,
    height:80,

  },
   loadingModal:{
      width:wp('100%'),
      height:hp('100%'),
      backgroundColor:'black',
      opacity:0.5,
      justifyContent:'center',
      alignItems:'center'
    },
  // child: { width, justifyContent: 'center' },
  // text: { fontSize: width * 0.5, textAlign: 'center' },


});




export default InGameReading;