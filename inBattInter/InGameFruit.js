import {AppState,BackHandler,PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View,Easing  } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { useFocusEffect,useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
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
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
import Storage from '@react-native-firebase/storage';

  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const IngameFruit=()=>{

          const {studProfile,setstudProfile}=useContext(MyStorage)
            const {studAssets,setstudAssets}=useContext(MyStorage)

  const isFocused = useIsFocused() //focused state

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

            exitgameClearFunc()
           setjoinActive(false)
           navigation.replace('joinroom')

            Toast.show({
            type:'error',
            text1:'Disconnected',
            text2:'You automatically leave the playroom',
          visibilityTime: 4000,
                 })
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

      //reponse join btn useState toggle
      const {joinActive,setjoinActive}=useContext(MyInGameStor)


        //game id value 
    const {gameTypeVal,setgameTypeVal}=useContext(MyInGameStor)


      const navigation = useNavigation();


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

//server time

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
},[])

// "DOG","CAT","ATE","MAN","OLD","FINE","TOSS"
const [fixedWords,setfixedWords] = useState([])
const [fixedImgWords,setfixedImgWords]=useState([])
const [fixedMeaningWords,setfixedMeaningWords]=useState([])
  //-----------------------------letters--------------------
  // const consonant = "BCDFGHJKLMNPQRSTVWXYZ"
  // const vowel = "AEIOU"
  // let [countLetterProb,setcountLetterProb]=useState(4);
const [letters,setletters]=useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ") //default letters

const [isShoot,setisShoot]=useState("Missed") 

//targetted word to spell
const [targetWord,settargetWord]=useState("") //target word to spell
const targetWordSplit = (targetWord || "").split("") //split targetword
const [collectedWord,setcollectedWord]=useState([]) //collected word uring spelling round
const lettersSplit = letters.split(""); //split letter

const [targetWordImg,settargetWordImg]=useState(null)
const [targetWordMeaning,settargetWordMeaning]=useState("")

//curr
const [currentLetterIndex,setcurrentLetterIndex]=useState(Math.floor(Math.random() * 26)) //current random letter index for fruit1
const [currentLetterIndex2,setcurrentLetterIndex2]=useState(Math.floor(Math.random() * 26))//current random letter index for fruit2
const [currentLetterIndex3,setcurrentLetterIndex3]=useState(Math.floor(Math.random() * 26))//current random letter index for fruit3

const [fruitLetter,setfruitLetter]=useState(lettersSplit[0]) //1st fruit letter
const [fruitLetter2,setfruitLetter2]=useState(lettersSplit[0]) //2nd fruit letter
const [fruitLetter3,setfruitLetter3]=useState(lettersSplit[0]) //2nd fruit letter

const [currLetter,setcurrLetter]=useState("") //current letter catched

const [triggerFruitSet,settriggerFruitSet]=useState(0); //trigger next fruit set

const [isShooted,setisShooted]=useState(false);

//active spell index and maximum spell index

const [maxSpellindex,setmaxSpellindex]=useState(0)
const [currSpellindex,setcurrSpellindex]=useState(0)

const {practiceEnabled,setpracticeEnabled}=useContext(MyInGameStor)

// to run the gameplay
const [isgameActive,setisgameActive]=useState(false)

//user's score

const [score, setScore] = useState(0); 
const [fruitHarvested,setfruitHarvested]=useState(0)

 //get roominformation---------
        const {roomInformation,setroomInformation}=useContext(MyInGameStor);
        const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);

//indexplayer's progress count

const {categoryAvailIndex,setcategoryAvailIndex}=useContext(MyInGameStor);
const {categoryAvailCurrIndex,setcategoryAvailCurrIndex}=useContext(MyInGameStor);
const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor)
 const {analyticsDocid,setanalyticsDocid}=useContext(MyInGameStor);

const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor)

const scoreRef = useRef(score);

//loading state

const [isLoading,setisLoading]=useState(false)

// keep ref in sync whenever score changes
useEffect(() => {
  scoreRef.current = score;
}, [score]);

//get data from the firebase

useEffect(()=>{

  //player-teacher choices
  const spellFunc=async()=>{
      setisLoading(true)
    console.log("practice rn", practiceEnabled)
    if(practiceEnabled === false){
      const spellingdblist = firestore().collection('spellings');
      const spellingsget = await spellingdblist
        .where('fruitcatcherval', '==', gameTypeVal)
          .where('difficulty','==',inGameDifficulty)
        .get();

      const searchspelling = spellingsget.docs.map(doc => doc.data());

      searchspelling.map((element,index)=>{ 
     setfixedWords(prev => [...prev, element.word]);
     setfixedImgWords(prev => [...prev,element.imagepath])
     setfixedMeaningWords(prev => [...prev,element.description])
      })

      setmaxSpellindex(searchspelling.length);

    }

    else{
       //practice mode choices
        const spellingdblist = firestore().collection('practice-spelling');
      const spellingsget = await spellingdblist
      .where('difficulty','==' ,inGameDifficulty)
      // .limit(1)
      .get();

   const searchspelling = spellingsget.docs.map(doc => doc.data());
  
   const shuffled = searchspelling.sort(() => 0.5 - Math.random()); // Shuffle the array
    const selected = shuffled.slice(0, 5);

     selected.map((element,index)=>{ 
     setfixedWords(prev => [...prev, element.word])
     setfixedImgWords(prev => [...prev,element.imagepath])
     setfixedMeaningWords(prev => [...prev,element.description])
      })
     setmaxSpellindex(selected.length);
    }

    setisLoading(false)
  }

  spellFunc()


},[])

//get next word if wrong spelling or correct spelling
  useEffect(()=>{
    const currSpell=async()=>{
   
      if (fixedWords.length > 0 && currSpellindex < fixedWords.length) {
 settargetWord(fixedWords[currSpellindex])
 settargetWordMeaning(fixedMeaningWords[currSpellindex])
   try{
  const imageUrl = await Storage().ref(fixedImgWords[currSpellindex]).getDownloadURL();
settargetWordImg(imageUrl)

  }
  catch(error){
    console.log(error)
     
  }
 
 }
} 
currSpell()
  },[fixedWords,currSpellindex])

  //RNGGG IMPROVERRRRR----------------------

  const generateDropLetters = useCallback((targetWord) => {
   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (!targetWord || targetWord.length === 0) {
    return ["A", "B", "C"]; // fallback
  }

  const targetLetters = targetWord.toUpperCase().split("");

  const correctLetter = targetLetters[Math.floor(Math.random() * targetLetters.length)];
   const correctLetter2 = targetLetters[Math.floor(Math.random() * targetLetters.length)];
     const correctLetter3 = targetLetters[Math.floor(Math.random() * targetLetters.length)];
 

  const mixed = [correctLetter,correctLetter2, correctLetter3];
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }

  return mixed;
});

// const [startGameNow,setstartGameNow]=useState(false);
//buffer delay
const [delayInputFruit,setdelayInputFruit]=useState(0)

//correct spelling display
const [isSpellCorrectDis,setisSpellCorrectDis]=useState("WRONG")
const [correctSpellDis,setcorrectSpellDis]=useState("")
const [isViewSpellCorrect,setisViewSpellCorrect]=useState(false)

const [spellMeaningDis,setspellMeaningDis]=useState("")

//score
const [spellScore,setspellScore]=useState(0)

//modal trigger
const [resultTypeIndex,setresultTypeIndex]=useState(0)
const [viewResult,setviewResult]=useState(false)
 const [pauseModal,setpauseModal]=useState(false)

    //basket animated default travel value

    const basketX = useRef(new Animated.Value(0)).current;


    //fruit animated default travel value------------



  const fruitY = useRef(new Animated.Value(-670)).current;
  const fruitX = useRef(new Animated.Value(0)).current;
  const fruitOpacity = useRef(new Animated.Value(1)).current;

    const fruitY2 = useRef(new Animated.Value(-670)).current
  const fruitX2 = useRef(new Animated.Value(0)).current
  const fruitOpacity2 = useRef(new Animated.Value(1)).current;

  
    const fruitY3 = useRef(new Animated.Value(-670)).current
  const fruitX3 = useRef(new Animated.Value(0)).current
  const fruitOpacity3 = useRef(new Animated.Value(1)).current;

  //checkanscon anim value

   const [checkAnsconColor,setcheckAnsconColor]=useState('');
   const checkAnsOpacity = useRef(new Animated.Value(0)).current;

   //rotating fruit

   const rotateFruit = useRef(new Animated.Value(0)).current;

   //char response answer animation

   const moveAnimation = useRef(new Animated.Value(wp('-60%'))).current;
  const jumpAnimation = useRef(new Animated.Value(0)).current;


//score up animation ref

const scoreupAnimref=useRef(null)

//result Ui response value

const [rankImage,setrankImage]=useState(null);
const [progressResultColor,setprogressResultColor]=useState('red');
const [rankText,setrankText]=useState("");
const [complimentText,setcomplimentText]=useState("")

  //fruit crushed and catched value

  const fruitStatus = useRef(new Animated.Value(70)).current;

    // Real values tracking for panAnimation
  const basketXVal = useRef(0);

  const fruitXVal = useRef(0);
   const fruitXVal2 = useRef(0);
      const fruitXVal3 = useRef(0);

      //for pause modal values
    const pauseModalX = useRef(new Animated.Value(0)).current;
    const pauseModalY = useRef(new Animated.Value(0)).current;

    //instruction toast useEffect

    useEffect(()=>{

   
       Toast.show({
             visibilityTime: 0, // Keep visible until manually hidden
            autoHide: false, 
              type:'instruction',
              text1:'Fruit Basket',
              text2:'Spelling Assessment',
              //for extra props (toast only accepts 2 text)
               props: {
            text3: 'Drag the basket left to right',
            text4: 'Catch the fruit accordingly to the letter order of the word', 
            text5: 'Spell the word correctly and gain points', 
            protip1:'Carefully listen to the word',
            protip2:'Do your best not to miss the fruit',
            protip3:'Wait patiently',
             onStart: () => {
              Toast.hide();
               setisgameActive(true)
            },   
          },

            onHide: () => {
        setisgameActive(true);
            }
          
            }
          )
          

          

    },[])

  //voice tone

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

 //speak everytime currspell is activate and changed

 useEffect(()=>{


  if(currLetter !== ""){
       Tts.speak(currLetter)
  }


 },[currLetter])

 //say spelling out loud
 useEffect(()=>{

  
    if (currSpellindex + 1 > maxSpellindex) {
      return;
    }

  if(isFocused && targetWord !== "" && targetWord !== undefined && isgameActive === true){

    setTimeout(() => {
      
        Tts.speak(`Spell ${targetWord}`)
    }, delayInputFruit);

}
 },[targetWord,isgameActive])

 //repeat word vaa clicking volume btn
 
  const speakupfunc=()=>{
    Tts.stop()
    Tts.speak(targetWord)
  }



    //animations main----------

    // Start the infinite rotation animation
useEffect(() => {
  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateFruit, {
        toValue: 1,
        duration: 3000, // 3 seconds for one full rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };
  
  startRotation();
}, []);

// Interpolate rotation value to degrees
const rotationFruit = rotateFruit.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

  const panBasket = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return isViewSpellCorrect ? false : true;
    },
      onMoveShouldSetPanResponder: () => {
       return isViewSpellCorrect ? false : true;
      },
    onPanResponderGrant: () => {
      // stash the current value into offset
      basketX.setOffset(basketXVal.current);
      // reset the animated value so dx starts from zero
      basketX.setValue(0);
      

    },
   
    onPanResponderMove: Animated.event(
      [null, { dx: basketX }], 
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      // put offset and value back together
      basketX.flattenOffset();
      // clamp within bounds
      const clamped = Math.max(-170, Math.min(170, basketXVal.current));
      basketX.setValue(clamped);
    },
  })
).current;


  
  const dropFruit=(l1)=>{ //dropfruit 1

    if(isFocused && viewResult === false){
    // const thisLetter = lettersSplit[currentLetterIndex];
    // setfruitLetter(thisLetter);

    const randomX = Math.floor(Math.random() * 340) - 170;
  fruitX.setValue(randomX);
  fruitY.setValue(hp('-62%')); 
  
    //will effect letter spelling checking useEffect

   Animated.timing(fruitY, {
      toValue: 250, // Target drop position
      duration: 3800, // Duration in ms
      useNativeDriver: true,
    }).start(()=>{  
      fruitOpacity.setValue(0)
      if (Math.abs(fruitXVal.current - basketXVal.current) <  65) { //hitbox for basket
        setisShoot("GOALLL")
       SoundPlayer.playAsset(require("../assets/sounds/catchapple.mp3"))
        setisShooted(true)
        setcollectedWord(prev => [...prev, l1]);
        // spellCheckFunc()
        setcurrLetter(l1)
       
      } else {
         SoundPlayer.playAsset(require("../assets/sounds/dropapple.mp3"))
          setisShooted(false)
         setisShoot("MISSED")
        
      }
       
        
       
    });

  }
 }

 //second fruit

 const dropFruit2=(l2)=>{ //dropfruit2

  if(isFocused && viewResult === false){
  // const thisLetter2 = lettersSplit[currentLetterIndex2];
  //   setfruitLetter2(thisLetter2);

    const randomX2 = Math.floor(Math.random() * 340) - 170;
  fruitX2.setValue(randomX2);
   fruitY2.setValue(hp('-62%')); 
    //will effect letter spelling checking useEffect

      Animated.timing(fruitY2, {
      toValue: 170, // Target drop position
      duration: 4000, // Duration in ms
      useNativeDriver: true,
    }).start(()=>{     
      fruitOpacity2.setValue(0)
      if (Math.abs(fruitXVal2.current - basketXVal.current) <  65) { //hitbox for basket
        setisShoot("GOALLL")
       SoundPlayer.playAsset(require("../assets/sounds/catchapple.mp3"))
        setisShooted(true)
        setcollectedWord(prev => [...prev, l2]);
        // spellCheckFunc()
        setcurrLetter(l2)
       
      } else {
         SoundPlayer.playAsset(require("../assets/sounds/dropapple.mp3"))
          setisShooted(false)
         setisShoot("MISSED")
        
      }

      
       
    });
  }
 }

 //3rd fruit

 const dropFruit3=(l3)=>{ //dropfruit3

  if(isFocused && viewResult === false){
  // const thisLetter3 = lettersSplit[currentLetterIndex3];
  //   setfruitLetter3(thisLetter3);

    const randomX3 = Math.floor(Math.random() * 340) - 170;
  fruitX3.setValue(randomX3);
    fruitY3.setValue(hp('-62%'));
    //will effect letter spelling checking useEffect

      Animated.timing(fruitY3, {
      toValue: 100, // Target drop position
      duration: 4300, // Duration in ms
      useNativeDriver: true,
    }).start(()=>{     
      fruitOpacity3.setValue(0)
      if (Math.abs(fruitXVal3.current - basketXVal.current) <  65) { //hitbox for basket
        setisShoot("GOALLL")
       SoundPlayer.playAsset(require("../assets/sounds/catchapple.mp3"))
        setisShooted(true)
        setcollectedWord(prev => [...prev, l3]);
        setcurrLetter(l3)
  
      setTimeout(()=>{
        settriggerFruitSet(Math.floor(Math.random() * 340) - 170)
      },400)
        return
       
      } else {
         SoundPlayer.playAsset(require("../assets/sounds/dropapple.mp3"))
          setisShooted(false)
         setisShoot("MISSED")
          
      }

    fruitY.stopAnimation()
   fruitY2.stopAnimation()
   fruitY3.stopAnimation()
        settriggerFruitSet(Math.floor(Math.random() * 340) - 170)
        
      
       
    });
}
 }

// letter spelling checking Func -----


//old ver

 useEffect(()=>{

  //collect harvested fruit

setfruitHarvested(prevCount => prevCount + 1)
 
//finished game useEff subFunc

const FinishedGame=()=>{
  if(isFocused){
 console.log("FINISHED GAME") 
    setisgameActive(i => i = false)
       setTimeout(()=>{
            Tts.speak("Great Job")
    setspellScore(0);
    setisShoot('Missed');
    basketX.setValue(0);
    basketX.setOffset(0);
    fruitY.setValue(hp('-62%'));
    fruitY2.setValue(hp('-62%'));
    fruitY3.setValue(hp('-62%'));
    fruitOpacity.setValue(1);
    fruitOpacity2.setValue(1);
    fruitOpacity3.setValue(1);
    setcurrentLetterIndex(0);
    setcurrentLetterIndex2(0);
    setcurrentLetterIndex3(0);
    //compute if practice false

    if(practiceEnabled === false){
      ComputationFunc()
    }  else{
      console.log("Cant record in practice mode for now")
      //  setpracticeEnabled(false)
      console.log("LOADING")
      clearCompleted()
       console.log("LOADED")
    }

    setviewResult(true) 
    setgameTypeVal(0)
       },5000)
      }
}

//check spelling Identifier Func

const spellingIdentifier=(spellResult,displayResult,scoreCounted)=>{

        //reset fruit Y position upon getting the right fruit
   fruitY.setValue(0)
   fruitY2.setValue(0)
   fruitY3.setValue(0)

   fruitY.stopAnimation()
   fruitY2.stopAnimation()
   fruitY3.stopAnimation()

    Tts.speak(spellResult)
    // setspellScore(spellScore + 1)
       setcurrSpellindex(i => i + 1);
      setisShooted(false)
    setcollectedWord([]);
    setisSpellCorrectDis(displayResult)
     setisViewSpellCorrect(true)
    setcorrectSpellDis(targetWord)
    setspellMeaningDis(targetWordMeaning)
    if(scoreCounted === true){setScore(prev => prev + 1)}
      //set delay before thhe next fruit drop
    setdelayInputFruit(5000)
    
   

}

//check spelling initiate!!
 if(targetWordSplit[collectedWord.length - 1]   === currLetter && isShooted === true){
 
  
    
  if(targetWord === collectedWord.join('')){
    spellingIdentifier("Correct Spelling","CORRECT",true) //call spellingIdentifier Func to pass responses
    setcheckAnsconColor('rgba(43, 255, 0, 0.5)')
   checkansAnim()
    // scoreupAnimref.current.play()
    // setTimeout(()=>{
    // scoreupAnimref.current.reset()
    // },2000)
  
  if (currSpellindex + 1 >= maxSpellindex) {

    FinishedGame() //call Finished game Func to finish the game

  }

  }
 }
 else if(targetWordSplit[collectedWord.length - 1]   !== currLetter && isShooted === true){

  spellingIdentifier("Wrong Spelling","WRONG",false) //call spellingIdentifier Func to pass responses
  setcheckAnsconColor('rgba(245, 1, 1, 0.5)')
  checkansAnim()
      if (currSpellindex + 1 >= maxSpellindex) {
            FinishedGame() //call Finished game Func to finish the game
       }
 }


 },[collectedWord.length])

 
  //checkanscon anim--
  

  const checkansAnim=()=>{

    Animated.sequence([
      Animated.timing(checkAnsOpacity,{
        toValue:1,
        duration:200,
        useNativeDriver:true
      }),
      Animated.timing(checkAnsOpacity,{
        toValue:0,
        duration:200,
        useNativeDriver:true
      })
    ]).start()

  }



 //basket pic change
const [basketImg,setbasketImg]=useState(null)
 useEffect(()=>{

  if(isViewSpellCorrect){
    setbasketImg(require('../assets/Basketwithfruits2.png'))
  }
  else{
     setbasketImg(require('../assets/Basket.png'))
  }
 },[isViewSpellCorrect])

 //basket useEff
 useEffect(() => {
  const id = basketX.addListener(({ value }) => {
    basketXVal.current = value;
  });
  return () => basketX.removeListener(id);
}, [basketX]);

//looping drop fruit useEffect
  useEffect(()=>{
    
   setTimeout(()=>{  //buffer delay   

    if(isgameActive === true){
 
      setisViewSpellCorrect(false)
       setdelayInputFruit(0)
    const fruit1 =  fruitX.addListener(({ value }) => {
      fruitXVal.current = value;
    });
   const fruit2 =   fruitX2.addListener(({value})=> {
      fruitXVal2.current = value;
    })

    const fruit3 = fruitX3.addListener(({value})=> {
      fruitXVal3.current = value;
    })
       fruitOpacity.setValue(1)
   
const [l1, l2, l3] = generateDropLetters(targetWord)
   setfruitLetter(l1)
  setfruitLetter2(l2)
    setfruitLetter3(l3)
  dropFruit(l1);

  const timer2 = setTimeout(() => {
      fruitOpacity2.setValue(1)
    dropFruit2(l2);
    }, 850);
  const timer3 = setTimeout(() => {
     
    fruitOpacity3.setValue(1)
    dropFruit3(l3);
    }, 1950);

}
 },delayInputFruit)



  },[triggerFruitSet,isgameActive])


//effect character answer reposnse

const charAnimResponse=()=>{

    // Move left animation
    const moveLeft = Animated.timing(moveAnimation, {
      toValue: basketXVal.current, // Move 100 units to the left
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    // Jump animation
    const jumpUp = Animated.timing(jumpAnimation, {
      toValue: -50, // Jump up 50 units
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    const jumpDown = Animated.timing(jumpAnimation, {
      toValue: 0, // Return to original position
      duration: 500,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    });

    // Sequence: move left, then jump
    Animated.sequence([
      moveLeft,
      Animated.sequence([jumpUp, jumpDown])
    ]).start();

}

const backcharAnimResponse=()=>{
   // Move left animation
   Animated.timing(moveAnimation, {
      toValue: wp('-60%'), // Move 100 units to the left
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start()
}

//effect character answer reposnse useEffect

useEffect(()=>{

  if(isViewSpellCorrect){
    charAnimResponse()
  }
  else{
    backcharAnimResponse()
  }

},[isViewSpellCorrect])
  //trigger modal/s------

   //for pause panel func
  
   const pauseFunc=()=>{

         SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
        setpauseModal(true)

        //stop animation pause

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

     setspellScore(0);
    setisShoot('Missed');
    basketX.setValue(0);
    basketX.setOffset(0);
    fruitY.setValue(0);
    fruitY2.setValue(0);
    fruitY3.setValue(0);
    fruitY.stopAnimation()
   fruitY2.stopAnimation()
   fruitY3.stopAnimation()
    fruitOpacity.setValue(1);
    fruitOpacity2.setValue(1);
    fruitOpacity3.setValue(1);
    setcurrentLetterIndex(0);
    setcurrentLetterIndex2(0);
    setcurrentLetterIndex3(0);
    setcategoryAvailIndex(0)
    setcategoryAvailCurrIndex(0) 
   setcategoryProgDoc("")
   setanalyticsDocid("")
   setplayerAssetsDocid("")
   setinGameDifficulty("")
     setresultTypeIndex(0)
     setcurrSpellindex(0)
     setmaxSpellindex(0)
     setpracticeEnabled(false)
     setpauseModal(false)

   }

   const exitGameFunc=async(response)=>{

     SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
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

      setjoinActive(false)
      navigation.replace('mainscreen')
        setroomInformation({})  
     }
     setpracticeEnabled(false)
   }

//result panel func----

//result UI reponse func

useEffect(()=>{

  if(isFocused && viewResult === true){

    const proportion = score / maxSpellindex

    //setting a rank for student
    if(score === 0){
    setrankImage(require('../assets/drank.png'))
    setprogressResultColor('black')
     setrankText("D")
     setcomplimentText("Hey dont let youself down. Better luck next time")
     }
     else if(score === maxSpellindex){
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

},[viewResult])



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
    setpracticeEnabled(false)
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
 setviewResult(false)
 setpracticeEnabled(false)
  setmaxSpellindex(0)
}

const clearCompleted=()=>{

   
   setcategoryAvailIndex(0)
  setcategoryAvailCurrIndex(0) 
   setcategoryProgDoc("")
   setanalyticsDocid("")
   setplayerAssetsDocid("")
   setinGameDifficulty("")
     setresultTypeIndex(0)
    //  setviewResult(false)
     setcurrSpellindex(0)
    //  setmaxSpellindex(0)
     setisViewSpellCorrect(false)
     fruitY.stopAnimation()
   fruitY2.stopAnimation()
   fruitY3.stopAnimation()


}

//objectives computation---------------
useEffect(()=>{
 if(viewResult === true){
objectiveComputationFunc()
}
},[viewResult])

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
   

    if(gametype === "spelling"  && finished === false && taskmode === "single"){

      objectiveindex = i;
      objectivecompletedby = searchachievements[0].completedby[i]
      requiredvalue = searchachievements[0].requiredvalue[i]
      progression = searchachievements[0].progression[i]
    }
   }

   let objectivenotmaxed = false

   switch(objectivecompletedby){

    case "perfectscore":
      console.log("perfectscore")
      if (maxSpellindex === score) {
    console.log(`Max score (${maxSpellindex}) matched with current score (${score + 1}). Incrementing progression.`);
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

 //Computation function------------


const ComputationFunc=async()=>{

  //record spelling analytics

  
       const spellscore = scoreRef.current
    const spelltotal = maxSpellindex

    const percentagespell = (spellscore / spelltotal) * 100;


     const analyticsDocRef = firestore().collection('analytics').doc(analyticsDocid);
      const analyticsDocSnapshot = await analyticsDocRef.get();
      const currentspellingCom = analyticsDocSnapshot.data().spellingassessment || [];
      const updatedspellCom = [...currentspellingCom, percentagespell];

      const timestamp = firestore.Timestamp.now();
      const currentspellingDate = analyticsDocSnapshot.data().spellingdate || [];
      const updatedspellingDate = [...currentspellingDate,timestamp]

    try{
   firestore()
   .collection('analytics')
   .doc(analyticsDocid)
   .update({
    spellingassessment:updatedspellCom,
    spellingdate:updatedspellingDate
   })
  // await analyticsDocRef.update({
  //   spellingassessment: updatedspellCom,
  //   spellingdate: updatedspellingDate
  // });
  }
  catch(error){
    console.log(error)
  }

  //record progress


  const docRef = firestore().collection('joinroom-progress').doc(categoryProgDoc);

// Get current values
const snapshot = await docRef.get();
const data = snapshot.data() || {};

// Update only the one that was just completed
await docRef.update({
  spellingprogeasy: data.spellingprogeasy || inGameDifficulty === 'easy',
  spellingprogmedium: data.spellingprogmedium || inGameDifficulty === 'medium',
  spellingproghard: data.spellingproghard || inGameDifficulty === 'hard',
    scorespelling:firebase.firestore.FieldValue.increment(scoreRef.current),
  maxscorespelling:firebase.firestore.FieldValue.increment(maxSpellindex)
});

const updated = (await docRef.get()).data();

if (updated.spellingprogeasy && updated.spellingprogmedium && updated.spellingproghard) {
  console.log("✅ difficulty completed");


  //notify the teacher

   firestore()
  .collection('notification').doc()
      .set({
   gradelevel:studProfile.gradelevel,
   notification:`Student ${studProfile.firstname} ${studProfile.lastname} Completed Spelling Game at Room ${roomInformation.roomcode}`,
  notifdate:firestore.FieldValue.serverTimestamp(),
   teacherid:roomInformation.teacherid
     })

  //notify that the student got a perfect score on spelling

  if(updated.scorespelling === updated.maxscorespelling){
     firestore()
  .collection('notification').doc()
      .set({
   gradelevel:studProfile.gradelevel,
   notification:`Student ${studProfile.firstname} ${studProfile.lastname} Got a perfect Score on Spelling Game at Room ${roomInformation.roomcode}`,
  notifdate:firestore.FieldValue.serverTimestamp(),
   teacherid:roomInformation.teacherid
     })
  }

  
  //complete the spelling game

  await docRef.update({
   isfruitgamecompleted:true,
  })

  const updated2 = (await docRef.get()).data();

  if(updated2.isfruitgamecompleted && updated2.issecondgamecompleted && updated2.isthirdgamecompleted){
      console.log("completed all games")
       checkProgress();
  }
  


//  RewardFunc()
//  setcategoryAvailCurrIndex(prev => prev + 1)

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

  

//compute overall and analyasis if completed all categories

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

      //end--------
 

    return(
        <>
        <ImageBackground source={require('../assets/Fruits_Basket_BG.png')} style = {styles.container}>


    {/* pausescorecon */}
   { !isViewSpellCorrect ? <View style = {styles.scorepausecon}>

        <Image style = {styles.profilepic} source={require('../assets/ms.trixie.png')}/>

        <View style = {styles.scorecon}>

        <LottieView
          
          ref = {scoreupAnimref}
          style={{width:250,height:250,position:'absolute'}}
          source={require('../assets/scoreup.json')}
              />

         <Image style = {{width:70,height:70,}} source={require('../assets/leaf.png')}/>

        <Image style = {{width:45,height:45,right:20}} source={require('../assets/basketwithfruits.png')}/>

        <View style = {{justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:17,color:'#9da554',fontWeight:'bold'}}>POINTS</Text>
        <Text style={{fontSize:17,color:'#9da554',fontWeight:'bold'}}>{score}/ {maxSpellindex}</Text>
        </View>
  <Image style = {{width:70,height:70,}} source={require('../assets/leaf.png')}/>
        </View>

        <TouchableOpacity onPress={pauseFunc} style = {styles.pausebtn}><Image source={require('../assets/pausebutton.png')} style = {{width:80,height:80}}/></TouchableOpacity>

       </View>

       :''
}
      
<Animated.View style = {[styles.displaycorrectioncon]}>

 <Animated.View style = {[{opacity:checkAnsOpacity,backgroundColor:checkAnsconColor,position:'absolute',width:wp('100%'),height:hp('23%')}]}></Animated.View>
   
       { isViewSpellCorrect ?  

          <>      
       <LinearGradient
        start={{ x: 0, y: 0 }}              
          end={{ x: 1, y: 1 }}    
        colors={isSpellCorrectDis === "CORRECT" ? ['#0dff72ff', '#ffa702ff', '#00ff4cff'] : ['#e93701ff', '#ffa702ff', '#ff0000ff']}
        style = {styles.checkanscon}
        >
       <Image source={require('../assets/leaf2.png')} style = {styles.checkansdes}/>
       <Text style = {{fontSize:15,fontWeight:'bold',color:'white'}}>{isSpellCorrectDis}</Text>
        <Image source={require('../assets/leaf2.png')} style = {styles.checkansdes}/>
        </LinearGradient>

          <LinearGradient
                 colors={['#f2f6ffff', '#23f0abff', '#f2f6ffff']}
                 style={styles.correctspellingcon}            
                 start={{ x: 0, y: 0 }}              
                 end={{ x: 1, y: 1 }}                     
                ><Text style = {styles.correctspellingtext}> Spelling: {correctSpellDis}</Text></LinearGradient> 
        </>


        :
        <>
       
       <View style = {[styles.imageanscon]}>
        <Image style = {{width:100,height:100}} source={{uri:targetWordImg}}/>
        </View>
         </>
          }
      
     
</Animated.View>

{/* spelling meaning modal */}
<Modal
 transparent={true}
 visible={isViewSpellCorrect}
 animationType='slide'
>
  <View style = {styles.meaningmodalcon}>

  <View style = {styles.meaningcon}>

  <Text style = {{fontSize:19}}>{spellMeaningDis}</Text>
  </View>

  </View>

</Modal>


        {/* <Text>{isShoot}</Text> */}
         {/*  fruit letter 1 */}
  
         <AnimatedImageBackground     
          source={require('../assets/Apple.png')}
         style = {[styles.fruit,
         { 
            transform:[
          {translateY:fruitY},
          {translateX:fruitX},
          { rotate: rotationFruit },
            ],
          opacity:fruitOpacity
      } ,
       
      ]}>
      <Text style = {{fontSize:20,left:30,top:35,color:'white',fontWeight:'bold'}}>{fruitLetter}</Text>


      </AnimatedImageBackground>

      {/* fruit letter 2 */}

       <AnimatedImageBackground   
        source={require('../assets/Orange.png')}   
         style = {[styles.fruit,
         { 
            transform:[
          {translateY:fruitY2},
          {translateX:fruitX2},
           { rotate: rotationFruit },
            ],
            opacity:fruitOpacity2 
      },
          
      ]}><Text style = {{fontSize:20,left:30,top:35,color:'white',fontWeight:'bold'}}>{fruitLetter2}</Text>
      </AnimatedImageBackground>

      {/* fruit letter 3 */}

         <AnimatedImageBackground   
          source={require('../assets/Pear.png')}  
         style = {[styles.fruit,
         { 
            transform:[
          {translateY:fruitY3},
          {translateX:fruitX3},
           { rotate: rotationFruit },
            ],  
            opacity:fruitOpacity3 
      },
            
      ]}>
      <Text style = {{fontSize:20,left:30,top:35,color:'white',fontWeight:'bold'}}>{fruitLetter3}</Text>
   
      </AnimatedImageBackground>  

     


      {/* basket */}
      {/* <View style = {{flexDirection:'row',borderWidth:2}}> */}
        <Animated.View 
      
          {...panBasket.panHandlers}
        style = {[styles.basket,

        {
         transform:[
          {translateX:basketX}
            ]
        }       
        ]}>

          <Image style = {{width:93,height:93,top:25}}  source={basketImg}/>
        </Animated.View>
        {isViewSpellCorrect ? 
          <Animated.Image style = {{width:93,height:93,
           transform: [
            { translateX: moveAnimation },
            { translateY: jumpAnimation }
          ]
          }} source={localImageMap[studAssets.characterequipimg]}/>
          
          :

          ''
          }
   {/* </View> */}


        <View style = {styles.upperfloor}>
  
    <View style = {styles.spellingtf}>
     {/* <Text style={{ marginHorizontal: 5, fontSize: 24 }}>SAMPLE</Text>  */}
     {collectedWord.map((element,index)=>(
        <Text style={{ marginHorizontal: 5, fontSize: 24, color:'white',fontWeight:'bold' }}>{element}</Text> 
         ))
     } 
     </View>
    <TouchableOpacity onPress={speakupfunc} style = {styles.speakcon}><Image style = {{width:50,height:50}} source={require('../assets/volumeicon.png')}/></TouchableOpacity>
      </View> 
       
   

        {/* <View style = {styles.lowerfloor}>

        </View> */}

        {/* modal result and rankings */}

        
      

        <Modal  
        transparent={true}
        visible={viewResult}
          animationType='none'
        >

        <View style = {styles.overlayContainer}>

        <ImageBackground
        source={require('../assets/resultbg.png')}
        style = {styles.resultPanel}
        resizeMode="cover"
        >

        <View style = {styles.modaltxtresultcon}>
          <Text style = {{fontSize:40,fontWeight:'bold',color:'white'}}>R E S U L T</Text>
        </View>

        <View style = {{justifyContent:'center',alignItems:'center',rowGap:20}}>
        
        <View style = {styles.scoredescon}>
          <Text style = {{fontSize:20,fontWeight:'bold'}}>  Score:{score}/{maxSpellindex}</Text>
          </View>

          <View style = {styles.scoredescon}>
          <Text style = {{fontSize:20,fontWeight:'bold'}}> Accuracy: {((score / maxSpellindex) * 100).toFixed(0)}%</Text>
         </View>


          <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
         {progressResultColor !== "perfect" ? <Progress.Bar progress={maxSpellindex > 0 ? score/maxSpellindex : 0} width={wp('50%')} height={40} color={progressResultColor}/> : <Text>PERFECTTTT!!</Text>}
          {/* <Image style = {{width:120,height:120}} source={rankImage}/> */}
          </View>
          {/* <View style = {styles.rankdisplaycon}>
          <Text style = {{fontSize:17,fontWeight:'700'}}>R A N K : <Text style = {{fontSize:23,fontWeight:'bold'}}>{rankText}</Text></Text>
          </View> */}

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
        </>
    )
}

const styles = StyleSheet.create({

     container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
    alignItems: 'center',
     },
     lowerfloor:{
        width:wp('100%'),
        height:hp('25%'),
        backgroundColor:'lightblue',
        flexDirection:'row',
        alignContent:"center",
        alignItems:'center'
     },
      upperfloor:{
        width:wp('100%'),
        height:hp('15%'),
          flexDirection:'row',
        alignContent:"center",
        alignItems:'center',
        // borderWidth:2
        
        // opacity:0,
        // backgroundColor:'blue'
     },
     scorepausecon:{
      width:wp('100%'),
      height:hp('15%'),
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      columnGap:30
     
      // bottom:hp('18%'),
      // left:wp('28%')
     },
     scorecon:{
      width:wp('50%'),
      height:hp('7%'),
      borderWidth:2,
      borderColor:'#3e4216ff',
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      backgroundColor:'#f1ff70',
      columnGap:5,

     
     },
     displaycorrectioncon:{
      width:wp('100%'),
      height:hp('23%'),
      rowGap:20,
      // borderWidth:2,
      justifyContent:'center',
      alignItems:'center'
     },
     basket:{
        width:90,
        height:90,
        // paddingBottom:20
        // backgroundColor:'brown',
     },
     fruit:{
        width:90,
        height:90,
        // backgroundColor:'red',
     },
     resultPanel:{
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
     collectedWordContainer: {
    flexDirection: 'row', // Arrange letters horizontally
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background for readability
    alignItems: 'center', // Align items if they have different heights
    justifyContent: 'center', // Center the row of letters
  },
  spellingtf:{
    width:wp('70%'),
    height:hp('6%'),
    borderWidth:3,
    left:hp('6%'),
    paddingLeft:60,
    flexDirection:'row',
    borderRadius:20,
    borderColor:'white',
    backgroundColor:'#467845'
  },
  checkanscon:{
    width:wp('40%'),
    height:hp('7%'),
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderRadius:20,
    columnGap:20,
    borderColor:'white',
    flexDirection:'row',
    backgroundColor:'#467845',
  },
   imageanscon:{
    width:wp('40%'),
    height:hp('15%'),
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderRadius:20,
    columnGap:20,
    borderColor:'white',
    flexDirection:'row',
       borderColor:'#347033ff',
    backgroundColor:'#3de43aff',
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
  profilepic:{
    width:60,
    height:60,
    borderRadius:20,
    borderWidth:2,
    borderColor:'blue',
    backgroundColor:'white'
  },

  pausebtn:{
    width:50,
    height:50,
    // backgroundColor:'lightblue',
    justifyContent:'center',
    alignItems:'center'
  },
  correctspellingcon:{
    width:'auto',
    height:hp('7%'),
    borderWidth:2,
    borderColor:'blue',
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'lightblue'
  },
  correctspellingtext:{
    fontSize:20,
    color:'blue',
    fontWeight:'bold'
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
   backgroundColor:'white',
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
  pausepaneltxt:{
    // bottom:55,
    fontSize:40,
    color:'blue',
    fontWeight:'bold'
  },
  checkansdes:{
    width:60,
    height:60
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
  meaningmodalcon:{
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    flex:1
  },
  meaningcon:{
    width:wp('90%'),
    height:hp('15%'),
    backgroundColor:'#0ae94dff',
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    borderRadius:20,
    borderColor:'#347033ff'
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
 
});

export default memo(IngameFruit);