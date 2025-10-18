import {AppState,BackHandler,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View, KeyboardAvoidingView } from 'react-native';
import React, { useCallback,useRef,useContext, useState , useEffect} from 'react';
import { useFocusEffect,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import Icon from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import LottieView from 'lottie-react-native';
import { Timestamp } from "firebase/firestore";
import Toast from 'react-native-toast-message';

const CategoriesChoose=()=>{

    const navigation = useNavigation();

    //home btn func

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

           
            Toast.show({
             type:'error',
           text1:'Disconnected',
           text2:'You automatically leave the playroom',
         visibilityTime: 4000,
             })

           setjoinActive(false)
           leaveroomFunc()
           navigation.replace('mainscreen')
          

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
            
                 leaveroomFunc()
                  return true; 
               
                 
                  
             };
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
             return () => backHandler.remove();    
           }, [])
         );

    
     //context state for ingame

        const {studProfile,setstudProfile}=useContext(MyStorage)

            const {joinActive,setjoinActive}=useContext(MyInGameStor)
          const {roomInformation,setroomInformation}=useContext(MyInGameStor);
          const {categoryFilter,setcategoryFilter}=useContext(MyInGameStor); 
          const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);
          const {categoryAvailIndex,setcategoryAvailIndex}=useContext(MyInGameStor);
          const {categoryAvailCurrIndex,setcategoryAvailCurrIndex}=useContext(MyInGameStor);
          //category check
          const [fruitgameCheck,setfruitgameCheck]=useState(false)
          const [secondgameCheck,setsecondgameCheck]=useState(false)
          const [thirdgameCheck,setthirdgameCheck]=useState(false)
          // const [situationalCheck,setsituationalCheck]=useState(false)

          //category progress check

          const {isFruitgameProgressed,setisFruitgameProgressed}=useContext(MyInGameStor)
          const {isSecondgameProgressed,setisSecondgameProgressed}=useContext(MyInGameStor)
          const {isThirdgameProgressed,setisThirdgameProgressed}=useContext(MyInGameStor)
          // const {isSituationalProgressed,setisSituationalProgressed}=useContext(MyInGameStor)
          //game difficulty setter
            const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor)

          //modal difficulty

          const [modalDifficulty,setmodalDifficulty]=useState(false);

          //difficulty progress current on a gameplay

          const [difficultyCurrEasy,setdifficultyCurrEasy]=useState(false)
          const [difficultyCurrMedium,setdifficultyCurrMedium]=useState(false)
          const [difficultyCurrHard,setdifficultyCurrHard]=useState(false)
          //spelling difficulty availability

        const [spellingEasy,setspellingEasy]=useState(false);
        const [spellingMedium,setspellingMedium]=useState(false);
        const [spellingHard,setspellingHard]=useState(false);

          //grammar difficulty availability

        const [grammarEasy,setgrammarEasy]=useState(false);
        const [grammarMedium,setgrammarMedium]=useState(false);
        const [grammarHard,setgrammarHard]=useState(false);

        //spelling progress difficulty

        const [spellingProgressEasy,setspellingProgressEasy]=useState(false);
        const [spellingProgressMedium,setspellingProgressMedium]=useState(false);
        const [spellingProgressHard,setspellingProgressHard]=useState(false);

      //grammar progress difficulty

      const [grammarProgressEasy,setgrammarProgressEasy]=useState(false);
        const [grammarProgressMedium,setgrammarProgressMedium]=useState(false);
        const [grammarProgressHard,setgrammarProgressHard]=useState(false);


          const[isProgressCatAll,setisProgressCatAll]=useState(false)
          //toggle loading state............................

        const [LoadingPanel,setLoadingPanel]=useState(false)


         //game id value 
         const {gameTypeVal,setgameTypeVal}=useContext(MyInGameStor)
         //analytics docid

         const {analyticsDocid,setanalyticsDocid}=useContext(MyInGameStor);
          const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor)
        //functions....

        //

      
      useEffect(()=>{  

        console.log("teacherid",roomInformation.teacherid)
        
          //set available categories for the room
        const quescat = async () =>{

          setLoadingPanel(true)
           //category availability check................

           try{
           const joinroomActivegamedblist = firestore().collection('joinroom-activegame')
           const getjroomActivegame = await joinroomActivegamedblist
           .where('roomcode','==',roomInformation.roomcode)
           .where('teacherid','==',roomInformation.teacherid)
           .get()

           const searchjoinroomActive = getjroomActivegame.docs.map(doc=>({
              id:doc.id,
              ...doc.data(),
           }))
          

           //check gameplay availability statud

           //if fruit game is available from specific room

           if(searchjoinroomActive[0].activefruitcatcher === true){
               console.log(" Fruit Catch found")
             setfruitgameCheck(true)
              //  newAvail += 1;
             setcategoryAvailIndex(prev => prev + 1)
           }


           //if second game is available from specific room

             if(searchjoinroomActive[0].activesecondgame === true){
               console.log(" second game found")
             setsecondgameCheck(true)
              //  newAvail += 1;
             setcategoryAvailIndex(prev => prev + 1)
           }

           //if third game is available from specific room

             if(searchjoinroomActive[0].activethirdgame === true){
               console.log(" third game found")
             setthirdgameCheck(true)
              //  newAvail += 1;
             setcategoryAvailIndex(prev => prev + 1)
           }


           //check gameplay difficulty availability status

           var gramprogeasy = false
           var gramprogmedium = false
           var gramproghard = false

           
           var spellprogeasy = false
           var spellprogmedium = false
           var spellproghard = false

            if(searchjoinroomActive[0].spellingeasy === true){
                setspellingEasy(true)
                //for first time setting up spelling easy progress (when player is new from the room)
                // setspellingProgressEasy(true)
              console.log("spelling easy found")
           }else{
            spellprogeasy = true
           }
           
            if(searchjoinroomActive[0].spellingmedium === true){
                 setspellingMedium(true)
                  //for first time setting up spelling medium progress (when player is new from the room)
                //  setspellingProgressMedium(true)
              console.log("spelling medium found")
           }else{
             spellprogmedium = true
           }
            if(searchjoinroomActive[0].spellinghard === true){
                 setspellingHard(true)
                  //for first time setting up spelling hard progress (when player is new from the room)
                  //  setspellingProgressHard(true)
              console.log("spelling hard found")
           }else{
             spellproghard = true
           }


           if(searchjoinroomActive[0].grammareasy === true){
              setgrammarEasy(true)
               //for first time setting up grammar easy progress (when player is new from the room)
                // setgrammarProgressEasy(true)
              console.log("grammar easy found")
           }else{
             gramprogeasy = true
           }
            if(searchjoinroomActive[0].grammarmedium === true){
              setgrammarMedium(true)
                //for first time setting up grammar medium progress (when player is new from the room)
                //  setgrammarProgressMedium(true)
              console.log("grammar medium found")
           }else{
             gramprogmedium = true
           }
            if(searchjoinroomActive[0].grammarhard === true){
              setgrammarHard(true)
               //for first time setting up grammar hard progress (when player is new from the room)
                  //  setgrammarProgressHard(true)
              console.log("grammar hard found")
           }else{
             gramproghard = true
           }


           

                //get analytics docid

                const analyticsdblist = firestore().collection('analytics')
                const getanalytics = await analyticsdblist
                .where('studentid','==',studProfile.studentID)
                .get()

                const searchanalytics = getanalytics.docs.map(doc=>({
                  id:doc.id,
                  ...doc.data()
                }))

                setanalyticsDocid(searchanalytics[0].id)

              //get player assets docid

              
     const playerassetdblist = firestore().collection('player-assets')
    const getplayerasset = await playerassetdblist
    .where('studentid','==',studProfile.studentID)
    .get()

    const searchplayerasset = getplayerasset.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))

    setplayerAssetsDocid(searchplayerasset[0].id)

                  //check progress of a certain student...............

                   const joinroomprogdblist = firestore().collection('joinroom-progress')

                 let studentholdid = Number(studProfile.studentID)
                 const getjoinroomprog = await joinroomprogdblist
                 .where('studentid','==',studProfile.studentID)
                 .where('joinroom','==',roomInformation.roomcode)
                 .where('teacherid','==',roomInformation.teacherid)
                 .limit(1)
                 .get()

                 const searchjoinroomprog = getjoinroomprog.docs.map(doc=>(({
                     id:doc.id,
                  ...doc.data(),
                 })))



                 if(searchjoinroomprog.length === 0){ //if new player enters the room, generate progress sheet 
                   firestore()
                   .collection('joinroom-progress').doc(uuid.v4())
                   .set({
                    isdone:false,
                    isfruitgamecompleted:searchjoinroomActive[0].activefruitcatcher === true ? false : true,
                    issecondgamecompleted:searchjoinroomActive[0].activesecondgame === true ? false : true,
                    isthirdgamecompleted:searchjoinroomActive[0].activethirdgame === true ? false : true,
                    joinroom:roomInformation.roomcode,
                    teacherid:roomInformation.teacherid,
                    studentid:studProfile.studentID,
                    studentname:studProfile.username,
                    scoregrammar:10,
                    maxscoregrammar:10,
                    scorespelling:10,
                    maxscorespelling:10,
                    scorecomprehension:10,
                    maxscorecomprehension:10,
                    grammarprogeasy:searchjoinroomActive[0].grammareasy === true ? false : true,
                    grammarprogmedium:searchjoinroomActive[0].grammarmedium === true ? false : true,
                    grammarproghard:searchjoinroomActive[0].grammarhard === true ? false : true,
                    spellingprogeasy:searchjoinroomActive[0].spellingeasy === true ? false : true,
                    spellingprogmedium:searchjoinroomActive[0].spellingmedium === true ? false : true,
                    spellingproghard:searchjoinroomActive[0].spellinghard === true ? false : true


                   }).then(async()=>{
                    //notifcation first timers

                   firestore()
                   .collection('notification').doc()
                   .set({
                    gradelevel:studProfile.gradelevel,
                    notification:`Student ${studProfile.firstname} ${studProfile.lastname} Entered Room ${roomInformation.roomcode} for the first time`,
                    notifdate:firestore.FieldValue.serverTimestamp(),
                    teacherid:roomInformation.teacherid
                   })
                   })

                   //set grammar diffculty right away for first time taker

                    setgrammarProgressEasy(searchjoinroomActive[0].grammareasy === true ? false : true)
                     setgrammarProgressMedium(searchjoinroomActive[0].grammarmedium === true ? false : true)
                      setgrammarProgressHard(searchjoinroomActive[0].grammarhard === true ? false : true)

                      console.log("------------Grammar progress for first time taker-------------------")
                      console.log(searchjoinroomActive[0].grammareasy === true ? false : true)
                      console.log(searchjoinroomActive[0].grammarmedium === true ? false : true)
                      console.log(searchjoinroomActive[0].grammarhard === true ? false : true)
                  //set spelling difficulty right away for first time taker

                  setspellingProgressEasy(searchjoinroomActive[0].spellingeasy === true ? false : true)
                  setspellingProgressMedium(searchjoinroomActive[0].spellingmedium === true ? false : true)
                  setspellingProgressHard(searchjoinroomActive[0].spellinghard === true ? false : true)


                   console.log("------------Spelling progress for first time taker-------------------")
                   console.log(searchjoinroomActive[0].spellingeasy === true ? false : true)
                      console.log(searchjoinroomActive[0].spellingmedium === true ? false : true)
                      console.log(searchjoinroomActive[0].spellinghard === true ? false : true)
                 }

           
                 if(searchjoinroomprog.length > 0){

                  //check gameplay completion status

                  const isfruitgamecompleted = searchjoinroomprog[0].isfruitgamecompleted
                  const issecondgamecompleted = searchjoinroomprog[0].issecondgamecompleted
                   const isthirdgamecompleted = searchjoinroomprog[0].isthirdgamecompleted

                   const activefirstgame = searchjoinroomActive[0].activefruitcatcher
                   const activesecondgame = searchjoinroomActive[0].activesecondgame
                   const activethirdgame = searchjoinroomActive[0].activethirdgame
            
                    setisFruitgameProgressed(isfruitgamecompleted)
                    setisSecondgameProgressed(issecondgamecompleted)
                    setisThirdgameProgressed(isthirdgamecompleted)


                    if(isfruitgamecompleted === true && activefirstgame === true){
                      setcategoryAvailCurrIndex(prev => prev + 1)
                      console.log("completed fruit")
                    }
                    if(issecondgamecompleted === true && activesecondgame === true){
                      setcategoryAvailCurrIndex(prev => prev + 1)
                        console.log("completed drag drop")
                    }
                    if(isthirdgamecompleted === true && activethirdgame === true){
                       setcategoryAvailCurrIndex(prev => prev + 1)
                        console.log("completed harvest drop")
                    }

                    //check each gameplay difficulty status (when player have a record in the room)

                     const isgrameasy = searchjoinroomprog[0].grammarprogeasy
                  const isgrammedium = searchjoinroomprog[0].grammarprogmedium
                   const isgramhard = searchjoinroomprog[0].grammarproghard

                    const isspelleasy = searchjoinroomprog[0].spellingprogeasy
                  const isspellmedium = searchjoinroomprog[0].spellingprogmedium
                   const isspellhard = searchjoinroomprog[0].spellingproghard
                   if(isgrameasy === true){
                        setgrammarProgressEasy(true)
                   }
                    if(isgrammedium === true){
                          setgrammarProgressMedium(true)
                   }
                    if(isgramhard === true){
                          setgrammarProgressHard(true)
                   }

                      if(isspelleasy === true){
                          setspellingProgressEasy(true)
                   }
                    if(isspellmedium === true){
                           setspellingProgressMedium(true)
                   }
                    if(isspellhard === true){
                           setspellingProgressHard(true)
                   }

                  
                 }

                }

                catch(e){
                   Alert.alert(
                   "Nope",
                   `Error ${e}`
                 )

                }

              setLoadingPanel(false)
            
               }
          
               quescat()
      },[])

      //check progress of student in a certain room 
      useEffect(()=>{

        const checkProgress=async()=>{
        
                    const joinroomprogdblist = firestore().collection('joinroom-progress')

                 let studentholdid = Number(studProfile.studentID)
                 const getjoinroomprog = await joinroomprogdblist
                 .where('studentid','==',studProfile.studentID)
                 .where('joinroom','==',roomInformation.roomcode)
                 .where('teacherid','==',roomInformation.teacherid)
                 .limit(1)
                 .get()

                 const searchjoinroomprog = getjoinroomprog.docs.map(doc=>(({
                     id:doc.id,
                  ...doc.data(),
                 })))

                 console.log("categoryAvailCurrIndex" + categoryAvailCurrIndex)
                 console.log("categoryAvailIndex"+ categoryAvailIndex)

                //  if( categoryAvailIndex > 0 && categoryAvailCurrIndex === categoryAvailIndex){
                //     setisProgressCatAll(true)
                
                //   }
                //   else{
                //      setisProgressCatAll(false)
                //   }

                if(searchjoinroomprog[0].isfruitgamecompleted && searchjoinroomprog[0].issecondgamecompleted && searchjoinroomprog[0].isthirdgamecompleted){
                  setisProgressCatAll(true)
                }
                else(
                  setisProgressCatAll(false)
                )


             

                
                }

                checkProgress()
              

      },[categoryAvailIndex, categoryAvailCurrIndex])

      const [gameFordifficulty,setgameFordifficulty]=useState("")
       
      //difficulty selector

      const difficultySelector=async(gamemode)=>{

        setmodalDifficulty(true)

          // const joinroomprogdblist = firestore().collection('joinroom-progress')

          //        let studentholdid = Number(studProfile.studentID)
          //        const getjoinroomprog = await joinroomprogdblist
          //        .where('studentid','==',studProfile.studentID)
          //        .where('joinroom','==',roomInformation.roomcode)
          //        .limit(1)
          //        .get()

          //        const searchjoinroomprog = getjoinroomprog.docs.map(doc=>(({
          //            id:doc.id,
          //         ...doc.data(),
          //        })))


        if(gamemode === "spelling"){
          
          setgameFordifficulty("spelling")
          console.log(spellingProgressEasy)
          setdifficultyCurrEasy(spellingProgressEasy)
          setdifficultyCurrMedium(spellingProgressMedium)
          setdifficultyCurrHard(spellingProgressHard)
        }
        else if(gamemode === "grammar"){

            setdifficultyCurrEasy(grammarProgressEasy)
            console.log(grammarProgressEasy)
          setdifficultyCurrMedium(grammarProgressMedium)
          setdifficultyCurrHard(grammarProgressHard)
          setgameFordifficulty("grammar")
        }
        
      }

      const gameStartNow=()=>{
        if(gameFordifficulty === "spelling"){
          fruitgamebtnFunc()
        }
        else if(gameFordifficulty === "grammar"){
          secondgamebtnFunc()
        }
      }

     
                   
        //grammarbtn func

      const fruitgamebtnFunc=async()=>{

         SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

        //get progress of player for referecing docid later
         const joinroomprogdblist = firestore().collection('joinroom-progress');
         const joinroomget = await joinroomprogdblist
         .where('studentid','==',studProfile.studentID)
         .where('joinroom','==',roomInformation.roomcode)
         .get()

         const searchprogress = joinroomget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))
      

           //joinroom-activegame get game value
         const activegamedblist = firestore().collection('joinroom-activegame')
         const activegameget = await activegamedblist
         .where('roomcode','==',roomInformation.roomcode)
         .get()

         const searchactivegame = activegameget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))

        setgameTypeVal(searchactivegame[0].fruitcatcherval)
        setcategoryProgDoc(searchprogress[0].id)
        setcategoryFilter("fruitgame")
        navigation.replace('ingamefruit')

      }
      //vocabularybtn func
      const secondgamebtnFunc=async()=>{

         SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

         //get progress of player for referecing docid later
         const joinroomprogdblist = firestore().collection('joinroom-progress');
         const joinroomget = await joinroomprogdblist
         .where('studentid','==',studProfile.studentID)
         .where('joinroom','==',roomInformation.roomcode)
         .get()

         const searchprogress = joinroomget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))

           //joinroom-activegame get game value
         const activegamedblist = firestore().collection('joinroom-activegame')
         const activegameget = await activegamedblist
         .where('roomcode','==',roomInformation.roomcode)
         .get()

         const searchactivegame = activegameget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))

        setgameTypeVal(searchactivegame[0].secondgameval)
        setcategoryProgDoc(searchprogress[0].id)
        setcategoryFilter("grammargame")
        navigation.replace('ingamegrammardrag')
      }

      //comprehensionbtn func
      const thirdgamebtnFunc=async()=>{

     SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

      const joinroomprogdblist = firestore().collection('joinroom-progress');
         const joinroomget = await joinroomprogdblist
         .where('studentid','==',studProfile.studentID)
         .where('joinroom','==',roomInformation.roomcode)
         .get()

         const searchprogress = joinroomget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))

           //joinroom-activegame get game value
         const activegamedblist = firestore().collection('joinroom-activegame')
         const activegameget = await activegamedblist
         .where('roomcode','==',roomInformation.roomcode)
         .get()

         const searchactivegame = activegameget.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
         }))

          setgameTypeVal(searchactivegame[0].thirdgameval)
        setcategoryProgDoc(searchprogress[0].id)
        setcategoryFilter("readinggame")
        navigation.replace('ingamereading')
        
      }
   

      
    //leave room func...

    const [playerDocuid,setplayerDocuid]=useState("")

    // useEffect(()=>{
    //   if(joinActive === false){
    //      firestore()
    //         .collection('joinroom-list')
    //         .doc(playerDocuid)
    //        .delete()
    //     }
    // },[joinActive])

    const leaveroomFunc=async()=>{
       SoundPlayer.playAsset(require("../assets/sounds/clickedOut.mp3"))
        setcategoryAvailCurrIndex(0)
        setcategoryAvailIndex(0)
        setanalyticsDocid("")
        setplayerAssetsDocid("")
         setisFruitgameProgressed(false)
         setisSecondgameProgressed(false)
         setisThirdgameProgressed(false)
            setdifficultyCurrEasy(false)
          setdifficultyCurrMedium(false)
          setdifficultyCurrHard(false)

          
           
           
      const joinroomlistdb = firestore().collection('joinroom-list');

            //search player in joinroom-list first before triggering deletion effect
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


           //remove player from the room
           setplayerDocuid(searchjoinroomlist[0].uid)
             setroomInformation({}) 
             setjoinActive(false) 
            navigation.replace('joinroom')
    }


    const closeDifficultyFunc=()=>{
    
          setmodalDifficulty(false)
          setinGameDifficulty("")
          setgameFordifficulty("")
          setdifficultyCurrEasy(false)
          setdifficultyCurrMedium(false)
          setdifficultyCurrHard(false)
     
    }
      // const allProgressedCat = !isGrammarProgressed && !isSituationalProgressed && !isVocabularyProgressed 
    return(

        <>

 
       <ImageBackground source={require('../assets/dashboardmainpage.png')} style={styles.container}>  
       
        {!LoadingPanel ? 
        <View>
        
        {!isProgressCatAll ?
       <View>
      <Text style={styles.title}>Choose a Game</Text>
       </View>

       :

       
      <Text style={[styles.title,{fontSize:28}]}>Assessment completed</Text>

        }
        
    </View>
        :

        ''

        }



   {!LoadingPanel ? <View style = {styles.subcontainer}>

 {!isProgressCatAll ? <View style = {{rowGap:30}}>
 
  {fruitgameCheck ? <TouchableOpacity 
      style={!isFruitgameProgressed ? [styles.button,{backgroundColor:'#A2D572'}] : [styles.button,{backgroundColor:'#b180d8ff',borderWidth:2,borderColor:'lightgreen'}]}
       disabled={isFruitgameProgressed}
       onPress={()=>difficultySelector("spelling")}>
       {/* <View style = {styles.gamemodeTxtCon}> */}
        <Text style={styles.buttonText}>{isFruitgameProgressed ? "FINISHED" : "FRUIT BASKET"}</Text>
       <View style = {styles.difficultyProgCon}>
       <Text style = {styles.progmetertxt}>Level Progress: </Text>
       <View style = { !spellingProgressEasy ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       <View style = { !spellingProgressMedium ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       <View style = { !spellingProgressHard ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       </View>
        {/* </View> */}
      </TouchableOpacity> : null
      }

      {secondgameCheck ? <TouchableOpacity
       style={!isSecondgameProgressed ? [styles.button,{backgroundColor:'#F18F8F'}] : [styles.button,{backgroundColor:'#b180d8ff'}]}
       onPress={()=>difficultySelector("grammar")}
      disabled={isSecondgameProgressed}
          >
       
     <Text style={styles.buttonText}>{isSecondgameProgressed ? "FINISHED" : "WORD MATCH"}</Text>
      <View style = {styles.difficultyProgCon}>
       <Text style = {styles.progmetertxt}>Level Progress: </Text>
       <View style = { !grammarProgressEasy ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       <View style = { !grammarProgressMedium ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       <View style = { !grammarProgressHard ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
 
     </View>
      </TouchableOpacity> : null}

       {thirdgameCheck ? <TouchableOpacity
       style={!isThirdgameProgressed ? [styles.button,{backgroundColor:'#5dd4c1ff'}] : [styles.button,{backgroundColor:'#b180d8ff'}]}
       onPress={thirdgamebtnFunc}
      disabled={isThirdgameProgressed}
          >
          {/* <View style = {styles.gamemodeTxtCon}> */}
     <Text style={styles.buttonText}>{isThirdgameProgressed ? "FINISHED" : "READVENTURE"}</Text>
      <View style = {styles.difficultyProgCon}>
       <Text style = {styles.progmetertxt}>Achieve: </Text>
       <View style = { !isThirdgameProgressed ? styles.difficultyProg : [styles.difficultyProg,{backgroundColor:'yellow'}]}></View>
       </View>
     {/* </View> */}
      </TouchableOpacity> : null}

      </View>
       : 
       <View style = {styles.finishcontainer}>

      
     <Image style = {{width:290,height:130}} source={require('../assets/welldonelogo.png')}/>
     <Image style = {{width:200,height:200}} source={require('../assets/characterwelldone.png')}/>
      
       </View>
       }


      <TouchableOpacity 
      style={styles.Exitbutton}
       onPress={leaveroomFunc}>
        <Text style={styles.buttonText}>LEAVE ROOM</Text>
      </TouchableOpacity>

    
    </View> : 
  
    <View style = {[styles.subcontainer]}>
             <LottieView
              style={styles.Loadingimg}
              source={require('../assets/loadinganimation1.json')}
              loop={true}
              autoPlay
                  />
    
            <View style = {{width:wp('80%'),backgroundColor:'#6DAB74',alignContent:'center',alignItems:'center',borderRadius:20}}>
    <Text style = {{fontSize:30,color:'white',fontWeight:'bold',color:'white',}}>LOADING..........</Text>
      </View>

    </View>}

    <Modal
     transparent
        animationType='slide'
        visible={modalDifficulty}
        onRequestClose={()=>{
         closeDifficultyFunc()
        }}
    >
 <View style={styles.overlayContainer}>
     <Animated.View
              style={styles.difficultymodal}
              >

              {/* for difficulty easy */}
            {grammarEasy === true && gameFordifficulty === "grammar" ? 
             <TouchableOpacity
                  onPress={()=>{
                    gameStartNow()
                    setinGameDifficulty("easy")
                  }}
                  style={styles.difficultybtn}>
                  <Text style={[styles.buttonText,{color:'blue'}]}>EASY</Text>
                  <Text style = {styles.noteDiffstatus}>{!difficultyCurrEasy ? 'In Progress' : 'Completed'}</Text>
                </TouchableOpacity>
            : null }

            {spellingEasy === true && gameFordifficulty === "spelling" ? 
             <TouchableOpacity
                  onPress={()=>{
                    gameStartNow()
                    setinGameDifficulty("easy")
                  }}
                  style={styles.difficultybtn}>
                  <Text style={[styles.buttonText,{color:'blue'}]}>EASY</Text>
                   <Text style = {styles.noteDiffstatus}>{!difficultyCurrEasy ? 'In Progress' : 'Completed'}</Text>
                </TouchableOpacity>
            : null }

                 {/* for difficulty medium */}

                 {grammarMedium === true && gameFordifficulty === "grammar" ? 
                 <TouchableOpacity
                 disabled={!difficultyCurrEasy}
                  onPress={()=>{
                    gameStartNow()
                    setinGameDifficulty("medium")
                  }}
                  style={difficultyCurrEasy ? styles.difficultybtn :[ styles.difficultybtn,{backgroundColor:'#F18F8F'}]}>
                  {difficultyCurrEasy ? 
                  <>
                  <Text style={[styles.buttonText,{color:'blue'}]}>INTERMEDIATE</Text>
                  <Text style = {styles.noteDiffstatus}>{!difficultyCurrMedium ? 'In Progress' : 'Completed'}</Text>
                  </>
                  :
                   <Text style={[styles.buttonText,{color:'White'}]}>LOCKED</Text>
                  }
                </TouchableOpacity>
                : null }

                 {spellingMedium === true && gameFordifficulty === "spelling" ? 
                 <TouchableOpacity
                   disabled={!difficultyCurrEasy}
                  onPress={()=>{
                    gameStartNow()
                    setinGameDifficulty("medium")
                  }}
                  style={difficultyCurrEasy ? styles.difficultybtn :[ styles.difficultybtn,{backgroundColor:'#F18F8F'}]}>
                  {difficultyCurrEasy ? 
                  <>
                  <Text style={[styles.buttonText,{color:'blue'}]}>INTERMEDIATE</Text>
                  <Text style = {styles.noteDiffstatus}>{!difficultyCurrMedium ? 'In Progress' : 'Completed'}</Text>
                  </>
                  :
                   <Text style={[styles.buttonText,{color:'White'}]}>LOCKED</Text>
                  }
                </TouchableOpacity>
                : null }


                     {/* for difficulty hard */}

                   {grammarHard === true && gameFordifficulty === "grammar" ? 
                 <TouchableOpacity
                 disabled={!difficultyCurrMedium}
                  onPress={()=>{
                    gameStartNow()
                     setinGameDifficulty("hard")
                  }}
                   style={difficultyCurrMedium ? styles.difficultybtn :[ styles.difficultybtn,{backgroundColor:'#F18F8F'}]}>
                  {difficultyCurrMedium ?
                  <>
                  <Text style={[styles.buttonText,{color:'blue'}]}>ADVANCED</Text>
                  <Text style = {styles.noteDiffstatus}>{!difficultyCurrHard ? 'In Progress' : 'Completed'}</Text>
                  </>
                  :
                  <Text style={[styles.buttonText,{color:'White'}]}>LOCKED</Text>
                   }
                </TouchableOpacity>
              : null}

                
                     {spellingHard === true && gameFordifficulty === "spelling" ? 
                     <TouchableOpacity
                  disabled={!difficultyCurrMedium}
                  onPress={()=>{
                    gameStartNow()
                     setinGameDifficulty("hard")
                  }}
                 style={difficultyCurrMedium ? styles.difficultybtn :[ styles.difficultybtn,{backgroundColor:'#F18F8F'}]}>
                  {difficultyCurrMedium ?
                  <>
                  <Text style={[styles.buttonText,{color:'blue'}]}>ADVANCED</Text>
                  <Text style = {styles.noteDiffstatus}>{!difficultyCurrHard ? 'In Progress' : 'Completed'}</Text>
                  </>
                  :
                  <Text style={[styles.buttonText,{color:'White'}]}>LOCKED</Text>
                   }
                </TouchableOpacity>
                : null }

                <TouchableOpacity style = {styles.backdiffbutton} onPress={()=>closeDifficultyFunc()}>
                <Text style = {{fontWeight:'bold'}}>Back</Text>
                </TouchableOpacity>

                <View style = {{flexDirection:'row',width:wp('80%'),padding:10,columnGap:10,justifyContent:'center',alignItems:'center'}}>
                <Image source = {require('../assets/ms.trixie.png')} style = {{width:50,height:50,borderWidth:2,borderRadius:20,borderColor:'green'}}/>
                <Text style = {{fontWeight:'bold',fontSize:16}}>Main Task: Complete all Levels</Text>
               </View>

              </Animated.View>
  </View>
    </Modal>

     </ImageBackground>
        </>
    );

};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#797ef4', // Light gray background
        rowGap:30
      },

      subcontainer:{
         justifyContent: 'center',
        alignItems: 'center',
         backgroundColor: 'rgba(185, 204, 119, 0.5)', 
         borderWidth:2,
         borderColor:'darkgreen',
         borderRadius:30,
         height:hp('60%'),
         width:wp('90%')
      },
      title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333', // Dark text color
      },
       overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // background dim
    justifyContent:'center',
    alignItems:'center',
   
  },
      button: {
   
        borderRadius: 10,
        width: wp('80%'),
        height:hp('10%'),
        justifyContent:'center',
        alignItems:'center',
        rowGap:10,
        elevation: 5, // Subtle shadow
      },
      buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff', 
        // White text color
      },
         backButton: {
      backgroundColor: '#0353A4',
      borderRadius: 10,
      padding: 8,
    
    },
    modifybtncon:{
      flexDirection:'row',
      columnGap:wp('10%')
    },

    Exitbutton:{
      width:200,
      height:50,
      top:30,
     justifyContent:'center',
     alignItems:'center',
        borderRadius: 20,
      backgroundColor:'#6DAB74'
    },
    turninbutton:{
       width:140,
      height:60,
      paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 15,
      backgroundColor:'blue'
    },
    Loadingimg:{
      width:300,
      height:300
    },
    finishcontainer:{
      // width:wp('80%'),
      // height:hp('25%'),
      // backgroundColor:'#8acfe7',
      justifyContent:'center',
      alignItems:'center',

      // paddingTop:50,
    },
    welldonepnl:{
      width:wp('70%'),height:hp('7%'),backgroundColor:"blue",borderRadius:20,borderWidth:2,borderColor:'white',alignItems:'center',alignContent:'center'
    },
    difficultymodal:{

    height:hp('60%'),
    width:wp('80%'),
    position: 'absolute',
    backgroundColor: '#A9B9F8',
    borderWidth:2,
    borderColor:'blue',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    rowGap:30,
      justifyContent:'center',
    alignItems:'center',

  },
   difficultybtn:{
     width:wp('55%'),
    height:60,
    justifyContent:'center',
    backgroundColor: 'lightgreen',
    borderRadius: 8,
    elevation:5,
    alignItems: 'center',
  },

  noteDiffstatus:{
    fontSize:15,
    fontWeight:'bold'
  },
  backdiffbutton:{
    width:wp('20%'),
    height:hp('7%'),

    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderRadius:20,
    backgroundColor:'#00ff00ff'
  },
  difficultyProgCon:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    columnGap:15
  },
  difficultyProg:{
    borderColor:'yellow',
    borderWidth:2,
    borderRadius:20,
    width:wp('10%'),
    height:hp('2%')
  },
  progmetertxt:{
    fontSize:16,
    fontWeight:'bold'
  }
  // gamemodeTxtCon:{
  //   flexDirection:'column',
  //   justifyContent:'center',
  //   alignItems:'center'
  // }

});
export default CategoriesChoose;