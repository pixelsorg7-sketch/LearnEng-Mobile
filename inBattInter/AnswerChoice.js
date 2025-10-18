import {useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from '../components/StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios';
import ResultPanel from './ResultPanel';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";

const AnswerChoice= ()=>{

  const {categoryAvailIndex,setcategoryAvailIndex}=useContext(MyInGameStor);
  const {categoryAvailCurrIndex,setcategoryAvailCurrIndex}=useContext(MyInGameStor);

  const {roomInformation,setroomInformation}=useContext(MyInGameStor); //room information
    const {studProfile,setstudProfile}=useContext(MyStorage)
    //category progress check
    
      const {isGrammarProgressed,setisGrammarProgressed}=useContext(MyInGameStor)
      const {isVocabularyProgressed,setisVocabularyProgressed}=useContext(MyInGameStor)
      const {isSituationalProgressed,setisSituationalProgressed}=useContext(MyInGameStor)
  // game information 
    const {ingameQues,setingameQues}=useContext(MyInGameStor) //active question
    const {quesCount,setquesCount}=useContext(MyInGameStor) //total count of questions
    const {ingameAns,setingameAns}=useContext(MyInGameStor); //active list of answers
    const {ansActModule,setansActModule}=useContext(MyInGameStor) //get answermodule id for question-answer references
    const {igCount,setigCount}=useContext(MyInGameStor); //counter till it reach the maximum number of quescount

    //temporary ans result

    const [isCorrectAns,setisCorrectAns]=useState("");

    //enable result panel if done conext

       const {showResults,setshowResults}=useContext(MyInGameStor);
       const {quesPnlRes,setquesPnlRes}=useContext(MyInGameStor);
      const {categoryFilter,setcategoryFilter}=useContext(MyInGameStor); 
      const {categoryProgDoc,setcategoryProgDoc}=useContext(MyInGameStor);
      

       //right and wrong counter context

       
      const {rightAnsscr,setrightAnsscr}=useContext(MyInGameStor);
      const {wrongAnsscr,setwrongAnsscr}=useContext(MyInGameStor);

  //   //practice enabled?
  const {inPractice,setinPractice}=useContext(MyInGameStor)
    
  //  const {ingameResult,setingameResult}=useState(MyInGameStor);

      //summary result
   
         const {totalScore,settotalScore}=useContext(MyInGameStor);

 

      //loading toggle........

      const [loadingButton,setloadingButton]=useState(false)

        const navigation = useNavigation();




   //animations....................

   const {bgquesboxPanel} = useContext(MyInGameStor);
   const {isAnswerAcceptable,setisAnswerAcceptable}=useContext(MyInGameStor);
  //  const {quesBoxColorChooser} = useContext(MyInGameStor);

const correctAndWrongAni=useCallback((value)=>{

if(value === true){

Animated.sequence([

      Animated.parallel([
        
        Animated.timing(bgquesboxPanel,{
          toValue:1,
          duration:200,
          useNativeDriver:true,
        })
       
      ]),
      Animated.delay(1000),

      Animated.parallel([

         Animated.timing(bgquesboxPanel,{
          toValue:0,
          duration:200,
          useNativeDriver:true,
        })

      ])

    ]).start(()=>{
       setloadingButton(false)
    setisAnswerAcceptable(null)
      // if(igCount < quesCount - 1){ //next queestion igcount + 
      
      //   setigCount(igCount + 1)
        
      // }

      // else{ //if maximum questions reached
          
      //    setshowResults(true)
      // }
    })
          
}

else if(value === false){

Animated.sequence([

      Animated.parallel([
        
        Animated.timing(bgquesboxPanel,{
          toValue:2,
          duration:200,
          useNativeDriver:true,
        })
       
      ]),
      Animated.delay(800),

      Animated.parallel([

         Animated.timing(bgquesboxPanel,{
          toValue:0,
          duration:200,
          useNativeDriver:true,
        })

      ])

    ]).start(()=>{
       setloadingButton(false)
      setisAnswerAcceptable(null)
    })
          
}
    
   })
  //get number of questions first
   useEffect(()=>{
    const getNumofQues=async()=>{
  
                 console.log('room ready')
            const questiondblist = firestore().collection('questions');
            const getques = await questiondblist
            .where('questionsetref','==',roomInformation.questionsetref)
            .where('category','==',categoryFilter)
            .get()
            setquesCount(getques.size)
       }
       getNumofQues()
   },[])

  

//take effect igcount for generating questions
 const genques =  useCallback(async () =>{

      console.log("cat" + categoryFilter)
  
     const questiondblist = firestore().collection('questions');
        const getques = await questiondblist
        .where('questionsetref','==',roomInformation.questionsetref)
        .where('category','==',categoryFilter)
        .get()

      const searchques = getques.docs.map(doc=>({
      ...doc.data(),
      }))

      setingameQues(searchques[igCount])
      setansActModule(searchques[igCount].answermodule)

        })
   useEffect(()=>{
        genques()
   },[igCount])
  

    //generating answers EVERY QUESTION
    const getGenans = useCallback(async () =>{
  const answerdblist = firestore().collection('answers');
  const getans = await answerdblist
  .where('answermodule','==',ansActModule)
  .get()

  const searchans = getans.docs.map(doc =>({
  ...doc.data(),
  }))
  setingameAns(searchans)                  
  })
  useEffect(()=>{  
   getGenans()
  },[ansActModule])


  
    //box answer 1

    const Ans1func= useCallback (async()=>{
       setloadingButton(true)
      //check if answer is correct

      if(ingameAns[0].iscorrect){
        setisCorrectAns("Correct")
        setquesPnlRes("correct")
        setrightAnsscr(rightAnsscr + 1)
        setisAnswerAcceptable(true)
        correctAndWrongAni(true)
      settotalScore(totalScore + 1)
        SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
      }
      else{
        setisCorrectAns("Wrong")
        setquesPnlRes("wrong")
        setwrongAnsscr(wrongAnsscr + 1)
        setisAnswerAcceptable(false)
        correctAndWrongAni(false)
         SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
      }


      //firebase next question

       if(igCount < quesCount - 1){ //next queestion igcount + 
      
        setigCount(igCount + 1)
        console.log(igCount)
      }

      else{ //if maximum questions reached

        if(inPractice === false){
        
        //check if certain category is finished
           let grammarCompleted = isGrammarProgressed
        let vocabularyCompleted = isVocabularyProgressed
        let situationalCompleted = isSituationalProgressed

        if(categoryFilter === "grammar"){
          grammarCompleted = true
          setisGrammarProgressed(true)
        }
        else if(categoryFilter === "vocabulary"){
          vocabularyCompleted = true
          setisVocabularyProgressed(true)
        }
        else if(categoryFilter === "situational"){
          situationalCompleted = true
          setisSituationalProgressed(true)
        }

        setcategoryAvailCurrIndex(0)
        setcategoryAvailIndex(0)
       
        

         firestore()
        .collection('joinroom-progress')
        .doc(categoryProgDoc)
        .update({
          isdone:false,
          isgrammarcompleted:grammarCompleted,
          isvocabularycompleted:vocabularyCompleted, 
           issituationalcompleted:situationalCompleted,
          joinroom:roomInformation.roomcode,
          studentid:studProfile.studentID,
          totalpoints:Number(totalScore)
        }).then(()=>{  
          setshowResults(true)
        
        })
        //  setshowResults(true)
         setcategoryFilter("")
        
        }
        else{
          setTimeout(() => {
            setshowResults(true)
        }, 2000);
   
        }
      }

    })

    

    //box answer 2
    const Ans2func=useCallback(async()=>{
       setloadingButton(true)
       //check if answer is correct

      if(ingameAns[1].iscorrect){
        setisCorrectAns("Correct")
        setquesPnlRes("correct")
        setrightAnsscr(rightAnsscr + 1)
        setisAnswerAcceptable(true)
        correctAndWrongAni(true)
      settotalScore(totalScore + 1)
         SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
      }
      else{
        setisCorrectAns("Wrong")
        setquesPnlRes("wrong")
        setwrongAnsscr(wrongAnsscr + 1)
        setisAnswerAcceptable(false)
        correctAndWrongAni(false) //animation function 
         SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
      }

       if(igCount < quesCount - 1){ //next queestion igcount + 
      
        setigCount(igCount + 1)
        
      }

      else{ //if maximum questions reached
      
        if(inPractice === false){
          
       
         //check if certain category is finished
           let grammarCompleted = isGrammarProgressed
        let vocabularyCompleted = isVocabularyProgressed
        let situationalCompleted = isSituationalProgressed

        if(categoryFilter === "grammar"){
          grammarCompleted = true
          setisGrammarProgressed(true)
        }
        else if(categoryFilter === "vocabulary"){
          vocabularyCompleted = true
          setisVocabularyProgressed(true)
        }
        else if(categoryFilter === "situational"){
          situationalCompleted = true
          setisSituationalProgressed(true)
        }

          setcategoryAvailCurrIndex(0)
        setcategoryAvailIndex(0)
        

         firestore()
        .collection('joinroom-progress')
        .doc(categoryProgDoc)
        .update({
          isdone:false,
          isgrammarcompleted:grammarCompleted,
          isvocabularycompleted:vocabularyCompleted,  issituationalcompleted:situationalCompleted,
          joinroom:roomInformation.roomcode,
          studentid:studProfile.studentID,
          totalpoints:Number(totalScore)
        }).then(()=>{  
          setshowResults(true)
        })

          
          
      
          setcategoryFilter("")
        
        }

        else{
       setTimeout(() => {
            setshowResults(true)
        }, 2000);
        }
      }


       
   })


   //box answer 3
   const Ans3func= useCallback(async()=>{
    //check if answer is correct
    setloadingButton(true)
    if(ingameAns[2].iscorrect){
        setisCorrectAns("Correct")
        setquesPnlRes("correct")
        setrightAnsscr(rightAnsscr + 1)
        setisAnswerAcceptable(true)
        correctAndWrongAni(true)  //animation function 
         settotalScore(totalScore + 1)
         SoundPlayer.playAsset(require("../assets/sounds/correct-answer.mp3"))
      }
      else{
        setisCorrectAns("Wrong")
        setquesPnlRes("wrong")
        setwrongAnsscr(wrongAnsscr + 1)
        setisAnswerAcceptable(false)
        correctAndWrongAni(false) //animation function 
        SoundPlayer.playAsset(require("../assets/sounds/wrong-answer.mp3"))
      }

      
      if(igCount < quesCount - 1){ //next queestion igcount + 
      
        setigCount(igCount + 1)
    
      }

      else{ //if maximum questions reached
        if(inPractice === false){
        //check if certain category is finished
           let grammarCompleted = isGrammarProgressed
        let vocabularyCompleted = isVocabularyProgressed
        let situationalCompleted = isSituationalProgressed

        if(categoryFilter === "grammar"){
          grammarCompleted = true
          setisGrammarProgressed(true)
        }
        else if(categoryFilter === "vocabulary"){
          vocabularyCompleted = true
          setisVocabularyProgressed(true)
        }
        else if(categoryFilter === "situational"){
          situationalCompleted = true
          setisSituationalProgressed(true)
        }
        setcategoryAvailCurrIndex(0)
        setcategoryAvailIndex(0)
       
         firestore()
        .collection('joinroom-progress')
        .doc(categoryProgDoc)
        .update({
          isdone:false,
          isgrammarcompleted:grammarCompleted,
          isvocabularycompleted:vocabularyCompleted,  issituationalcompleted:situationalCompleted,
          joinroom:roomInformation.roomcode,
          studentid:studProfile.studentID,
          totalpoints:Number(totalScore)
        }).then(()=>{  
          setshowResults(true)
        })
          setcategoryFilter("")
        
        }

        else{
            setTimeout(() => {
            setshowResults(true)
        }, 2000);
        }
      }
    
})

    return(

        <>
 <Text style = {{fontSize:30,top:300,left:30,zIndex:1}}>{isCorrectAns}</Text>

        <View style = {styles.answercon}>
       
        <ScrollView style = {{
            width:'80%',
            height:10,
            // borderWidth:2,
            paddingTop:20,
            alignContent:'center',
            
           
        }}>
        {/* <Text>{ingameAns[0].answer}</Text> */}
       
       {!loadingButton ? <>
        <Pressable onPress={Ans1func} style = {styles.answerch}><Text style = {styles.answertxt}>{ingameAns[0]?.answer}</Text></Pressable>
        <Pressable onPress={Ans2func} style = {styles.answerch}><Text style = {styles.answertxt}>{ingameAns[1]?.answer}</Text></Pressable>
        <Pressable onPress={Ans3func} style = {styles.answerch}><Text style = {styles.answertxt}>{ingameAns[2]?.answer}</Text></Pressable>
        </>
        :
        <Text style = {{fontSize:30,color:'white',fontWeight:'bold'}}>Loading Assets......</Text>
        }
       
       </ScrollView>
        </View>

        </>
    )
}

const styles = StyleSheet.create({

    answercon:{
        position:'absolute',
        width:wp('89%'),
        height:hp('31%'),
        backgroundColor:'darkblue',
        borderRadius:10,
        // top:wp('29%'),
        right:wp('5%'),
        top:hp('2%'),
        alignItems:'center',
        alignContent:'center'
    },
    answerch:{
        width:wp('70%'),
        height:hp('6%'),
        backgroundColor:'white',
        marginTop:20,
        borderRadius:20,
       alignContent:'center',
       alignItems:'center',
       padding:15

    },
    answertxt:{
        fontSize:wp('3%'),
        fontWeight:'800'
    }

})

export default memo(AnswerChoice);