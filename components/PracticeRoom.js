import {BackHandler,Easing,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View, KeyboardAvoidingView } from 'react-native';
import React, { useRef,useContext, useState , useEffect,useCallback} from 'react';
import { useFocusEffect,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import IngameFruit from '../inBattInter/InGameFruit';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import Storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

const PraticeRoom=()=>{

  const {studProfile,setstudProfile}=useContext(MyStorage)

  ///force back tab navigating to mainscreen
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

//cleanup animation---------------


useEffect(()=>{
 
  const listenerId = claimedAnim.addListener(({ value }) => {
      console.log('claimedAnim current value:', value);
    return ()=>{
      claimedAnim.removeListener(listenerId)
    }
  })
},[claimedAnim])

     const navigation = useNavigation(); //navigation

    const {roomInformation,setroomInformation}=useContext(MyInGameStor);
    const {practiceEnabled,setpracticeEnabled}=useContext(MyInGameStor);
    const {playerAssetsDocid,setplayerAssetsDocid}=useContext(MyInGameStor)
   const {inGameDifficulty,setinGameDifficulty}=useContext(MyInGameStor)
      const [modalVisible, setModalVisible] = useState(false);
    
    //tutorial note hold

    const [tutorialTitle,settutorialTitle]=useState("")
    const [tutorialNote1,settutorialNote1]=useState("")
    const [tutorialNote2,settutorialNote2]=useState("")
    const [tutorialPic,settutorialPic]=useState("")
  
  //guide response values

  const [pracModesel,setpracModesel]=useState("")

  //modal trigger

  const [claimedModal,setclaimedModal]=useState(false)

  //loading state

  const [isLoading,setisLoading]=useState(false)

  //animation values---------------------------

  const readyupX = useRef(new Animated.Value(0)).current;
  const readyupY = useRef(new Animated.Value(0)).current;

  const claimedAnim =useRef(new Animated.Value(0)).current;
  const claimedAnim2 =useRef(new Animated.Value(0)).current;
  const claimedAnim3 =useRef(new Animated.Value(0)).current;

  const claimAnimY = claimedAnim.interpolate({
    inputRange:[0,1],
    outputRange:[0,-5]
  })
  const claimAnimY2 = claimedAnim2.interpolate({
    inputRange:[0,1],
    outputRange:[0,-5]
  })
  const claimAnimY3 = claimedAnim3.interpolate({
    inputRange:[0,1],
    outputRange:[0,-5]
  })

  //achivements value

  const [allGameAchievement,setallGameAchievement]=useState([])

  const [game1Achievement,setgame1Achievement]=useState("")
  const [game1minProgress,setgame1minProgress]=useState(0)
  const [game1maxProgress,setgame1maxProgress]=useState(0)


  const [game2Achievement,setgame2Achievement]=useState("")
  const [game2minProgress,setgame2minProgress]=useState(0)
  const [game2maxProgress,setgame2maxProgress]=useState(0)


  const [game3Achievement,setgame3Achievement]=useState("")
  const [game3minProgress,setgame3minProgress]=useState(0)
  const [game3maxProgress,setgame3maxProgress]=useState(0)

  //process all needed (Achievements,player-assets)--------------------

  
    const processAchievements=useCallback(async()=>{
      
   //get all achievements first 
      try{
    const achievementdblist = firestore().collection('student_achievement')
    const getachievements = await achievementdblist
    .where('studentid','==',studProfile.studentID)
    .get()

    const searchachievements = getachievements.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))

    setallGameAchievement(searchachievements)


  
  }
    catch(error){
      console.log(error)
    }

    //get player-asset docid

     const playerassetdblist = firestore().collection('player-assets')
    const getplayerasset = await playerassetdblist
    .where('studentid','==',studProfile.studentID)
    .get()

    const searchplayerasset = getplayerasset.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))

    setplayerAssetsDocid(searchplayerasset[0].id)



  })

  useEffect(()=>{
  processAchievements()
  },[])
//then render the current objective
  useEffect(()=>{
    

    if(allGameAchievement[0] !== undefined){

   for (let i = 0; allGameAchievement[0].task.length > i; i++){

    let finished = Boolean(allGameAchievement[0].isfinished[i])
    let taskmode = allGameAchievement[0].taskmode[i]
    let gametype = allGameAchievement[0].gametype[i]
    let requiredvalue = allGameAchievement[0].requiredvalue[i] 
    let progression = allGameAchievement[0].progression[i]

     if(gametype === "spelling" && finished === false && taskmode === "single"){
  
      setgame1Achievement(allGameAchievement[0].task[i])
      setgame1maxProgress(allGameAchievement[0].requiredvalue[i])
      setgame1minProgress(allGameAchievement[0].progression[i])
    
    }

    
     if(gametype === "grammar" && finished === false && taskmode === "single"){
  
      setgame2Achievement(allGameAchievement[0].task[i])
      setgame2maxProgress(allGameAchievement[0].requiredvalue[i])
      setgame2minProgress(allGameAchievement[0].progression[i])
    }

    
     if(gametype === "comprehension" && finished === false && taskmode === "single"){
  
      setgame3Achievement(allGameAchievement[0].task[i])
      setgame3maxProgress(allGameAchievement[0].requiredvalue[i])
      setgame3minProgress(allGameAchievement[0].progression[i])
    }

    //check when one task completed to mark as FINISHED

    if( gametype === "spelling" && progression >= requiredvalue && finished === false){
      console.log("One task completed (Spelling)")
      animatedClaimed("spelling","single",i)

    }

     if( gametype === "grammar" && progression >= requiredvalue && finished === false){
      console.log("One task completed (grammar)")
          animatedClaimed("grammar","single",i)
    }

     if( gametype === "comprehension" && progression >= requiredvalue && finished === false){
      console.log("One task completed (comprehension)")
          animatedClaimed("comprehension","single",i)
    }


   }

   }

  },[allGameAchievement])

  //claim reward and changed it to finished true-----------

  const animatedClaimed=useCallback((gametype,taskmode,index)=>{  //animation while claiming

    let claimedgametypeAnim = null;

    switch(gametype) {

      case "spelling":
        claimedgametypeAnim = claimedAnim
        break;
      case "grammar":
        claimedgametypeAnim = claimedAnim2
        break;

      case "comprehension":
        claimedgametypeAnim = claimedAnim3
        break;
        default:
          null
    }

     claimedAnim.setValue(0);
    claimedAnim2.setValue(0);
    claimedAnim3.setValue(0);

    Animated.sequence([
      Animated.spring(claimedgametypeAnim,{
        toValue:1,
        duration:600,
         bounciness: 10,
        speed: 40,
        useNativeDriver:false
      }),
      Animated.spring(claimedgametypeAnim,{
        toValue:0,
        duration:600,
         bounciness: 10,
        speed: 40,
        useNativeDriver:false
      })
    ]).start(()=>{
      AchievementRewardsFunc(gametype,taskmode,index)
    })

  })

  //get docid student achievement

  const AchievementRewardsFunc=useCallback(async(gametype,taskmode,index)=>{


    const studentachievementdblist = firestore().collection('student_achievement')
    const getachievement = await studentachievementdblist
    .where('studentid','==',studProfile.studentID)
    .get()

    const searchachievement = getachievement.docs.map(doc=>({
      id:doc.id,
      ...doc.data(),
    }))

    //claim reward

    let itemid = Math.floor(Math.random() * 100000)
    let itemname = searchachievement[0].titlereward[index]
     let itemreward = searchachievement[0].reward[index]
    firestore()
    .collection('inventory').doc()
    .set({
      itemcategory:"medallion",
      itemid:itemid,
      itemname:itemname,
      studentid:studProfile.studentID,
      uriImage:itemreward

    })


     setimgClaimed(searchachievement[0].reward[index])
     settitleClaimed(searchachievement[0].titlereward[index])
     setclaimedModal(true)

    //change fnished status to true

      let updatedAchievement = [...allGameAchievement[0].isfinished]
      updatedAchievement[index] = true
      
      firestore()
      .collection('student_achievement')
      .doc(searchachievement[0].id)
      .update({
        isfinished:updatedAchievement
      })

      //reset objective list
       setgame1Achievement("")
      setgame1maxProgress("")
      setgame1minProgress("")
       setgame2Achievement("")
      setgame2maxProgress("")
      setgame2minProgress("")
       setgame3Achievement("")
      setgame3maxProgress("")
      setgame3minProgress("")

      processAchievements()

  })

  //claimed modal func modal

  const [imgClaimed,setimgClaimed]=useState("")
  const [titleClaimed,settitleClaimed]=useState("")

  const renderClaimedModal=useCallback((img,title)=>(
     <Modal
     transparent={true}
     visible={claimedModal}
     animationType='none'
     onRequestClose={()=>{
      setclaimedModal(false)
     setimgClaimed("")
     settitleClaimed("")
     }}
     >
  

    <View style = {styles.overlayContainer}>

    <View style={styles.rewardcontent}>

    
    <View style = {styles.titlerewardclaimedcon}>  
    <Text style = {{fontSize:23,color:'purple',fontWeight:'bold'}}>REWARD CLAIMED</Text>
    </View>
    <Image style = {{width:70,height:70,}} source={require(`../assets/engcoin.png`)}/>
    <Text style = {{fontSize:20,fontWeight:'bold'}}>{title}</Text>
    <TouchableOpacity 
    onPress={()=>{
      setclaimedModal(false)
     setimgClaimed("")
     settitleClaimed("")
    }}
     style = {styles.claimedbtn}>
      <Text>AWESOME</Text>
    </TouchableOpacity>


    </View>

    </View>



     </Modal>
  ))

    //functions-----------------

    const menuStart=async(gamemode)=>{

      setisLoading(true)

      //animation

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
      ]).start()

      //-

      if(gamemode === "spelling"){

        settutorialTitle(" Fruit Basket")
        settutorialNote1("Listen to a word that you're about to spell")
        settutorialNote2("Catch a letter fruit according to the word")
        setpracModesel("spelling")
          try{
     const vidUrl = await Storage().ref('videotutorial/spellingtutorial.mp4').getDownloadURL();
       settutorialPic(vidUrl)

         }
       catch(error){
       console.log(error)
        }

      }

      else if(gamemode === "grammar"){

        settutorialTitle("Word Match")
        settutorialNote1("Read the missing sentence")
        settutorialNote2("Drag the correct answer")
         setpracModesel("grammar")
          try{
     const vidUrl = await Storage().ref('videotutorial/grammartutorial.mp4').getDownloadURL();
       settutorialPic(vidUrl)

         }
       catch(error){
       console.log(error)
        }
      
        
      }

      else if(gamemode === "reading"){

        settutorialTitle("Readventure")
         settutorialNote1("Read the dialouge and understand its context")
        settutorialNote2("Proceed to supplementary questions and drag the correct answer")
         setpracModesel("reading")
         try{
     const vidUrl = await Storage().ref('videotutorial/readingtutorial.mp4').getDownloadURL();
       settutorialPic(vidUrl)

         }
       catch(error){
       console.log(error)
        }
        
      }

      setModalVisible(true)
      setpracticeEnabled(true)
    
      setisLoading(false)
    }

   const [nextDifficultyPnl,setnextDifficultyPnl]=useState(false)

    const selectDifficulty=useCallback((difficulty)=>{

      setModalVisible(false)
      settutorialTitle("")
      settutorialNote1("")
      settutorialNote2("")
      setpracModesel("")

      //selecting difficulty
      setinGameDifficulty(difficulty)
      
        //navigate

      if(pracModesel === "spelling"){
         Toast.show({
              type:'instruction',
              text1:'CATCH A FRUIT',
              text2:'Incorrect username or password',
              text3:'Incorrect username or password',
              text4:'Incorrect username or password',
               visibilityTime: 6000,
               onHide:(()=>{
                setisgameActive(true)
               })
            })
        navigation.replace('ingamefruit')
      }
      else if(pracModesel === "grammar"){
        navigation.replace('ingamegrammardrag')
      }
       else if(pracModesel === "reading"){
        navigation.replace('ingamereading')
      }

    setnextDifficultyPnl(false)

    })

    const practticeNow=useCallback(()=>{
     setnextDifficultyPnl(true)
    })

    const exitGuide=useCallback(()=>{

      //animation
      Animated.parallel([
        Animated.spring(readyupX,{
         toValue:0,
         duration:500,
        useNativeDriver:true
        }),
       Animated.spring(readyupY,{
        toValue:0,
        duration:300,
        useNativeDriver:true
        })
      ]).start()

      setnextDifficultyPnl(false)
      setModalVisible(false)
      setpracticeEnabled(false)
      settutorialTitle("")
      settutorialNote1("")
      settutorialNote2("")
      setpracModesel("")
    })

    return (
     <>

    <ImageBackground  source={require('../assets/practicebg.jpg')} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        {/* <Ionicons name="arrow-back" size={28} color="white" /> */}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>

         {/* <View style = {{width:wp('80%'),backgroundColor:'blue',alignItems:'center',borderRadius:30}}>
        <Text style={styles.header}>PRACTICE ROOM</Text>
        </View> */}
        <Image style = {{width:wp('60%'),height:hp('20%')}} source={require('../assets/practiceroomword.png')}/>
        


        <TouchableOpacity onPress={()=>menuStart("spelling")}>
       <ImageBackground style={styles.skillButton}>
      
         <View style = {[styles.insidepanel]}>

         <View style = {styles.iconcon}>
         <Image style = {styles.icon} source={require('../assets/fruitgameicon.png')}/>
         <Text style={styles.buttonText}>Fruit Basket</Text>
         </View>
        </View>
       { allGameAchievement.length !== 0 ? <Animated.View style = {[styles.taskcon,
       {
        transform:[
          {translateY:claimAnimY}
        ]
       }
       ]}>
       {game1Achievement !== "" ?
       <>
        <Text style = {styles.texttask}>Task: {game1Achievement}</Text>
         <Progress.Bar progress={game1maxProgress > 0 ? game1minProgress / game1maxProgress : 0} width={wp('65%')} height={20} color='purple'/>
         </>

         :
         <Text style = {styles.taskmaxouttxt}>TASK MAXED OUT</Text>
       }
        </Animated.View> : ''}

          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>menuStart("grammar")}>
           <ImageBackground style={styles.skillButton}>
          <View style = {styles.insidepanel}>
          <View style = {styles.iconcon}>
           <Image style = {styles.icon} source={require('../assets/grammardragicon.png')}/>
        <Text style={styles.buttonText}>Word Match</Text>
        </View>
        </View>
       { allGameAchievement.length !== 0 ? <Animated.View style = {[styles.taskcon,
       
       {
        transform:[
          {translateY:claimAnimY2}
        ]
       }
       ]}>
        {game2Achievement !== "" ?
        <>
         <Text style = {styles.texttask}>Task: {game2Achievement}</Text>
         <Progress.Bar progress={game2maxProgress > 0 ? game2minProgress / game2maxProgress : 0} width={wp('65%')} height={20} color='purple'/>
         </>

         :

         <Text style = {styles.taskmaxouttxt}>TASK MAXED OUT</Text>

        }

        </Animated.View> : 
        ''
        }
          </ImageBackground>
        </TouchableOpacity>

          <TouchableOpacity onPress={()=>menuStart("reading")}>
           <ImageBackground style={styles.skillButton}>
          <View style = {styles.insidepanel}>
        <View style = {styles.iconcon}>
          <Image style = {styles.icon} source={require('../assets/comprehensionicon.png')}/>
        <Text style={styles.buttonText}>Readventure</Text>
        </View>
        </View>
         { allGameAchievement.length !== 0 ? <Animated.View style = {[styles.taskcon,
         
       {
        transform:[
          {translateY:claimAnimY3}
        ]
       }
         ]}>
             {game3Achievement !== "" ? 
             <>
             <Text style = {styles.texttask}>Task: {game3Achievement}</Text>
         <Progress.Bar progress={game3maxProgress > 0 ? game3minProgress / game3maxProgress : 0} width={wp('65%')} height={20} color='purple'/>
         </>

         :

         <Text style = {styles.taskmaxouttxt}>TASK MAXED OUT</Text>

             }

        </Animated.View>

        :
        ''}
          </ImageBackground>
        </TouchableOpacity>


          <TouchableOpacity style={[styles.backbutton]}>
          <Text onPress={()=>navigation.replace('mainscreen')} style={[styles.buttonText]}>Exit Practice Room</Text>
        </TouchableOpacity>

 
      </View>

      {/* loading modal */}

      <Modal
      transparent
      animationType='none'
      visible={isLoading}
      >
      <View style={styles.overlayContainer}>
      <ActivityIndicator size="large" color="#d0ff00ff" />
       </View>
      </Modal>


      {/* guide modal--------------------- */}
       <Modal
        transparent
        animationType="none"
        visible={modalVisible}
        onRequestClose={exitGuide}
       >
        <View style={styles.overlayContainer}>

        {/* guide section */}

        {nextDifficultyPnl === false ? 
          <Animated.View style={[styles.topModal,
          {
        transform:[
       {scaleX:readyupX},
       {scaleY:readyupY}
       ]

      }
          ]}>

           <View style = {styles.tutorialtitlecon}><Text style={styles.modalText}>{tutorialTitle}</Text></View> 
              {/* <Video
        source={{uri:'https://www.w3schools.com/html/mov_bbb.mp4'}} // Online Video URL
        style={styles.videotutorial}
        repeat={true}         // ✅ Enable looping
        resizeMode="cover"   // Adjust fit (cover, contain, etc.)
        muted={true}
        controls={false}     // No controls (optional)
      /> */}
        <Video
      source={{ uri: tutorialPic }}
      style={styles.videotutorial}
      controls={true}
      repeat
      resizeMode="contain"
      paused={false} // auto-play when loaded
    />

             <View style = {styles.tutorialnotecon}><Text style={styles.tutorialtext}>  {tutorialNote1}</Text></View>

               <View style = {styles.tutorialnotecon}><Text style={styles.tutorialtext}>  {tutorialNote2}</Text></View>

               <View style = {styles.tutorialnotecon}> <Text style={styles.tutorialtext}> Remember Play with Style</Text></View>


          <View style = {{flexDirection:'row',columnGap:20}}>
            <TouchableOpacity
              onPress={practticeNow}
              style={styles.closeButton}>
              <Text style={styles.buttonText}>START NOW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={exitGuide}
              style={styles.closeButton}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>      


          </Animated.View>

          :

          <Animated.View
          style={[styles.difficultymodal]}
          >

          <TouchableOpacity
              onPress={()=>selectDifficulty("easy")}
              style={styles.difficultybtn}>
              <Text style={styles.buttonText}>EASY</Text>
            </TouchableOpacity>

                 <TouchableOpacity
              onPress={()=>selectDifficulty("medium")}
              style={styles.difficultybtn}>
              <Text style={styles.buttonText}>INTERMEDIATE</Text>
            </TouchableOpacity>

                 <TouchableOpacity
              onPress={()=>selectDifficulty("hard")}
              style={styles.difficultybtn}>
              <Text style={styles.buttonText}>ADVANCED</Text>
            </TouchableOpacity>



          </Animated.View>

                }

        </View>
      </Modal>

      {renderClaimedModal(imgClaimed,titleClaimed)}
     

    </ImageBackground>

     </>
    );
  

};

const styles = StyleSheet.create({

   container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 19,
    color: 'black',
    marginBottom: 30,
  },
  skillButton: {
    backgroundColor: '#89E66F',
    borderWidth:3,
    borderRadius:20,
    borderColor:'yellow',
    marginBottom: 20,
    width: wp('80%'),
    height:hp('17%'),
    justifyContent:'center',
    alignItems:'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    // rowGap:10
    
    
  },
  backbutton:{
 backgroundColor: 'violet',
    borderWidth:3,
    borderRadius:20,
    borderColor:'yellow',
    marginBottom: 20,
    width: wp('80%'),
    height:hp('7%'),
    justifyContent:'center',
    alignItems:'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
  },
  insidepanel:{
    flexDirection:'row',
    columnGap:20
  },
  imageLayout:{
    width:100,
    height:100,
    borderWidth:2
  },
    openButton: {
    padding: 15,
    backgroundColor: '#4b7cd8',
    borderRadius: 10,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // background dim
    justifyContent:'center',
    alignItems:'center',
   
  },
  topModal: {
    // height:hp('70%'),
    width:wp('80%'),
    position: 'absolute',
    backgroundColor: 'lightgreen',
    borderWidth:2,
    borderColor:'blue',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    rowGap:30,
      justifyContent:'center',
    alignItems:'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color:'blue',
    fontWeight:'bold'
  },
  closeButton: {
    width:wp('35%'),
    height:50,
    justifyContent:'center',
    backgroundColor: 'lightblue',
    borderRadius: 8,
    elevation:5,
    alignItems: 'center',
  },
  videotutorial:{
    width:wp('70%'),
    height:hp('23%'),
    borderWidth:2
  },
  taskcon:{
    width:wp('70%'),
    height:55,
    padding:5,
    elevation:7,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#91e6e9ff'
  },
  iconcon:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    columnGap:10
  },
  icon:{
    width:50,
    height:50,
  },
  texttask:{
    fontSize:15,
    fontWeight:'bold'
  },
  tutorialtitlecon:{
    width:'auto',
    height:hp('7%'),
    borderWidth:2,
    borderColor:'lightblue',
    alignItems:'center',
    justifyContent:'center',
    padding:4,
    backgroundColor:'pink'
  },
  tutorialnotecon:{
    backgroundColor:'#a9e0af',
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    elevation:5
  },
  tutorialtext:{
    fontSize:15,
    fontWeight:800
  },
  difficultymodal:{

    height:hp('50%'),
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
  rewardcontent:{
     width:wp('70%'),
      height:hp('25%'),
      // left:wp('5%'),
      // top:hp('8%'),
      // borderWidth:3,
      borderRadius:20,
      rowGap:15,
      borderColor:'blue',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#C4FF8C',
      borderWidth:3,
      borderColor:'green',
      rowGap:25
  },
  claimedbtn:{
    width:wp('30%'),
    height:hp('5%'),
    borderRadius:20,
    borderColor:'green',
    borderWidth:2,
    elevation:5,
    backgroundColor:'yellow',
    justifyContent:'center',
    alignItems:'center',
    
  },
  titlerewardclaimedcon:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'yellow',
    padding:10,
    borderRadius:20,
    borderWidth:2,
    borderColor:'blue'
  },
  taskmaxouttxt:{
    fontSize:20,
    fontWeight:'bold'
  }
});




export default PraticeRoom;