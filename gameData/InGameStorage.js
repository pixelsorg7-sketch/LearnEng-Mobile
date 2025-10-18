import {Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { createContext,useRef,useContext, useState , useEffect} from 'react';
import { useRoute } from '@react-navigation/native';


const MyInGameStor = createContext();

const InGameStorage=({children})=>{

  //category progress check

  
      const [isFruitgameProgressed,setisFruitgameProgressed]=useState(false)
      const [isSecondgameProgressed,setisSecondgameProgressed]=useState(false)
      const [isThirdgameProgressed,setisThirdgameProgressed]=useState(false)
      // const [isSituationalProgressed,setisSituationalProgressed]=useState(false)

     

    

    //room information essentials
    const [joinActive,setjoinActive]=useState(false) //join active
    const [roomInformation,setroomInformation]=useState({});
    const [categoryFilter,setcategoryFilter]=useState("none"); //category type hold in game for question filtering
    const [categoryProgDoc,setcategoryProgDoc]=useState(0); //category room info collection
    const [categoryAvailIndex,setcategoryAvailIndex]=useState(0)
    const [categoryAvailCurrIndex,setcategoryAvailCurrIndex]=useState(0)
    const [inGameDifficulty,setinGameDifficulty]=useState("");  //all game difficulty 
     const [analyticsDocid,setanalyticsDocid]=useState("");
     const [playerAssetsDocid,setplayerAssetsDocid]=useState("")

   const [gameTypeVal,setgameTypeVal]=useState(0);

   const [practiceEnabled,setpracticeEnabled]=useState(false);

   //IngameReading store story

   const [selectedStoryDocid,setselectedStoryDocid]=useState("")

   const [storyContent,setstoryContent]=useState([])
   const [storyQuestion,setstoryQuestion]=useState([])

   const [combineStoryContent,setcombineStoryContent]=useState("")

    // const [storyContent,setstoryContent]=useState([
   
    //    {
    //      imagestory:require('../assets/greenshopbtn.jpg'),
    //      speechstory:'Once upon a time '
    //    },
    //     {
    //      imagestory:require('../assets/shopbg.jpg'),
    //      speechstory:'I was eating some good stuff'
    //    },
    //     {
    //      imagestory:require('../assets/mainmenu-bg.png'),
    //      speechstory:'then kill myself afterward'
    //    },
    //     {
    //      imagestory:require('../assets/nightblue_bg.png'),
    //      speechstory:'Suddenly i got revived for no reason. JUST KILL ME NOWWW'
    //    }
    //  ])

    //  const [storyQuestion,setstoryQuestion]=useState([

    //   {
    //     question:"Who are you?",
    //     choices:["me","eh","just you"],
    //     correctanswer:"me"
    //   },
    //   {
    //     question:"Who killed John?",
    //     choices:["Jin","Drake","Larry"],
    //     correctanswer:"Larry"
    //   },
    //   {
    //     question:"Who ate drake's Cat?",
    //     choices:["Jing Ching Qong","Bryant","White"],
    //     correctanswer:"Jing Ching Qong"
    //   }
    //  ])


    // console.log("availIndex"+categoryAvailIndex)
    // console.log("Currindex"+categoryAvailCurrIndex)
    // const [ingameQues,setingameQues]=useState({});
    // const [ingameAns,setingameAns]=useState([]);
    // const [ingameCharAss,setingameCharAss]=useState([]);
    // const [ingameResult,setingameResult]=useState([]); //scores, accuracy, correct ans, wrong ans, partially correct

    // const[inPractice,setinPractice]=useState(false);

    //   const [ansActModule,setansActModule]=useState(0) 
    //   console.log(categoryProgDoc)
    // // console.log(ingameAns)
    // //  console.log("In Game ques",ingameQues)
    // //  console.log("WAH",ansActModule)


    //  //question count value
    //   const [igCount,setigCount]=useState(0); //current questions count value
    //   const [quesCount,setquesCount]=useState(0); //maximum questions count value
    //   console.log("quescount",quesCount)
    //     console.log("igcount",igCount)

    //   //show results

    //   const [showResults,setshowResults]=useState(false);

    //   //question panel response

    //   const [quesPnlRes,setquesPnlRes]=useState("inprogress");

    //   //ingame score counting

    //   const [rightAnsscr,setrightAnsscr]=useState(0);
    //   const [wrongAnsscr,setwrongAnsscr]=useState(0);

    //   //summary result

      // const [totalScore,settotalScore]=useState(0);

    //   //animation value andd toggle..........

    //   //for ques panel toggle and usestate ref..............
    //      const bgquesboxPanel = useRef(new Animated.Value(0)).current;
    //      const [isAnswerAcceptable,setisAnswerAcceptable]=useState(null);
    //     //  const quesBoxColorChooser = bgquesboxPanel._value === 1 ? "green" : bgquesboxPanel._value === 2 ? "red" : "white"
      
    //      //animation reponse style..................
         
    //         const quesBoxResponseStyle = {  //for ques box response style
    //       backgroundColor:bgquesboxPanel._value === 1 ? "green" : bgquesboxPanel._value === 2 ? "red" : "white",
    //       }

    return(
        <>
        <MyInGameStor.Provider
        value={{
            // ingameQues,setingameQues,
            // ingameAns,setingameAns,
            // ingameCharAss,setingameCharAss,
            // ingameResult,setingameResult,
            // quesCount,setquesCount,
            // ansActModule,setansActModule,
            // progressBarvalue,setprogressBarvalue,
            // igCount,setigCount,

            // showResults,setshowResults,

            // quesPnlRes,setquesPnlRes,

            // rightAnsscr,setrightAnsscr,
            // wrongAnsscr,setwrongAnsscr,

           

         roomInformation,setroomInformation,
         categoryFilter,setcategoryFilter,
        //  bgquesboxPanel,isAnswerAcceptable,setisAnswerAcceptable,
        //  quesBoxColorChooser,
        //  quesBoxResponseStyle,
         categoryProgDoc,setcategoryProgDoc,
        //  isGrammarProgressed,setisGrammarProgressed,
        isFruitgameProgressed,setisFruitgameProgressed,
        isSecondgameProgressed,setisSecondgameProgressed,
        //  isVocabularyProgressed,setisVocabularyProgressed,
        //  isSituationalProgressed,setisSituationalProgressed,
        //  totalScore,settotalScore,
         categoryAvailIndex,setcategoryAvailIndex,
         categoryAvailCurrIndex,setcategoryAvailCurrIndex,
         joinActive,setjoinActive,
         gameTypeVal,setgameTypeVal,
         practiceEnabled,setpracticeEnabled,
         storyContent,setstoryContent,
         storyQuestion,setstoryQuestion,
         combineStoryContent,setcombineStoryContent,
         analyticsDocid,setanalyticsDocid,
         inGameDifficulty,setinGameDifficulty,
         playerAssetsDocid,setplayerAssetsDocid,
         isThirdgameProgressed,setisThirdgameProgressed
        //  inPractice,setinPractice

        


        }}
        >{children}</MyInGameStor.Provider>

        </>
    )
}

export {MyInGameStor,InGameStorage};