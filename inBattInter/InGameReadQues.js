import {AppState,KeyboardAvoidingView,BackHandler,StatusBar,PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { useFocusEffect, useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
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
import LottieView from 'lottie-react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { GoogleGenerativeAI } from "@google/generative-ai";
import LinearGradient from 'react-native-linear-gradient';
const { width,height } = Dimensions.get('window');
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFS from 'react-native-fs';



  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const InGameReadQues=()=>{

   
//AI components
const API_KEY = 'AIzaSyDKGzLk0TbdALjTFl5J8fH-e-cIBgvYwp0'; // Replace with your actual env var setup
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" }); 

const isFocused = useIsFocused() 

   //navigation

    const navigation = useNavigation(); //navigation

    
   //home btn func
  
       useEffect(() => {
  
        const subscription = AppState.addEventListener('change', nextAppState => {

          const autoleaveroomfunc=async()=>{

            if(practiceEnabled === false){
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

           
            Toast.show({
             type:'error',
           text1:'Disconnected',
           text2:'You automatically leave the playroom',
         visibilityTime: 4000,
             })

           exitgameClearFunc()
           setjoinActive(false)
           navigation.replace('joinroom')
          }

          }

          autoleaveroomfunc()

        })
  
         return () => {
        subscription.remove();
      };
       },[])

     ///force back tab
        useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
         
              pauseFunc()
               return true; 
            
              
               
          };
         const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
          return () => backHandler.remove();    
        }, [])
      );

    const {studProfile,setstudProfile}=useContext(MyStorage) //profile info
         const {studAssets,setstudAssets}=useContext(MyStorage)
       //reponse join btn useState toggle
       const {joinActive,setjoinActive}=useContext(MyInGameStor)

   //practiceEnabled?

   const {practiceEnabled,setpracticeEnabled}=useContext(MyInGameStor)

   //get room information

    const {roomInformation,setroomInformation}=useContext(MyInGameStor);
    const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);
    const {analyticsDocid,setanalyticsDocid}=useContext(MyInGameStor);
    const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor);
    const {categoryAvailIndex,setcategoryAvailIndex}=useContext(MyInGameStor);
    const {categoryAvailCurrIndex,setcategoryAvailCurrIndex}=useContext(MyInGameStor);
    const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor);
    const {gameTypeVal,setgameTypeVal}=useContext(MyInGameStor);
   //question values-------------

   const {storyContent,setstoryContent}=useContext(MyInGameStor); //story content
   const {storyQuestion,setstoryQuestion}=useContext(MyInGameStor);
    const {combineStoryContent,setcombineStoryContent}=useContext(MyInGameStor)

   const [maxQuesindex, setmaxQuesindex] = useState(storyQuestion.length);
   const [currQuesindex, setcurrQuesindex] = useState(0);

   //propmt AI values

   const [AILoading,setAILoading]=useState(false)
   const [AIResponse,setAIResponse]=useState("")

   //store the current question

   const [storeQuestion,setstoreQuestion]=useState("")
   const [choices,setchoices]=useState([])
   const [correctAnswer,setcorrectAnswer]=useState("")

   //ref choices and answers to take effect the update
   const choicesRef = useRef([]);
   const correctAnswerRef = useRef('');

   //score count

   const [Score,setScore]=useState(0)
   const [fruitHarvested,setfruitHarvested]=useState(0)

   //animation values--------------------------

   //for help modal values
   const helpModalX = useRef(new Animated.Value(0)).current;
   const helpModalY = useRef(new Animated.Value(0)).current;
   //for pause modal values
   const pauseModalX = useRef(new Animated.Value(0)).current;
   const pauseModalY = useRef(new Animated.Value(0)).current;
   
   //for pan animation fruit value

   const AnsAnim1 = useRef(new Animated.ValueXY()).current;
   const AnsAnim2 = useRef(new Animated.ValueXY()).current;
   const AnsAnim3 = useRef(new Animated.ValueXY()).current;

   //for fruit shake effect value ?

   const AnsShake1 = useRef(new Animated.Value(0)).current;
   const AnsShake2 = useRef(new Animated.Value(0)).current;
   const AnsShake3 = useRef(new Animated.Value(0)).current;

   const TreeShake = useRef(new Animated.Value(0)).current;

    //rote character animation val
   
     const rotateChar=useRef(new Animated.Value(0)).current;
   

   //fruit toggle activate value
   const Ans1canMove = useRef(false)
   const Ans2canMove = useRef(false)
   const Ans3canMove = useRef(false)

   //fruit toggle count display

  const [Ans1Count,setAns1Count]=useState(0)
  const [Ans2Count,setAns2Count]=useState(0)
  const [Ans3Count,setAns3Count]=useState(0)

   //fruit toggle count till break

   const Ans1tillBreak = useRef(0)
   const Ans2tillBreak = useRef(0)
   const Ans3tillBreak = useRef(0)

   //fruit toggle break effect

   const Ans1breakEffect = useRef(null)
   const Ans2breakEffect = useRef(null)
   const Ans3breakEffect = useRef(null)

   //fruit toggle answer panel show/hide break

   const [Ans1ShowPanel,setAns1ShowPanel] = useState(false)
   const [Ans2ShowPanel,setAns2ShowPanel] = useState(false)
   const [Ans3ShowPanel,setAns3ShowPanel] = useState(false)


    //for character idle animation
   
    const charidleX = useRef(new Animated.Value(0)).current;
    const charidleY = useRef(new Animated.Value(0)).current;
   
    //instruction visibility

 const [instructVisible, setinstructVisible] = useState(true);
  const instructRef = useRef(null);



//fruit toggle break effect Image

// const [Ans1breakEffectSrc,setAns1breakEffectSrc]=useState('')

   //answer panel response

   const [playerAnswered,setplayerAnswered]=useState("")

   //modal trigger--------------

   const [helpModal,sethelpModal]=useState(false)
   const [pauseModal,setpauseModal]=useState(false)
   const [resultModal,setresultModal]=useState(false)


   //result Ui response value
   
   const [rankImage,setrankImage]=useState(null);
   const [progressResultColor,setprogressResultColor]=useState('red');
   const [rankText,setrankText]=useState("");
   const [complimentText,setcomplimentText]=useState("")

    const dropZoneY = useRef(hp('84%')).current;
   //  const dropZoneX = useRef(697).current;

   const [isgameActive,setisgameActive]=useState(false)

   //loading state

   const [isLoading,setisLoading]=useState(false)
   //checking reading

   const [checkingReading,setcheckingReading]=useState(false);
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


 //functions------------------

 
   //setting up overall story 
 
   useEffect(()=>{
     
 
  const storyCombined = storyContent
  .map(item => item.speechstory)
  .join(" "); 

   setcombineStoryContent(storyCombined)
 
   },[])

   //toast instruction


  useEffect(()=>{
  
     
         Toast.show({
               visibilityTime: 0, // Keep visible until manually hidden
              autoHide: false, 
                type:'instruction',
                text1:'Readventure',
                text2:'Reading Assessment',
                //for extra props (toast only accepts 2 text)
                 props: {
              text3: 'Tap the fruit 3 times to reveal the answer ',
              text4: 'After tapping, you can drag and drop the fruit below the line', 
              text5: 'Read carefully and make sure you drag the correct answer to earn points', 
              protip1:'Carefully Read the question',
              protip2:'Dont make haste on dragging the answer',
              protip3:'Analyze the question',
               onStart: () => {
                Toast.hide();
                 setisgameActive(true)
              },   
            },

            onHide: () => {
              setisgameActive(true)
            }
            
              },
              
            )
  
      },[])
  

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


 //say the sentence out loud

 useEffect(()=>{

  if(storeQuestion !== "" && isgameActive === true){

    speakText(`${storeQuestion}`)
  // Tts.speak(`${storeQuestion}`)

}
 },[storeQuestion,isgameActive])

 //effect next question

 useEffect(()=>{

   setplayerAnswered("")

    if(currQuesindex === maxQuesindex){
      if(practiceEnabled === true){
        console.log("Practice mode active")
      }
      else{
          ComputationFunc()
          console.log("Record analytics")
      }
     
     setresultModal(true)
      return;
    }

    setcheckingReading(false) //checking finished

    //next question

    setstoreQuestion(storyQuestion[currQuesindex].question)
    setchoices(storyQuestion[currQuesindex].choices)
    setcorrectAnswer(storyQuestion[currQuesindex].correctanswer)

    choicesRef.current = storyQuestion[currQuesindex].choices
    correctAnswerRef.current = storyQuestion[currQuesindex].correctanswer


 },[currQuesindex])

 //check answer

 const checkAnswer=(choicenum)=>{

   if(choicesRef.current[choicenum] === correctAnswerRef.current){
       SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
       setScore((score) => score + 1) //add score
            speakText("Correct")
          setplayerAnswered("correct")

   }
   else{
       SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
        speakText("Wrong")
        setplayerAnswered("wrong")
   }

   //reset shake and move fruit value effect
   Ans1canMove.current = false
   Ans2canMove.current = false
   Ans3canMove.current = false
   Ans1tillBreak.current = 0
   Ans2tillBreak.current = 0
   Ans3tillBreak.current = 0
   setAns1ShowPanel(false)
   setAns2ShowPanel(false)
   setAns3ShowPanel(false)

  

   //next question
   setTimeout(()=>{
        setcurrQuesindex((previndex)=>previndex + 1)
   },4000)
 

 }

   //objectives computation---------------
 useEffect(()=>{
  if(resultModal === true){
 objectiveComputationFunc()
 }
 },[resultModal])
 
 const objectiveComputationFunc=async()=>{
 
   if(practiceEnabled === true){
 
   //get all objectives first
    try{
     const achievementdblist = firestore().collection('student_achievement')
     const getachievements = await achievementdblist
     .where('studentid','==',studProfile.studentID)
     .get()
 
     const searchachievements = getachievements.docs.map(doc=>({
       id:doc.id,
       ...doc.data()
     }))
 
   //get the specific array indexes of curreent objective
     let requiredvalue = 0
     let progression = 0
     let objectiveindex = 0
     let objectivecompletedby = ""
 
   
    for(let i = 0; searchachievements[0].completedby.length > i; i++){
 
     let finished = Boolean(searchachievements[0].isfinished[i])
     let taskmode = searchachievements[0].taskmode[i]
     let gametype = searchachievements[0].gametype[i]
    
 
     if(gametype === "comprehension"  && finished === false && taskmode === "single"){
 
       objectiveindex = i;
       objectivecompletedby = searchachievements[0].completedby[i]
       requiredvalue = searchachievements[0].requiredvalue[i]
       progression = searchachievements[0].progression[i]
       console.log("index" + i)
    
     }
    }
 
 
    let objectivenotmaxed = false
 
    switch(objectivecompletedby){
 
     case "perfectscore":
       console.log("perfectscore")
       if (maxSpellindex === Score) {
        progression++;
       }
       break;
 
     case "correctcount":
       console.log("correctcount")
       progression +=  Score
       break;
 
       case "playtime":
       console.log("playtime")
       progression += 1
       break;
 
       case "fruitharvesting":
       console.log("fruitharvesting")
       progression += fruitHarvested
       break;
 
       default:
        objectivenotmaxed = true
    }

    console.log("FRUIT HARVESTED"+fruitHarvested)
 
   
 
    //update record achevement
    if(objectivenotmaxed === false){
     const studentachievementdblist = firestore().collection('student_achievement')
     const getachievement = await studentachievementdblist
     .where('studentid','==',studProfile.studentID)
     .get()
 
     const searchachievement = getachievement.docs.map(doc=>({
       id:doc.id,
       ...doc.data(),
     }))
     
     let updatedCountData = [...searchachievement[0].progression]
     updatedCountData[objectiveindex] = progression
 
 
    firestore()
       .collection('student_achievement')
       .doc(searchachievement[0].id)
       .update({
         progression:updatedCountData
       })
   }
   else{
     console.log("TASK MAXED OUT")
   }
   }
     catch(error){
       console.log(error)
     }
   }
 }

  //Computation function------------

  const computeAnalytics=async()=>{
  console.log("Compute analysis")

       const joinroomprogdblist = firestore().collection('joinroom-progress');
       const getjoinroomprog = await joinroomprogdblist
        .where('studentid','==',studProfile.studentID)
        .where('joinroom','==',roomInformation.roomcode)
        .limit(1)
        .get()

        const searchjoinroomprog = getjoinroomprog.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
        }))


        //compute percentage
    const grammarscore = searchjoinroomprog[0].scoregrammar
    const grammartotal = searchjoinroomprog[0].maxscoregrammar

    const percentagegrammar = (grammarscore / grammartotal) * 100;

    console.log("percentage grammar"+percentagegrammar)


     const spellingscore = searchjoinroomprog[0].scorespelling
    const spellingtotal = searchjoinroomprog[0].maxscorespelling

    const percentagespelling = (spellingscore / spellingtotal) * 100;

      console.log("percentage spelling"+percentagespelling)

       const comprehensionscore = searchjoinroomprog[0].scorecomprehension
    const comprehensiontotal = searchjoinroomprog[0].maxscorecomprehension

    const percentagecomprehension = (comprehensionscore / comprehensiontotal) * 100;

      console.log("percentage comprehension"+percentagecomprehension)
   
   

    //compute average

    const averagegrade =  Math.round((percentagegrammar + percentagespelling + percentagecomprehension) / 3)
  //
     const analyticsDocRef = firestore().collection('analytics').doc(analyticsDocid);
      const analyticsDocSnapshot = await analyticsDocRef.get();
      const currentPerformance = analyticsDocSnapshot.data().performance || [];
      const updatedPerformance = [...currentPerformance, averagegrade];

               const timestamp = firestore.Timestamp.now();
            const currentDate = analyticsDocSnapshot.data().performancedate || [];
            const updatedDate = [...currentDate,timestamp]

   //update analytics
   try{
   firestore()
   .collection('analytics')
   .doc(analyticsDocid)
   .update({
    assessments:firebase.firestore.FieldValue.increment(1),
    performance:updatedPerformance,
    performancedate:updatedDate
   })
  }
  catch(error){
    console.log(error)
  }

   //clear

  //  clearCompleted()
        
      }



  const checkProgress=async()=>{

        
      const joinroomprogdblist = firestore().collection('joinroom-progress')

          let studentholdid = Number(studProfile.studentID)
          const getjoinroomprog = await joinroomprogdblist
          .where('studentid','==',studProfile.studentID)
          .where('joinroom','==',roomInformation.roomcode)
          .limit(1)
          .get()

           const searchjoinroomprog = getjoinroomprog.docs.map(doc=>(({
              id:doc.id,
            ...doc.data(),
              })))
                  
                  

             console.log("super done")
                 
                try{
              //update isDone to done--------------------------
              await firestore()
              .collection('joinroom-progress')
            .doc(searchjoinroomprog[0].id)
            .update({
                isdone:true,
                isfruitgamecompleted:true,
                issecondgamecompleted:true,  
                isthirdgamecompleted:true,
                joinroom:searchjoinroomprog[0].joinroom,
                studentid:searchjoinroomprog[0].studentid,
                scoregrammar:searchjoinroomprog[0].scoregrammar,
                maxscoregrammar:searchjoinroomprog[0].maxscoregrammar,
                scorespelling:searchjoinroomprog[0].scorespelling,
                maxscorespelling:searchjoinroomprog[0].maxscorespelling,
                scorecomprehension:searchjoinroomprog[0].scorecomprehension,
                maxscorecomprehension:searchjoinroomprog[0].maxscorecomprehension
                   
               })
               }

               catch(error){
                console.log(error)
               }
                    
                    computeAnalytics()

}

  //check if categories are completed. To record overall to analytics
  //       useEffect(() => {
         
  //     if (isFocused && categoryAvailIndex > 0 && categoryAvailCurrIndex === categoryAvailIndex && categoryAvailCurrIndex !== 0 && categoryAvailIndex !==0) {
  //       checkProgress();
  //     }
  //     else{
  //       console.log("Categories not completed")
  //     }
  // }, [categoryAvailCurrIndex]);
  
  //c
   const ComputationFunc=async()=>{

      //record reading analytics

  
       const comprehensionscore = Score
    const comprehensiontotal = maxQuesindex

    const percentagecomprehension = (comprehensionscore / comprehensiontotal) * 100;


     const analyticsDocRef = firestore().collection('analytics').doc(analyticsDocid);
      const analyticsDocSnapshot = await analyticsDocRef.get();
      const currentreadingCom = analyticsDocSnapshot.data().readingassessment || [];
      const updatedreadingCom = [...currentreadingCom, percentagecomprehension];

               const timestamp = firestore.Timestamp.now();
      const currentDate = analyticsDocSnapshot.data().readingdate || [];
      const updatedDate = [...currentDate,timestamp]

    try{
   firestore()
   .collection('analytics')
   .doc(analyticsDocid)
   .update({
    readingassessment:updatedreadingCom,
    readingdate:updatedDate
   })
  }
  catch(error){
    console.log(error)
  }

  //update progress
    const docRef = firestore().collection('joinroom-progress').doc(categoryProgDoc);
    await docRef.update({
     isthirdgamecompleted:true,
     scorecomprehension:Score,
     maxscorecomprehension:maxQuesindex
    })

     //notify the teacher

   firestore()
  .collection('notification').doc()
      .set({
   gradelevel:studProfile.gradelevel,
   notification:`Student ${studProfile.firstname} ${studProfile.lastname} Completed Reading Game at Room ${roomInformation.roomcode}`,
  notifdate:firestore.FieldValue.serverTimestamp(),
   teacherid:roomInformation.teacherid
     })

    const updated = (await docRef.get()).data();

    if(updated.isfruitgamecompleted && updated.issecondgamecompleted && updated.isthirdgamecompleted){
      console.log("completed all games")
       checkProgress();
    }

     //reward
   try{
   firestore()
   .collection('player-assets')
   .doc(playerAssetsDocid)
   .update({
    coins:firebase.firestore.FieldValue.increment(30),
 
   })
  }
  catch(error){
    console.log(error)
  }


   
  
    //  setcategoryAvailCurrIndex(prev => prev + 1)
  
   }


 //for help AI 
 const helpFunc=async()=>{

   //animation

   Animated.parallel([
      Animated.spring(helpModalX,{
         toValue:1,
         duration:300,
         useNativeDriver:true
      }),
       Animated.spring(helpModalY,{
         toValue:1,
         duration:300,
         useNativeDriver:true
      })
   ]).start()

   //execute
    setAILoading(true)

   try{

        const result = await model.generateContent(
         `can you give me a clue from the question ${storeQuestion} connecting from this story: ${combineStoryContent}. Currently these are the answers ${choices}.And this is the correct answer ${correctAnswer}. Dont reveal the correct answer just give a clue. Maake it more child-friendly good for grade 2-4 `
        )
         const responseText = result.response.text();
         setAIResponse(responseText)
         console.log(responseText)

   }

   catch(error){
      console.log(error)
   }
   finally{
      setAILoading(false)
   }

   sethelpModal(true)

 }

 const exitHelpFunc=()=>{

   //animation
      Animated.parallel([
      Animated.spring(helpModalX,{
         toValue:0,
         duration:300,
         useNativeDriver:true
      }),
       Animated.spring(helpModalY,{
         toValue:0,
         duration:300,
         useNativeDriver:true
      })
   ]).start()

   //execute

   sethelpModal(false)
 }

 //for pause panel func

 const pauseFunc=()=>{
      setpauseModal(true)
   //animation

   Animated.parallel([
      Animated.spring(pauseModalX,{
         toValue:1,
         duration:300,
         useNativeDriver:true
      }),
       Animated.spring(pauseModalY,{
         toValue:1,
         duration:300,
         useNativeDriver:true
      })
   ]).start()


 }


 //exit pause
  const exitpauseFunc=()=>{
    setpauseModal(false)
   //animation

   Animated.parallel([
      Animated.spring(pauseModalX,{
         toValue:0,
         duration:300,
         useNativeDriver:true
      }),
       Animated.spring(pauseModalY,{
         toValue:0,
         duration:300,
         useNativeDriver:true
      })
   ]).start()


   
 }

   //reset all upon exiting the game func

    const exitgameClearFunc=()=>{

         setstoryContent([])
    setstoryQuestion([])
    setcombineStoryContent("")
    setpracticeEnabled(false)
    setpauseModal(false)
    setcategoryProgDoc("")
    setanalyticsDocid("")
    setstoreQuestion("")
    setchoices([])
    setcorrectAnswer("")
    setplayerAssetsDocid("")
    setcategoryAvailCurrIndex(0)
    setcategoryAvailIndex(0)
    setinGameDifficulty("")
    setgameTypeVal(0)

    }

  const exitGameFunc=async(response)=>{

    exitgameClearFunc()


       if(response === "mainmenu" && practiceEnabled === true){
      navigation.replace('mainscreen')
     }
     else if(response === "leavelobby" && practiceEnabled === true){
      navigation.replace('practiceroom')
     }
     else if(response === "leavelobby" && practiceEnabled === false){
      navigation.replace('categorieschoose')
     }
      else if(response === "mainmenu" && practiceEnabled === false){

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
      navigation.replace('mainscreen')
      setjoinActive(false)
        setroomInformation({})  
     }
  }

 


 //animation functions****

 useEffect(() => {
    
     if(checkingReading === true){
        rotateChar.setValue(0);
        
         Animated.timing(rotateChar, {
           toValue: 1,
           duration: 800, // 3 seconds for one full rotation
           useNativeDriver: true, // Use native driver for better performance
         }).start();
     }
     
   }, [checkingReading]);
   
   // Interpolate rotation value to degrees
   const rotationChar = rotateChar.interpolate({
     inputRange: [0, 1],
     outputRange: ['0deg', '360deg'],
   });

 //shake func animation

 const shakeFruitFunc=(shakeval)=>{
  Animated.parallel([
        Animated.spring(TreeShake,{
         toValue:5,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      })
      ,
       Animated.spring(TreeShake,{
         toValue:-5,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
       Animated.spring(TreeShake,{
         toValue:0,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      ]).start()
   if(shakeval === 0){
      Animated.parallel([
        Animated.spring(AnsShake1,{
         toValue:10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      })
      ,
       Animated.spring(AnsShake1,{
         toValue:-10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
       Animated.spring(AnsShake1,{
         toValue:0,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      ]).start()
   }

   else if(shakeval === 1){
      Animated.parallel([
        Animated.spring(AnsShake2,{
         toValue:10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      })
      ,
       Animated.spring(AnsShake2,{
         toValue:-10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      Animated.spring(AnsShake2,{
         toValue:0,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      ]).start()
   }

   else if(shakeval === 2){
      Animated.parallel([
        Animated.spring(AnsShake3,{
         toValue:10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      })
      ,
       Animated.spring(AnsShake3,{
         toValue:-10,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      Animated.spring(AnsShake3,{
         toValue:0,
           friction: 2,
         duration:0,
          tension: 2000,
         useNativeDriver:false
      }),
      ]).start()
   }
 }



 //for panFruit ans
 const panAns1 = useRef(

   PanResponder.create({

      //count the tapped fruit before proceeding to drag em in
       onStartShouldSetPanResponder: () => {



         //for breaking count
         if(Ans1tillBreak.current === 2){

           
               Ans1canMove.current = true  
               setAns1ShowPanel(true)
               Ans1tillBreak.current ++   
              SoundPlayer.playAsset(require("../assets/sounds/crackroot.mp3"))
         }
         else if(Ans1tillBreak.current < 2){
         shakeFruitFunc(0)
         Ans1breakEffect.current.reset()
         Ans1breakEffect.current.play()
          SoundPlayer.playAsset(require("../assets/sounds/breakroot.mp3"))
         Ans1tillBreak.current ++  
         
         }
  
        return Ans1canMove.current; 
      },
      onPanResponderMove: Animated.event(
         [null,{dx:AnsAnim1.x, dy:AnsAnim1.y}],
         {useNativeDriver:false}
      ),
      onPanResponderRelease:(_,gesture)=>{


         //check answer
         if(gesture.moveY > dropZoneY -50){
        setcheckingReading(true)
         checkAnswer(0) //check naswer func
         setfruitHarvested(prevCount => prevCount + 1)
         // setcurrQuesindex((previndex)=>previndex + 1)
         }
        

         //bounce back
          Animated.spring(AnsAnim1, {
         toValue: { x: 0, y: 0 },
         useNativeDriver: false,
         }).start();  

      },

   })

 ).current;

  const panAns2 = useRef(

   PanResponder.create({

    //count the tapped fruit before proceeding to drag em in
       onStartShouldSetPanResponder: () => {
         if(Ans2tillBreak.current === 2){
            Ans2canMove.current = true
            setAns2ShowPanel(true)
              Ans2tillBreak.current ++  
             SoundPlayer.playAsset(require("../assets/sounds/crackroot.mp3"))
         }
        else if(Ans2tillBreak.current < 2){
            shakeFruitFunc(1)
            Ans2breakEffect.current.reset()
            Ans2breakEffect.current.play()
            SoundPlayer.playAsset(require("../assets/sounds/breakroot.mp3"))
            Ans2tillBreak.current ++       
         }
  
        return Ans2canMove.current; 
      },
      onPanResponderMove: Animated.event(
         [null,{dx:AnsAnim2.x, dy:AnsAnim2.y}],
         {useNativeDriver:false}
      ),
      onPanResponderRelease:(_,gesture)=>{

          //check answer
         if(gesture.moveY > dropZoneY -50){
        setcheckingReading(true)
         checkAnswer(1) //check naswer func
         setfruitHarvested(prevCount => prevCount + 1)
         // setcurrQuesindex((previndex)=>previndex + 1)
         }

         //bounce back
          Animated.spring(AnsAnim2, {
         toValue: { x: 0, y: 0 },
         useNativeDriver: false,
         }).start();  

      },

   })

 ).current;

  const panAns3 = useRef(

   PanResponder.create({

      //count the tapped fruit before proceeding to drag em in
       onStartShouldSetPanResponder: () => {
         if(Ans3tillBreak.current === 2){
            Ans3canMove.current = true
            setAns3ShowPanel(true)
            Ans3tillBreak.current ++  
             SoundPlayer.playAsset(require("../assets/sounds/crackroot.mp3"))
         }
         else if(Ans3tillBreak.current < 2){
             shakeFruitFunc(2)
            Ans3breakEffect.current.reset()
            Ans3breakEffect.current.play()
            SoundPlayer.playAsset(require("../assets/sounds/breakroot.mp3"))
            Ans3tillBreak.current ++    
         }
  
        return Ans3canMove.current; 
      },
      //drag response
      onPanResponderMove: Animated.event(
         [null,{dx:AnsAnim3.x, dy:AnsAnim3.y}],
         {useNativeDriver:false}
      ),
       //drag release
      onPanResponderRelease:(_,gesture)=>{

          //check answer
         if(gesture.moveY > dropZoneY -50){
        setcheckingReading(true)
         checkAnswer(2) //check naswer func
         setfruitHarvested(prevCount => prevCount + 1)
         // setcurrQuesindex((previndex)=>previndex + 1)
         }

         //bounce back
          Animated.spring(AnsAnim3, {
         toValue: { x: 0, y: 0 },
         useNativeDriver: false,
         }).start();  

      },

   })

 ).current;

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
    //  horizontalAnimation.start();
     createRandomJump();
 
     return () => {
       horizontalAnimation.stop();
       charidleY.stopAnimation();
     };
   }, [charidleX, charidleY]);

    const resetTimer = () => {
    // Clear existing timeout
    if (instructRef.current) {
      clearTimeout(instructRef.current);
    }
    
    // Show the view
    setinstructVisible(true);
    
    // Set new timeout to hide after 3 seconds of inactivity
    instructRef.current = setTimeout(() => {
      setinstructVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Initial timer
    resetTimer();
    
    // Cleanup on unmount
    return () => {
      if (instructRef.current) {
        clearTimeout(instructRef.current);
      }
    };
  }, []);


 //result UI reponse func
 
 useEffect(()=>{

   const resultUifunc=async()=>{

   
 
   if(isFocused && resultModal === true){
 
     const proportion = Score / maxQuesindex
 
     console.log(proportion)
 
     //setting a rank for student
     if(Score === 0){
     setrankImage(require('../assets/drank.png'))
     setprogressResultColor('black')
      setrankText("D")
 
      }
      else if(Score === maxQuesindex){
       setrankImage(require('../assets/sssrank.png'))
       setprogressResultColor('perfect')
       setrankText("SSS")
   
      } 
     else if (proportion >= 0.7) { // 80% to <90%
     setrankImage(require('../assets/arank.png'))// A-Rank
     setprogressResultColor('green')
      setrankText("A")
     
     }
      else if (proportion >= 0.6) { // 60% to <80%
     setrankImage(require('../assets/brank.png')) // B-Rank
     setprogressResultColor('yellow')
      setrankText("B")
      
     } 
     else if (proportion <= 0.4) { // 40% to <60%
    setrankImage(require('../assets/crank.png')) // C-Rank
    setprogressResultColor('red')
     setrankText("C")
    
     }

     //ai compliment

     try{

        const result = await model.generateContent(
         `can you make a short compliment to student from getting this score : ${Score}/${maxQuesindex}. Make it child friendly as possible good for grade 2-4 students. If possible Only one sentence, dont make it too obvious that you're an AI. Straight to the point`
        )
         const responseText = result.response.text();
        setcomplimentText(responseText)


   }

   catch(error){
       setcomplimentText("great job")
   }

 }
 
   }

  resultUifunc()

 },[resultModal])

 //leave game func
const leaveGame=async(leavegame)=>{

  if(leavegame === "leave" && practiceEnabled === false){
  
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
    clearCompleted()
    setroomInformation({})  
    navigation.replace('mainscreen')
    return;
  }


  //if player chooses dont leave
  if(practiceEnabled === false){

    clearCompleted()
     navigation.replace('categorieschoose')
     
    }
    else if(practiceEnabled === true){
   
    clearCompleted()
    navigation.replace('practiceroom')
    
   
    }
    setresultModal(false)
 setpracticeEnabled(false)
  setmaxQuesindex(0)
  setcurrQuesindex(0)
}
 

 

  //reset all values after result func

   const clearCompleted=()=>{

      // setresultModal(false)
     setstoryContent([])
     setstoryQuestion([])
     setcombineStoryContent("")
     setpracticeEnabled(false)
     setpauseModal(false)
     setcategoryProgDoc("")
     setanalyticsDocid("")
     setstoreQuestion("")
     setchoices([])
     setcorrectAnswer("")
     setplayerAssetsDocid("")
    setcategoryAvailCurrIndex(0)
    setcategoryAvailIndex(0)
    setinGameDifficulty("")
    setgameTypeVal(0)
     

      
   }

    return(

        <>
        
        <ImageBackground source={require('../assets/dashboardmainpage.png')} style = {styles.container}>

        

           {/* container of tree ------ */}
           <View style = {styles.fruitcon}> 


          {/* information-----------*/}
         <View style = {styles.informationcon}>

        {/* menu */}
         <View style = {styles.menucon}>

         <View style = {styles.storytitle}><Text style = {{fontSize:20,fontWeight:'bold'}}>Points : {Score}/{maxQuesindex}</Text></View>

        <Pressable onPress={pauseFunc}><Image source={require('../assets/pausebutton.png')} style = {styles.pausebtn}></Image> </Pressable>

         </View>

      {/* question */}

      {playerAnswered === "" ? 
      <>
       {/* <View style = {styles.questioncon}>
         <Text>{storeQuestion}</Text>
      </View> */}

            <LinearGradient
          colors={['#bbff01ff', '#ffa702ff', '#88ff00ff']}
          style={styles.questioncon}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         >  <Text style = {styles.questiontext}>{storeQuestion}</Text></LinearGradient>
   </>
      :
      <>

        <LinearGradient
        colors={playerAnswered === "correct" ? ['#57b72c', '#7cf782', '#57b72c']: ['#f33100ff', '#f15517ff', '#e6360aff'] } // Required: Array of color strings
        style={styles.playeransweredcon}             // Required: Styles for the gradient container
        start={{ x: 0, y: 0 }}                    // Optional: Start point of the gradient (top-left)
        end={{ x: 1, y: 1 }}                      // Optional: End point of the gradient (bottom-right)
      >
      {playerAnswered === "correct" ? 
        <LottieView
                   style={{width:500,height:500,position:'absolute'}}
                          source={require('../assets/confetti.json')}
                         autoPlay
                         loop={false}
                        />

         :

           <LottieView
                   style={{width:500,height:500,position:'absolute'}}
                          source={require('../assets/sadConfetti.json')}
                         autoPlay
                         loop={false}
                        />

      }
     
        <Text style = {[{fontSize:27,fontWeight:'bold'},playerAnswered === "correct" ? {color:'#D72DC3'} : {color:'white'}]}>{playerAnswered}</Text>
        <Text style = {[{fontSize:17,fontWeight:'bold'},playerAnswered === "correct" ? {color:'#D72DC3'} : {color:'white'}]}>Correct answer: {correctAnswerRef.current} </Text>
      </LinearGradient>
   
      </>
      }
     

     

         </View> 

         {/* actual tree */}

            <AnimatedImageBackground source={require('../assets/treeleaves.png')} style = {[styles.leaves,{
               transform: [
               {translateX: TreeShake}
               ]
            }]}>

           {/* fruit 1 */}
           <Animated.View
           style = {[styles.fruit,AnsAnim1.getLayout(),
              { transform: [
               { translateY: 110 },
               {translateX: AnsShake1}
               ]}
            ]}
            {...panAns1.panHandlers}
             pointerEvents={playerAnswered ? 'none' : 'auto'}
           >
           
         
            <LottieView
                   ref = {Ans1breakEffect}
                   style={{width:150,height:150,position:'absolute'}}
                          source={require('../assets/leavesfalling.json')}
                         loop={false}
                        />

          
            <Image source={require('../assets/Apple.png')} style = {styles.fruitpic}/>
             
             {!Ans1ShowPanel ? 
             
             <LinearGradient
          colors={['#f2f6ffff', '#23f0abff', '#f2f6ffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>Tap to Harvest</Text></LinearGradient>

         : 
         

          <LinearGradient
          colors={['#2583ffff', '#7cf782', '#02afffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>{choices[0]}</Text></LinearGradient>
         
         } 
           </Animated.View>
           
 
            {/* fruit 2 */}  
           <Animated.View
           style = {[styles.fruit,AnsAnim2.getLayout(),
              { transform: [
               { translateY: 60 },
               {translateX: AnsShake2}
              ] }
            ]}
            {...panAns2.panHandlers}
             pointerEvents={playerAnswered ? 'none' : 'auto'}
           >
           <LottieView
                   ref = {Ans2breakEffect}
                   style={{width:150,height:150,position:'absolute'}}
                          source={require('../assets/leavesfalling.json')}
                         loop={false}
                        />
            <Image source={require('../assets/Mango.png')} style = {styles.fruitpic}/>
                {!Ans2ShowPanel ? 
             
             <LinearGradient
          colors={['#f2f6ffff', '#23f0abff', '#f2f6ffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>Tap to Harvest</Text>
         </LinearGradient>

         : 
         

          <LinearGradient
          colors={['#2583ffff', '#7cf782', '#02afffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>{choices[1]}</Text></LinearGradient>
         
         } 
           </Animated.View>
           


               {/* fruit 3 */}
           <Animated.View
           style = {[styles.fruit,AnsAnim3.getLayout(),
              { transform: [
               { translateY: 140 },
                   {translateX: AnsShake3}
               ] }
            ]}
            {...panAns3.panHandlers}
              pointerEvents={playerAnswered ? 'none' : 'auto'}
           >
           <LottieView
                   ref = {Ans3breakEffect}
                   style={{width:150,height:150,position:'absolute'}}
                          source={require('../assets/leavesfalling.json')}
                         loop={false}
                        />
            <Image source={require('../assets/Orange.png')} style = {styles.fruitpic}/>
                {!Ans3ShowPanel ? 
             
             <LinearGradient
          colors={['#f2f6ffff', '#23f0abff', '#f2f6ffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>Tap to Harvest</Text></LinearGradient>

         : 
         

          <LinearGradient
          colors={['#2583ffff', '#7cf782', '#02afffff']}
          style={styles.answerpanel}            
          start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}                     
         ><Text style = {styles.choicetext}>{choices[2]}</Text></LinearGradient>
         
         } 
           </Animated.View>
            
            </AnimatedImageBackground>

            <Image source={require('../assets/treestem.png')} style = {styles.stem}></Image>

           </View>
        
        {/* essential living and non-living object con */}
        <Pressable onPress={resetTimer} style = {styles.essentiallivingcon}>
        {instructVisible ? 
        <View style = {{width:wp('69%'),height:hp('4%'),backgroundColor:'lightgreen',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'green',borderRadius:20}}>
        <Text style = {{fontSize:15,color:'indigo'}}>Tap 3 times and Drag your fruit here</Text>
        </View>
        :
          <View style = {{width:wp('69%'),height:hp('4%'),alignItems:'center',justifyContent:'center'}}>
        </View>
          }
        <View style = {{justiFyContent:'center',flexDirection:'row',columnGap:190,top:19}}>

            <Animated.Image source={localImageMap[studAssets.characterequipimg]} style = {[styles.npcchar,{
               transform:[
          
              { translateY: charidleY },
              {rotate:rotationChar}
                ]
            }]}/>

              <Animated.Image source={require('../assets/characters/char2.png')} style = {[styles.npcchar,{
                 transform:[
           
              { translateY: charidleY },
                ]
              }]}/>
             </View>

        </Pressable>
     

     {/* ground */}
      <ImageBackground source={require('../assets/soilground.png')} style = {styles.groundcon}>
               <TouchableOpacity disabled={!AILoading ? false : true} onPress={helpFunc} style = {styles.helpbtn}> {!AILoading ? <><Text> Ms. Trixie - Ask for help</Text> </>: <><Text> Thinking</Text></> }</TouchableOpacity>
      </ImageBackground>


 {/* modal help to AI------------*/}

 
 <Modal
  transparent
animationType="fade"
visible={helpModal}
 >

 <View style = {styles.overlayContainer}>

 <Animated.View style = {[styles.topmodalhelp,{
   transform:[
      {scaleX:helpModalX},
      {scaleY:helpModalY},
   ]
 }]}>

 <View style = {styles.trixiecon}>

<Image source={require('../assets/ms.trixie.png')} style = {styles.trixieprofile}/>
 <View style = {styles.titletrixie}><Text style = {{fontSize:18,fontWeight:'bold'}}>Help with Ms. Trixie</Text></View>
 </View>

{/* prompt table */}
 <View style = {styles.prompttablecon}>
 
 <ScrollView>
 <Text style = {{fontSize:17,fontWeight:'700'}}>{AIResponse}</Text>
 </ScrollView>

 </View>

 <TouchableOpacity onPress={exitHelpFunc} style = {styles.getitbtn}>
   <Text>I GET IT NOW!!</Text>
 </TouchableOpacity>

 </Animated.View>

 

 </View>

 </Modal>

 

 
 

 {/* pause panel modal */}

 <Modal
  transparent
animationType="fade"
visible={pauseModal}
 >

 <View style = {styles.overlayContainer}>

 <AnimatedImageBackground source={require('../assets/pausepanel.png')} style = {styles.pausecon}>

 
  <View style = {{ bottom:55,padding:11,backgroundColor:'lightgreen',borderRadius:20}}>
  <Text style = {styles.pausepaneltxt}>P A U S E</Text>
  </View>

<TouchableOpacity onPress={exitpauseFunc} style = {styles.pausesetbtn}><Text style = {styles.pausetxt}>CONTINUE</Text></TouchableOpacity>
 <TouchableOpacity onPress={()=>exitGameFunc("leavelobby")} style = {styles.pausesetbtn}><Text style = {styles.pausetxt}>RETURN TO LOBBY</Text></TouchableOpacity>
 <TouchableOpacity onPress={()=>exitGameFunc("mainmenu")} style = {styles.pausesetbtn}><Text style = {styles.pausetxt}>GO BACK TO MAIN MENU</Text></TouchableOpacity>
 

 </AnimatedImageBackground>

 </View>


 </Modal>

 {/* result modal */}

 <Modal
  transparent
animationType="fade"
visible={resultModal}

 >

 
 <View  style = {styles.overlayContainer}>

  <ImageBackground 
  source={require('../assets/resultbg.png')}
  style = {styles.resultcon}
  resizeMode="cover"
  >

    <View style = {styles.modaltxtresultcon}>
      <Text style = {{fontSize:40,fontWeight:'bold',color:'white'}}>R E S U L T</Text>
      </View>

  <View style = {{justifyContent:'center',alignItems:'center',rowGap:20}}>
            
            <View style = {styles.scoredescon}>
            <Text style = {{fontSize:20,fontWeight:'bold'}}>  Score:{Score}/{maxQuesindex}</Text>
            </View>

             <View style = {styles.scoredescon}>
            <Text style = {{fontSize:20,fontWeight:'bold'}}> Accuracy: {((Score / maxQuesindex) * 100).toFixed(0)}%</Text>
            </View>

            <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           {progressResultColor !== "perfect" ? <Progress.Bar progress={maxQuesindex > 0 ? Score/maxQuesindex : 0} width={wp('50%')} height={40} color={progressResultColor}/> : <Text>PERFECTTTT!!</Text>}
            </View>
  
             </View>

             <LottieView
             style={{width:500,height:500,position:'absolute'}}
            source={require('../assets/confetti.json')}
            autoPlay
            loop={false}
             /> 

       <View style = {styles.resultcomplimentcon}>
      
          <Text style = {{fontSize:20,color:'white',fontWeight:'bold'}}>{complimentText}</Text>
         </View>
      
          <View style = {{flexDirection:'row',columnGap:30}}>
      
             {practiceEnabled === false ?
                <TouchableOpacity
                  style={styles.button}
                 onPress={()=>leaveGame("dontleave")}
                    >
                <Text style={styles.buttonText}>Return to Lobby</Text>
                 </TouchableOpacity>
              : ''}
      
                
      
              <TouchableOpacity
                 style={styles.button}
                 onPress={()=>leaveGame("leave")}
                 >
               <Text style={styles.buttonText}>Leave Room</Text>
              </TouchableOpacity>
            </View>


  </ImageBackground>


 </View>



 </Modal>


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

 

        </>
    );
};

// --- Styles ---



const styles = StyleSheet.create({

  
 container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
    alignItems: 'center',
  
     },

     groundcon:{
        width:wp('100%'),
        height:hp('10%'),
        justifyContent:'center',
        alignItems:'center',
      //   backgroundColor:'lightgreen'
     },
     basket:{
        width:'100%',
        height:80,
        // borderWidth:2,
        top:20,
        alignItems:'center',
        justifyContent:'center',
      //   position:'absolute'
     },
     fruitcon:{
        width:wp('100%'),
        // height:hp('70%'),
        // borderWidth:2,
        position:'absolute',
        alignItems:'center'
        // bottom: hp('20%'),
     },
     leaves:{
        width:wp('100%'),
        height:hp('30%'),
      //   borderWidth:2,
        justifyContent:'center',
        flexDirection:'row',
        columnGap:30,
        alignItems:'',
        borderColor:'green'
     },
     stem:{
        width:wp('30%'),
        height:hp('40%'),
      //   borderWidth:3,
        borderColor:'brown'
     },
     informationcon:{
        width:wp('100%'),
        height:hp('29.5%'),
      //   backgroundColor:'lightblue',
      //   borderWidth:2,
        justifyContent:'flex-start',
        alignItems:'center',
        rowGap:20
        // position:'absolute'
     },
     essentiallivingcon:{
      //   flexDirection:'row',
        borderTopWidth:3,
        borderStyle:'dashed',
        borderColor:'brown',
        width:wp('100%'),
        justifyContent:'center',
        alignItems:'center',
        columnGap:130,
        
    
        // height:hp('30%'),
      
     },
     menucon:{
        width:wp('100%'),
        height:hp('8%'),
      //   borderWidth:4,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        columnGap:30
     },
     questioncon:{
        width:wp('90%'),
        height:hp('15%'),
        borderRadius:10,
        borderWidth:2,
        borderColor:'white',
      //   backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center'
     },
     questiontext:{
      fontSize:16,
      color:'purple',
      fontWeight:600
     },
     playeransweredcon:{

      width:wp('90%'),
      // height:hp('6%'),
      padding:10,
      top:40,
      borderRadius:20,
      borderColor:'white',
      borderWidth:2,
      backgroundColor:'green',
      justifyContent:'center',
      alignItems:'center'

     },
     storytitle:{
        width:250,
        height:50,
        borderRadius:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ecfb66',
        borderWidth:3,
        borderColor:'#D72DC3'
     },
     pausebtn:{
        width:80,
        height:80,
      //   backgroundColor:'blue'
     },
     helpbtn:{
      width:wp('50%'),
      height:hp('4%'),
      justifyContent:'center',
      alignItems:'center',
      borderWidth:2,
      borderColor:'green',
      backgroundColor:'yellow'
     },
      overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // background dim
    justifyContent:'center',
    alignItems:'center',
   
  },
  topmodalhelp:{
   height:hp('70%'),
    width:wp('80%'),
    position: 'absolute',
    backgroundColor: 'lightgreen',
    borderWidth:3,
    borderColor:'green',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    rowGap:30,
      justifyContent:'center',
    alignItems:'center',
  },
  trixiecon:{
   width:'100%',
   flexDirection:'row',
   alignItems:'center',
   justifyContent:'center',
   columnGap:10
  },
  trixieprofile:{
   width:50,
   height:50,
   backgroundColor:'blue'
  },
  titletrixie:{
   width:170,
   height:50,
   borderRadius:30,
   alignItems:'center',
   justifyContent:'center',
   backgroundColor:'lightblue',
   borderColor:'blue',
   borderWidth:2
  },
  prompttablecon:{
   width:'95%',
   height:300,
   padding:20,
   alignItems:'center',
   backgroundColor:'yellow',
   borderColor:'blue',
   borderWidth:2
  },
  getitbtn:{
   width:'50%',
   height:'10%',
   backgroundColor:'pink',
   borderWidth:2,
   borderColor:'green',
   justifyContent:'center',
   alignItems:'center',
   borderRadius:20
  },
  npcchar:{
   width:60,
   height:80,
   position:'relative'
   // borderWidth:2
  },
   pausecon:{
   width:wp('70%'),
   // height:hp('30%'),
   padding:30,
   borderRadius:20,
   justifyContent:'center',
   alignItems:'center',
   backgroundColor:'white',
   rowGap:30,
  },
    pausesetbtn:{
    width:180,
   height:50,
   justifyContent:'center',
   alignItems:'center',
   borderRadius:20,
   elevation:5,
   borderWidth:2,
   borderColor:'green',
   backgroundColor:'lightgreen'
  },
  fruit:{
   width:90,
   height:90,
   // borderWidth:2,
   justifyContent:'center',
   alignItems:'center'

  },
  fruitpic:{
   width:80,
   height:80,
   // position:'absolute',
   // bottom:30
  },
  answerpanel:{
   height:'auto',
   width:120,
   borderRadius:20,
   padding:3,
   borderColor:'white',
   justifyContent:'center',
   alignItems:'center',
   // backgroundColor:'blue'
  },
  resultcon:{
      width:wp('90%'),
      height:hp('70%'),
      // left:wp('5%'),
      // top:hp('8%'),
      // borderWidth:3,
      rowGap:30,
      borderColor:'blue',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor:'lightgreen'

  },
  choicetext:{
   color:'blue',
   fontWeight:'bold',
   fontSize:15
  },
  modaltxtresultcon:{
  
    padding:10,
    height:hp('10%'),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    backgroundColor:'blue',
    bottom:40
  },
   rankdisplaycon:{

  width:wp('50%'),
  height:hp('7%'),
  justifyContent:'center',
  alignItems:'center',
  borderRadius:20,
  borderColor:'blue',
  borderWidth:2,
  backgroundColor:'yellow'

  },
  resultcomplimentcon:{
    width:wp('80%'),
    height:hp('19%'),
    borderWidth:3,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    backgroundColor:'green',
    borderColor:'white'
  },
   button: {
    backgroundColor: '#0ae94dff',
    padding: 10,
    borderRadius: 20,
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    width:wp('30%'),
    height:hp('6%'),
    elevation:5,
    borderColor:'green'
  },
  pausepaneltxt:{
    // bottom:55,
     color:'blue',
    fontSize:40,
    fontWeight:'bold'
  },
    pausetxt:{
      fontWeight:'bold'
    },

    scoredescon:{
      width:wp('50%'),
      padding:10,
      backgroundColor:'#edf855ff',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:20,
      borderWidth:2,
      borderColor:'green'
    },
     loadingModal:{
      width:wp('100%'),
      height:hp('100%'),
      backgroundColor:'black',
      opacity:0.5,
      justifyContent:'center',
      alignItems:'center'
    },
})

export default InGameReadQues;