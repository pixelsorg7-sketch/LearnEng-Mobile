import React, {useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import {AppState,BackHandler,PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import {useFocusEffect , useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
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
const { width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
// const [colorChoice,setcolorChoice] = useState('#ffe4b8')

const InGameGrammarDrag = () => {

  
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const {studProfile,setstudProfile}=useContext(MyStorage) //profile info
  const {studAssets,setstudAssets}=useContext(MyStorage)

  const isFocused = useIsFocused() //focused state
      const navigation = useNavigation();


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

                 clearCompleted()
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
           
              setpauseModal(true)
               return true
              
                
                 
            };
           const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove();    
          }, [])
        );

      // to run the gameplay
 const [isgameActive,setisgameActive]=useState(false)

    //reponse join btn useState toggle
    const {joinActive,setjoinActive}=useContext(MyInGameStor)

  const [colorChoice1,setcolorChoice1] = useState('#916c32ff')
  const [colorChoice2,setcolorChoice2] = useState('#ffe4b8')
  const [colorChoice3,setcolorChoice3] = useState('#ffe4b8')

  //resources coming from firebase
  const [sampQuesfirst,setsampQuesfirst]=useState(["Mark","Im going"])
  const [sampQuessecond,setsampQuessecond]=useState(["good","the mall"])
  const [sampChoices,setsampChoices]=useState([])
  const [sampcorrectAns,setsampcorrectAns]=useState(["is","to"])

  //store the current question
  const [firsthalfQues, setfirsthalfQues] = useState("");
  const [secondhalfQues, setsecondhalfQues] = useState("");
  const [choices, setchoices] = useState([]);
  const [correctAnswer, setcorrectAnswer] = useState("");

    // ref value for Animated answers to take effect the update
  const choicesRef = useRef([]);
  const correctAnswerRef = useRef('');

  //npc dialogue

  const [npcDialogue,setnpcDialogue]=useState(`hey ${studProfile.username} can you sort these fruits. You might figured out the fresh one there`)

  //max num of questions and current question count
  const [maxQuesindex, setmaxQuesindex] = useState(sampQuesfirst.length);
  const [currQuesindex, setcurrQuesindex] = useState(0);

  // Drop word state 
  const [droppedWord, setDroppedWord] = useState('');
  const [isDropped, setIsDropped] = useState(false);

  const dropZoneY = useRef(200).current;  //hitbox vlue

  const [bufferDelay,setbufferDelay]=useState(0) //buffer delay count
  const isAnswerFreeze = useRef(true)

 
  const [showResultModal, setShowResultModal] = useState(false); // Result Modal visibility
  const [score, setScore] = useState(0); // User's score
  const [fruitHarvested,setfruitHarvested]=useState(0)

  //game id value 
  const {gameTypeVal,setgameTypeVal}=useContext(MyInGameStor)

  const [dataReady, setDataReady] = useState(false);


  //room infromation
  const {practiceEnabled,setpracticeEnabled}=useContext(MyInGameStor)    //practice enabled
const {roomInformation,setroomInformation}=useContext(MyInGameStor);
 const {analyticsDocid,setanalyticsDocid}=useContext(MyInGameStor);
 const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);
const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor)
const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor)
 //modal trigger

  const [pauseModal,setpauseModal]=useState(false)

 const [checkingGrammar,setcheckingGrammar]=useState(false) //check the answer

 //result Ui response value
 
 const [rankImage,setrankImage]=useState(null);
 const [progressResultColor,setprogressResultColor]=useState('red');
 const [rankText,setrankText]=useState("");
 const [complimentText,setcomplimentText]=useState("")

       //for pause modal values
     const pauseModalX = useRef(new Animated.Value(0)).current;
     const pauseModalY = useRef(new Animated.Value(0)).current;

     //loading state

     const [isLoading,setisLoading]=useState(false)

  //get data from the firebase


  useEffect(()=>{

    const grammarfunc=async()=>{

      setisLoading(true)
       if(practiceEnabled === false){

      const grammardblist = firestore().collection('grammar')
      const grammarget = await grammardblist
      .where('secondgameval','==',gameTypeVal)
        .where('difficulty','==',inGameDifficulty)
      .get();

      const searchgrammar = grammarget.docs.map(doc=> ({
        id:doc.id,
        ...doc.data()
      }))

const allChoices = searchgrammar.map(item => item.choices);
const allFirst = searchgrammar.map(item => item.quesfirst);
const allSecond = searchgrammar.map(item => item.quessecond);
const allAnswers = searchgrammar.map(item => item.correctanswer);

// Set states

setsampChoices(allChoices);
setsampQuesfirst(allFirst);
setsampQuessecond(allSecond);
setsampcorrectAns(allAnswers);

setmaxQuesindex(allChoices.length);

setDataReady(true);

    }

    else{

   const grammardblist = firestore().collection('practice-grammar')
      const grammarget = await grammardblist
      .where('difficulty','==',inGameDifficulty)
      .get();

      let searchgrammar = grammarget.docs.map(doc=> ({
        id:doc.id,
        ...doc.data()
      }))

  searchgrammar = searchgrammar.sort(() => 0.5 - Math.random());
  // Set all static values
  const allChoices = searchgrammar.map(item => item.choices);
  const allFirst = searchgrammar.map(item => item.quesfirst);
  const allSecond = searchgrammar.map(item => item.quessecond);
  const allAnswers = searchgrammar.map(item => item.correctanswer);

  setsampChoices(allChoices);
  setsampQuesfirst(allFirst);
  setsampQuessecond(allSecond);
  setsampcorrectAns(allAnswers);
  setmaxQuesindex(allChoices.length);
  
  setDataReady(true);
    }
     setisLoading(false)
    }

    grammarfunc()

  },[])

  
  //indexplayer's progress count
  
     const {categoryAvailIndex,setcategoryAvailIndex}=useContext(MyInGameStor);
     const {categoryAvailCurrIndex,setcategoryAvailCurrIndex}=useContext(MyInGameStor);

     



    
  const clearCompleted=()=>{
              setcategoryAvailIndex(0)
              setcategoryAvailCurrIndex(0) 
              setcategoryProgDoc("")
              setanalyticsDocid("")
              setplayerAssetsDocid("")
              setinGameDifficulty("")
              setsampQuesfirst([])
            setsampQuessecond([])
             setsampChoices([])
            setsampcorrectAns([])
            setfirsthalfQues("")
            setsecondhalfQues("")
           
                
  }

  //objectives computation---------------
useEffect(()=>{
 if(showResultModal === true){
objectiveComputationFunc()
}
},[showResultModal])

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
   

    if(gametype === "grammar"  && finished === false && taskmode === "single"){

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
      if (maxSpellindex === score) {
    console.log(`Max score (${maxSpellindex}) matched with current score (${score}). Incrementing progression.`);
       progression++;
      }
      break;

    case "correctcount":
      console.log("correctcount")
      progression +=  score
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
  
 //Computation function

//  const [computeStatistics,setcomputeStatistics]=useState(false)

 //compute overall and analyasis if completed all categories
//  useEffect(()=>{
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



//  },[categoryAvailCurrIndex])

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

   clearCompleted()
        
      }

     //check if categories are completed. To record overall to analytics



//compute overall progress

 const ComputationFunc=async()=>{

  //record grammar analytics

  
       const grammarscore = score
    const grammartotal = maxQuesindex

    const percentagegrammar = (grammarscore / grammartotal) * 100;


     const analyticsDocRef = firestore().collection('analytics').doc(analyticsDocid);
      const analyticsDocSnapshot = await analyticsDocRef.get();
      const currentgrammarCom = analyticsDocSnapshot.data().grammarassessment || [];
      const updatedgrammarCom = [...currentgrammarCom, percentagegrammar];

      const timestamp = firestore.Timestamp.now();
      const currentDate = analyticsDocSnapshot.data().grammardate || [];
      const updatedDate = [...currentDate,timestamp]
    try{
   firestore()
   .collection('analytics')
   .doc(analyticsDocid)
   .update({
    grammarassessment:updatedgrammarCom,
    grammardate:updatedDate
   })
  }
  catch(error){
    console.log(error)
  }


  
  const docRef = firestore().collection('joinroom-progress').doc(categoryProgDoc);

// Get current values
const snapshot = await docRef.get();
const data = snapshot.data() || {};

// Update only the one that was just completed
await docRef.update({
  grammarprogeasy: data.grammarprogeasy || inGameDifficulty === 'easy',
  grammarprogmedium: data.grammarprogmedium || inGameDifficulty === 'medium',
  grammarproghard: data.grammarproghard || inGameDifficulty === 'hard',
  scoregrammar:firebase.firestore.FieldValue.increment(score),
  maxscoregrammar:firebase.firestore.FieldValue.increment(maxQuesindex)
});

const updated = (await docRef.get()).data();

if (updated.grammarprogeasy && updated.grammarprogmedium && updated.grammarproghard) {
  console.log("✅ difficulty completed");



    //notify the teacher

   firestore()
  .collection('notification').doc()
      .set({
   gradelevel:studProfile.gradelevel,
   notification:`Student ${studProfile.firstname} ${studProfile.lastname} Completed Grammar Game at Room ${roomInformation.roomcode}`,
  notifdate:firestore.FieldValue.serverTimestamp(),
  teacherid:roomInformation.teacherid
     })

  //notify that the student got a perfect score on grammar

  if(updated.scoregrammar === updated.maxscoregrammar){
     firestore()
  .collection('notification').doc()
      .set({
   gradelevel:studProfile.gradelevel,
   notification:`Student ${studProfile.firstname} ${studProfile.lastname} Got a perfect Score on Grammar Game at Room ${roomInformation.roomcode}`,
  notifdate:firestore.FieldValue.serverTimestamp(),
  teacherid:roomInformation.teacherid
     })
  }

  //  const docRef = firestore().collection('joinroom-progress').doc(categoryProgDoc);
   await docRef.update({
   issecondgamecompleted:true,
  //  scoregrammar:score,
  //  maxscoregrammar:maxQuesindex
  })

  
  const updated2 = (await docRef.get()).data();

  
  if(updated2.isfruitgamecompleted && updated2.issecondgamecompleted && updated2.isthirdgamecompleted){
      console.log("completed all games")
       checkProgress();
  }

  
  

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
  

 }

 //give reward coin func

 const RewardFunc=()=>{

  let conditionReward = 0

   const proportion = score / maxQuesindex

    //setting a reward
    if(score === 0){
      conditionReward = 20
     }
     else if(score === maxQuesindex){
       conditionReward = 120
     } 
    else if (proportion >= 0.7) { // 80% to <90%
   conditionReward = 90
    }
     else if (proportion >= 0.6) { // 60% to <80%
  conditionReward = 60
    } 
    else if (proportion <= 0.4) { // 40% to <60%
   conditionReward = 30
    }

//save it
   try{
   firestore()
   .collection('player-assets')
   .doc(playerAssetsDocid)
   .update({
    coins:firebase.firestore.FieldValue.increment(conditionReward),
 
   })
  }
  catch(error){
    console.log(error)
  }


 }

   //instruction toast useEffect

   useEffect(()=>{
    
       
           Toast.show({
                 visibilityTime: 0, // Keep visible until manually hidden
                autoHide: false, 
                  type:'instruction',
                  text1:'Word Match',
                  text2:'Grammar Assessment',
                  //for extra props (toast only accepts 2 text)
                   props: {
                text3: 'Drag and drop the fruit from the basket ',
                text4: 'Identify each fruit answer from the question before dragging it in ', 
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
                }
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

 

 //say the sentence out loud

 useEffect(()=>{

  if(firsthalfQues !== "" && isgameActive && showResultModal === false){
  
  setcheckingGrammar(false)
  Tts.speak(`${firsthalfQues} blank ${secondhalfQues}. What is the correct answer`)

}
 },[firsthalfQues,secondhalfQues,isgameActive,showResultModal])

 //

 //image topviewed box image change

 const [imageTopviewedBox,setimageTopviewedBox]=useState(null)

 useEffect(()=>{

  if(bufferDelay === 0){
  setimageTopviewedBox(require('../assets/topviewedbox.png'))
}
else{
  setimageTopviewedBox(require('../assets/topviewedboxwithfruit.png'))
}

 },[bufferDelay])


//effect next question
useEffect(()=>{

      if (!dataReady ){ return;} //if firebase hasnt setup all the data yet. Return blank then wait data
    
  setTimeout(()=>{

    if(currQuesindex === maxQuesindex){
      if(practiceEnabled === false){
      ComputationFunc()
     }
     else{
      console.log("Cant record in practice mode for now")
      // RewardFunc()
       clearCompleted()
     }
      setShowResultModal(true)
      // setpracticeEnabled(false)
      return
    }

    isAnswerFreeze.current = true //unfreeze choices movement
    
    //next question.........
    //back to default color answer
    setcolorChoice1("#f598edff")
    setcolorChoice2("#f598edff")
    setcolorChoice3("#f598edff")

  setbufferDelay(0)
  setDroppedWord("");
  setIsDropped(false);

  setfirsthalfQues(sampQuesfirst[currQuesindex]);
  setsecondhalfQues(sampQuessecond[currQuesindex]);
  setchoices(sampChoices[currQuesindex]);
  setcorrectAnswer(sampcorrectAns[currQuesindex]); // This updates the correct answer

  choicesRef.current = sampChoices[currQuesindex]
  correctAnswerRef.current = sampcorrectAns[currQuesindex]

  //change random dialogue
  if(currQuesindex > 0){
      dialogueFunc("comment")
  }

},bufferDelay)

}, [currQuesindex,dataReady]);

//show toast every answer

useEffect(()=>{
  //toast
  if(isgameActive)
  Toast.show({
         visibilityTime: 5000, // Keep visible until manually hidden
        type:'grammardraginfo',
        position: 'bottom', // Add this
         bottomOffset: 20,
      text1:`${score} / ${maxQuesindex} `,
        }
   )
},[fruitHarvested])

//dialogue func for the npc-----

const dialogueFunc=(response)=>{

  //--
   let randDialogue = Math.floor(Math.random() * 5)

   //talk a bit after answering

    if(randDialogue === 0 && response === "comment"){
       setnpcDialogue(`You know i have a thing to a big fruittttt. Imagine that ${studProfile.username}`)
    }
    else if(randDialogue === 1 && response === "comment"){
       setnpcDialogue("Wowww collect more fruits. I might give you a basket of fruits, just saying")
    }
    else if(randDialogue === 2 && response === "comment"){
       setnpcDialogue("Heyyy study hard. Dont let your slacking take your determination!")
    }
    else if(randDialogue === 3 && response === "comment"){
       setnpcDialogue("Isnt pear and apple can makes us a perfect jam?! I dont know just inventing strange stuff hehe")
    }
    else if(randDialogue === 4 && response === "comment"){
       setnpcDialogue("Keep going collect more fresh fruits as you can")
    }
    else if(randDialogue === 5 && response === "comment"){
       setnpcDialogue("hey! if you consistently get a perfect harvest. I might give you a huge suprise. Work hard on that")
    }

   //response if right or wrong dialogue
   if(randDialogue === 0 && response === "correct"){
    setnpcDialogue("(Correct) Nice one kid")
   }
   else if(randDialogue === 1 && response === "correct"){
    setnpcDialogue("(Correct) that fruit looks fresh to me, great job.")
   }
   else if(randDialogue === 2 && response === "correct"){
    setnpcDialogue("(Correct) hmmmm profitable fruit lad! nice one.")
   }
   else if(randDialogue === 3 && response === "correct"){
    setnpcDialogue("(Correct) ohhh, that fruit tells you that they're fresh. Hahah You sure have a huge imagination huh ")
   }
   else if(randDialogue === 4 && response === "correct"){
    setnpcDialogue(`(Correct) that smell looks soo freshhh. One point for you ${studProfile.username}`)
   }
   else if(randDialogue === 5 && response === "correct"){
    setnpcDialogue("(Correct) Bingo another perfect fruit to harvest.")
   }
   else if(randDialogue === 0 && response === "wrong"){
    setnpcDialogue("(Wrong) That doesnt look fresh. Throw it out.")
   }
   else if(randDialogue === 1 && response === "wrong"){
    setnpcDialogue("(Wrong) Hmmmm nope wrong.")
   }
   else if(randDialogue === 2 && response === "wrong"){
    setnpcDialogue("(Wrong) We cant harvest that fruit.")
   }
   else if(randDialogue === 3 && response === "wrong"){
    setnpcDialogue("(Wrong) No sorry i cant let that in.")
   }
   else if(randDialogue === 4 && response === "wrong"){
    setnpcDialogue("(Wrong) All minus one. Dont you get it, Wrong fruit kid.")
   }
   else if(randDialogue === 5 && response === "wrong"){
    setnpcDialogue("(Wrong) ehhh that's a raw stuff.")
   }
}

//result panel func----

//result UI reponse func

useEffect(()=>{

  if( showResultModal === true){

    const proportion = score / maxQuesindex

    console.log(proportion)

    //setting a rank for student
    if(score === 0){
    setrankImage(require('../assets/drank.png'))
    setprogressResultColor('black')
     setrankText("D")
     setcomplimentText("Hey dont let youself down. Better luck next time")
     }
     else if(score === maxQuesindex){
      setrankImage(require('../assets/sssrank.png'))
      setprogressResultColor('perfect')
      setrankText("SSS")
         setcomplimentText("Great Performance! Keep it up")
     } 
    else if (proportion >= 0.7) { // 80% to <90%
    setrankImage(require('../assets/arank.png'))// A-Rank
    setprogressResultColor('green')
     setrankText("A")
     setcomplimentText("NICEEEEE")
    }
     else if (proportion >= 0.6) { // 60% to <80%
    setrankImage(require('../assets/brank.png')) // B-Rank
    setprogressResultColor('yellow')
     setrankText("B")
     setcomplimentText("Impressive work")
    } 
    else if (proportion <= 0.4 || score === 1) { // 40% to <60%
   setrankImage(require('../assets/crank.png')) // C-Rank
   setprogressResultColor('red')
    setrankText("C")
    setcomplimentText("Good")
    }


  }

},[showResultModal])



  //useState animation value
  const AnsAnim1 = useRef(new Animated.ValueXY()).current;
  const AnsAnim2 = useRef(new Animated.ValueXY()).current;
  const AnsAnim3 = useRef(new Animated.ValueXY()).current;

  //for character idle animation val
  
 const charidleX = useRef(new Animated.Value(0)).current;
  const charidleY = useRef(new Animated.Value(0)).current;

  //rote character animation val

  const rotateChar=useRef(new Animated.Value(0)).current;
  //animation function-------------

  //animation rolling character whn answering

  useEffect(() => {
   
    if(checkingGrammar === true){
       rotateChar.setValue(0);
       
        Animated.timing(rotateChar, {
          toValue: 1,
          duration: 800, // 3 seconds for one full rotation
          useNativeDriver: true, // Use native driver for better performance
        }).start();
    }
    
  }, [checkingGrammar]);
  
  // Interpolate rotation value to degrees
  const rotationChar = rotateChar.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  //Answer 1
  const panAns1 = useRef(
    
   PanResponder.create({
        onStartShouldSetPanResponder: () => isAnswerFreeze.current, //disable if already answered. Then enable after the next question
        onPanResponderMove: Animated.event(
          [null, { dx: AnsAnim1.x, dy: AnsAnim1.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture) => {
           if (gesture.moveY > dropZoneY - 40 && gesture.moveY < dropZoneY + 130) {
            setDroppedWord(choicesRef.current[0]);
            setIsDropped(true);
            Tts.stop()
            setcheckingGrammar(true)
            // Check answer
               setfruitHarvested(prevCount => prevCount + 1)
            if (choicesRef.current[0]  === correctAnswerRef.current) {
                setcolorChoice1("green")
                 SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
                 setScore((prev)=> prev + 1)
                 dialogueFunc("correct")
            } else {
              dialogueFunc("wrong")
                setcolorChoice1("red")
                 SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
            }
           isAnswerFreeze.current = false
            setbufferDelay(6000)
              
           setcurrQuesindex((prevIndex) => prevIndex + 1); 
          }

          // Reset position
          Animated.spring(AnsAnim1, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
      })
  ).current;

   const panAns2 = useRef(
     PanResponder.create({
        onStartShouldSetPanResponder: () => isAnswerFreeze.current, //disable if already answered. Then enable after the next question
        onPanResponderMove: Animated.event(
          [null, { dx: AnsAnim2.x, dy: AnsAnim2.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.moveY > dropZoneY - 40 && gesture.moveY < dropZoneY + 130) {
            setDroppedWord(choicesRef.current[1]);
            setIsDropped(true);
             Tts.stop()
             setcheckingGrammar(true)
            // Check answer
              setfruitHarvested(prevCount => prevCount + 1)
            if (choicesRef.current[1]  === correctAnswerRef.current) {
                setcolorChoice2("green")
                 SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
                 setScore((prev)=> prev + 1)
                   dialogueFunc("correct")
            } else {
                setcolorChoice2("red")
                  dialogueFunc("wrong")
                 SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
            }
         
             isAnswerFreeze.current = false
            setbufferDelay(6000)
        setcurrQuesindex((prevIndex) => prevIndex + 1); 
          }

          // Reset position
          Animated.spring(AnsAnim2, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
      })

  ).current;

   const panAns3 = useRef(

       PanResponder.create({
        onStartShouldSetPanResponder: () => isAnswerFreeze.current, //disable if already answered. Then enable after the next question
        onPanResponderMove: Animated.event(
          [null, { dx: AnsAnim3.x, dy: AnsAnim3.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture) => {

          if (gesture.moveY > dropZoneY - 40 && gesture.moveY < dropZoneY + 130) {
           setDroppedWord(choicesRef.current[2]);
            setIsDropped(true);
             Tts.stop()
             setcheckingGrammar(true)
            // Check answer
             setfruitHarvested(prevCount => prevCount + 1)
            if (choicesRef.current[2] === correctAnswerRef.current) {
                 setcolorChoice3("green")
                  SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
                  setScore((prev)=> prev + 1)
                    dialogueFunc("correct")
            } else {
               setcolorChoice3("red")
                 dialogueFunc("wrong")
                SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
            }
             isAnswerFreeze.current = false
            setbufferDelay(6000)
            setcurrQuesindex((prevIndex) => prevIndex + 1); 
          }

          // Reset position
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
      horizontalAnimation.start();
      createRandomJump();
  
      return () => {
        horizontalAnimation.stop();
        charidleY.stopAnimation();
      };
    }, [charidleX, charidleY]);

  //proceed to lobby func - Modal
  const leaveGame=async(leavegame)=>{

      if(leavegame === "leave"  && practiceEnabled === false){
  

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
    setroomInformation({})  
    navigation.replace('mainscreen')
    return;
     }
  

  if(practiceEnabled === false){
   navigation.replace('categorieschoose')
    }

    else if(practiceEnabled === true){
  navigation.replace('practiceroom')
    }

    setScore(0)
    setmaxQuesindex(0)
    setcurrQuesindex(0)

  


  }

  
     //exit pause
      const exitpauseFunc=()=>{

          SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
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
  
     const exitGameFunc=async(response)=>{

        SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
      clearCompleted()
  
       
       setpracticeEnabled(false)
       setpauseModal(false)
  
       if(response === "mainmenu" && practiceEnabled === true){
        navigation.replace('mainscreen')
        Tts.stop()
       }
       else if(response === "leavelobby" && practiceEnabled === true){
        navigation.replace('practiceroom')
        Tts.stop()
       }
       else if(response === "leavelobby" && practiceEnabled === false){
        navigation.replace('categorieschoose')
        Tts.stop()
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

        setroomInformation({})
         setjoinActive(false)
        navigation.replace('mainscreen')
        Tts.stop()
       }
     }



  

  //modal result return func

  const renderResultModal = () => (
    <Modal
      visible={showResultModal}
      animationType="fade"
      transparent={true}
      // onRequestClose={() => setShowResultModal(false)}
    >
      
      
      <View style={styles.modalContainer}>
      
        <ImageBackground 
         source={require('../assets/resultbg.png')}
        style={styles.modalContent}>
         <LottieView
             style={{width:500,height:500,position:'absolute'}}
                    source={require('../assets/confetti.json')}
                   autoPlay
                   loop={false}
                  />

      <View style = {styles.modaltxtresultcon}>
       <Text style = {{fontSize:40,fontWeight:'bold',color:'white'}}>R E S U L T</Text>
        </View>

      <View style = {{justifyContent:'center',alignItems:'center',rowGap:20}}>

       <View style = {styles.scoredescon}>
        <Text style = {{fontSize:20,fontWeight:'bold'}}>  Score:{score}/{maxQuesindex}</Text>
        </View>

         <View style = {styles.scoredescon}>
        <Text style = {{fontSize:20,fontWeight:'bold'}}>  Accuracy: {((score / maxQuesindex) * 100).toFixed(0)}%</Text>
        </View>
        
        </View>
          {/* <Text style={styles.modalText}>Your Score: {score} / {maxQuesindex}</Text> */}

            <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              {progressResultColor !== "perfect" ? <Progress.Bar progress={maxQuesindex > 0 ? score/maxQuesindex : 0} width={wp('50%')} height={40} color={progressResultColor}/> : <Text style = {{fontSize:20,fontWeight:'bold',color:"blue"}}>PERFECTTTT!!</Text>}
              {/* <Image style = {{width:120,height:120}} source={rankImage}/> */}
              </View>

              {/* <View style = {styles.rankdisplaycon}>
                        <Text style = {{fontSize:17,fontWeight:'700'}}>R A N K : <Text style = {{fontSize:23,fontWeight:'bold'}}>{rankText}</Text></Text>
                  </View> */}


              <View style = {styles.resultcomplimentcon}>
              <Text style = {{fontSize:20,color:'white',fontWeight:'bold'}}>{complimentText}</Text>
              </View>


          <View style = {{flexDirection:'row',columnGap:30}}>
          {practiceEnabled === false ?
         <TouchableOpacity
            style={styles.button}
            onPress={()=>leaveGame("dontleave")}
          >

          <Text style={styles.buttonText}>Proceed to Lobby</Text>
          </TouchableOpacity>
          : ''}

            <TouchableOpacity
            style={styles.button}
            onPress={()=>{leaveGame("leave"),setpracticeEnabled(false)}}
          >
            <Text style={styles.buttonText}>Leave Room</Text>
          </TouchableOpacity>

        </View>
        </ImageBackground>
      </View> 

      
    </Modal>
  );

  

  return (
    <ImageBackground source={require('../assets/dashboardmainpage.png')} style={styles.container}>
      <View style = {styles.topcon}>
      <LinearGradient
      style = {styles.dialoguecon}
      colors={['#418a60ff', '#7dc980ff', '#418a60ff']}          
      start={{ x: 0, y: 0 }}              
       end={{ x: 1, y: 1 }}   
      >
       <Text style={styles.instruction}>{npcDialogue}</Text>
         </LinearGradient>
         <TouchableOpacity onPress={()=>setpauseModal(true)} style = {styles.pausebtn}><Image source={require('../assets/pausebutton.png')} style = {{width:80,height:80}}/></TouchableOpacity>
      </View>

{/* sentence */}
      <ImageBackground source={imageTopviewedBox} style={styles.sentenceContainer}>

        <ScrollView contentContainerStyle={styles.scrollcon}>
          <Text style={styles.sentenceText}>{firsthalfQues}</Text>
          <View style={!checkingGrammar ? styles.blank : [styles.blank,{backgroundColor:'blue'}]}>
            <Text style={styles.blankText}>{isDropped ? droppedWord : '____'}</Text>
          </View>
          <Text style={styles.sentenceText}>{secondhalfQues}</Text>
        </ScrollView>

      </ImageBackground>

      
{choices?.length === 3 && (
      <View style={styles.choicesContainer}>

        {/* ans 1 */}
           
                      <View style = {[choicesRef.current[0] === correctAnswerRef.current && checkingGrammar  ?
              [styles.fruitcon,{backgroundColor:'#8EEC7A'}]: choicesRef.current[0] !== correctAnswerRef.current && checkingGrammar ?  [styles.fruitcon,{backgroundColor:'#E18374'}]: styles.fruitcon]}> 
       <Animated.Image
       source={require('../assets/Orange.png')}
        style={[styles.choice,AnsAnim1.getLayout(),{backgroundColor: colorChoice1}]}
        {...panAns1.panHandlers}
      >
      </Animated.Image>
       <View style = {[styles.answertextcon]}>
       <Text style={styles.choiceText}>{choices[0]}</Text>
       </View>
    </View>

     

             {/* ans 2 */}

              <View style = {[choicesRef.current[1] === correctAnswerRef.current && checkingGrammar  ?
              [styles.fruitcon,{backgroundColor:'#8EEC7A'}]: choicesRef.current[1] !== correctAnswerRef.current && checkingGrammar ?  [styles.fruitcon,{backgroundColor:'#E18374'}]: styles.fruitcon]}>        
         <Animated.Image
          source={require('../assets/Pear.png')}
        style={[styles.choice,AnsAnim2.getLayout(),{backgroundColor: colorChoice2}]}
        {...panAns2.panHandlers}
      >
      </Animated.Image>
        <View style = {[styles.answertextcon]}>
       <Text style={styles.choiceText}>{choices[1]}</Text>
       </View>
           </View>

             {/* ans 3 */}
                      <View style = {[choicesRef.current[2] === correctAnswerRef.current && checkingGrammar  ?
              [styles.fruitcon,{backgroundColor:'#8EEC7A'}]: choicesRef.current[2] !== correctAnswerRef.current && checkingGrammar ?  [styles.fruitcon,{backgroundColor:'#E18374'}]: styles.fruitcon]}> 
         <Animated.Image
          source={require('../assets/Mango.png')}
        style={[styles.choice,AnsAnim3.getLayout(),{backgroundColor: colorChoice3}]}
        {...panAns3.panHandlers}
      >
       
      </Animated.Image> 
      <View style = {[styles.answertextcon]}>
       <Text style={styles.choiceText}>{choices[2]}</Text>
       </View>
      </View>



      </View>
   
)}

      <View style={styles.charactercon}>
        <Animated.Image style={[styles.character,{
           transform:[
              { translateX: charidleX },
              { translateY: charidleY },
              {rotate: rotationChar}
                ]
        }]}  
        
        source={localImageMap[studAssets.characterequipimg]}/>
        {/* <Image style={[styles.character,{width:wp('40%'),bottom:hp('9%')}]} /> */}
      </View>

     {renderResultModal()}

     
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffce0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingTop: 50,
    // rowGap: 70
  },
  instruction: {
    fontSize: 18,
    color: '#ffffffff',
    fontWeight: 'bold',
  },
  sentenceContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4add7bff',
    borderColor:'blue',
    borderWidth:3
  },
  scrollcon:{
    marginTop:20,
    width:wp('80%'),
    // borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    rowGap:0,
    padding:15
  },
  sentenceText: {
    fontSize: 24,
    color:'white',
    fontWeight:'600'
    // marginHorizontal: 5,
  },
  blank: {
    borderBottomWidth: 2,
    borderColor: '#000',
    minWidth: 60,
    alignItems: 'center',
  },
  blankText: {
    fontSize: 24,
    color: 'white',
  },
  choicesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: wp('100%'),
    height:hp('auto'),
    alignItems:'center',
    // justifyContent:'center',
    // borderWidth:2,
    rowGap:30,
  padding:20
  },
  choice: {
    width: 60,
    height: 60,
    borderWidth:2,
    // backgroundColor: '#5f5652ff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  choiceText: {
    fontSize: 18,
    color: '#6c4d4d',
    fontWeight: 'bold',
  },
  charactercon: {
    width: wp('100%'),
    height: hp('22%'),
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    columnGap: 90
  },
  character: {
    width: 130,
    height: 170,
    // backgroundColor: 'lightblue'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
     width:wp('90%'),
      height:hp('70%'),
      // left:wp('5%'),
      // top:hp('8%'),
      // borderWidth:3,
      rowGap:15,
      borderColor:'blue',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor:'lightgreen'
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
    button: {
      backgroundColor: '#0ae94dff',
    padding: 5,
    borderRadius: 20,
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    width:wp('30%'),
    height:hp('6%'),
    elevation:5,
    borderColor:'green'
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
  topcon:{
    width:wp('100%'),
    height:hp('20%'),
    // borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    columnGap:20
  },
  fruitcon:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    columnGap:30,
    // borderWidth:3,
    // borderColor:'green',
    backgroundColor:'#EAEE7E',
    borderRadius:20,
    height:hp('auto'),
    width:wp('90%'),
  
  },
  answertextcon:{
    width:wp('57%'),
    height:hp('auto'),
    alignItems:'center',
    borderRadius:20,
    borderWidth:1,
    justifyContent:'center',
    backgroundColor:'white',
  
    
  },
  npccon:{
    width:50,height:50,backgroundColor:'white'
  },
   pausebtn:{
    width:50,
    height:50,
    // backgroundColor:'lightblue',
    justifyContent:'center',
    alignItems:'center'
  },
   overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // background dim
    justifyContent:'center',
    alignItems:'center',
   
  },

   pausecon:{
   width:wp('70%'),
   // height:hp('30%'),
   borderBottomWidth:8,
   borderColor:'blue',
   padding:30,
  //  borderRadius:20,
   justifyContent:'center',
   alignItems:'center',
  //  backgroundColor:'white',
   rowGap:30
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
  pausetxt:{
    fontSize:13,
    fontWeight:700
  },
  dialoguecon:{
    width:wp('73%'),
    // height:hp('8%'),
    padding:5,
    borderWidth:2,
    borderColor:'blue',
    justifyContent:'center',
    alignItems:'center'
  },
  pausepaneltxt:{
    // bottom:55,
    fontSize:40,
    color:'blue',
    fontWeight:'bold'
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
    backgroundColor:'green',
    borderColor:'white'
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
  
});

export default memo(InGameGrammarDrag);