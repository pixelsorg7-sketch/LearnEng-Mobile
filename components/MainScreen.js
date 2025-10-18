import {BackHandler,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useRef,useContext, useState , useEffect} from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const MainScreen=()=>{

     const navigation = useNavigation();

     //back btn func
       useFocusEffect(
       React.useCallback(() => {
         const onBackPress = () => {
        
              console.log("cannot go back")
              return true; 
           
             
              
         };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
         return () => backHandler.remove();    
       }, [])
     );
     
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

    //  //context state for ingame
     const {ingameQues,setingameQues}=useContext(MyInGameStor)
     const {ingameAns,setingameAns}=useContext(MyInGameStor);
     const {quesCount,setquesCount}=useContext(MyInGameStor)
     const {ansActModule,setansActModule}=useContext(MyInGameStor)
        //context state for profile
    
        const {studProfile,setstudProfile}=useContext(MyStorage)
             const {studAssets,setstudAssets}=useContext(MyStorage)
        const {studactiveuname,setstudactiveuname}=useContext(MyStorage)
        const {studactiveindex,setstudactiveindex}=useContext(MyStorage)

        //animated values------------

        //for button animation
      const animationBtnX = useRef(new Animated.Value(0)).current;
      const animationBtnY = useRef(new Animated.Value(0)).current;
      //for character idle animation

      const charidleX = useRef(new Animated.Value(0)).current;
     const charidleY = useRef(new Animated.Value(0)).current;

      

      //btn animation func

      useEffect(()=>{

        Animated.parallel([
          Animated.spring(animationBtnX,{
            toValue:1,
            duration:2000,
            useNativeDriver:true
          }),
          Animated.spring(animationBtnY,{
            toValue:1,
            duration:2000,
            useNativeDriver:true
          })
        ]).start()

      },[])

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
  
   //functions----
        const getigCountbeforeStarting=async()=>{
       SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

           navigation.navigate('joinroom');
        }
        
          
          
       

    return(
        <>

     <ImageBackground source={require('../assets/dashboardmainpage.png')}  resizeMode="cover" style={styles.container}>
     <View style = {styles.subcontainer}>
      <Image style = {{width:250,height:250}} source={require('../assets/logov2.png')}/>

      <View style={styles.menuContainer}>
        <View style={styles.buttonGroup}>

          <TouchableOpacity
          onPress={getigCountbeforeStarting}
          >
          <Animated.View style={[styles.button,{
            transform:[
              {scaleX:animationBtnX},
              {scaleY:animationBtnY},
            ]
          }]}>
          <Text style={styles.buttonText}>Play Room</Text>
          </Animated.View>
          </TouchableOpacity>


          <TouchableOpacity
           onPress={()=>{
            SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
            navigation.replace('practiceroom')
            }}
          >
          <Animated.View style={[styles.button,{
            transform:[
              {scaleX:animationBtnX},
              {scaleY:animationBtnY},
            ]
          }]}>
          <Text style={styles.buttonText}>Practice</Text>
          </Animated.View>
          </TouchableOpacity>


          <TouchableOpacity
           onPress={()=>{navigation.replace('inventory')
           SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
           }}
          >
          <Animated.View style={[styles.button,{
            transform:[
              {scaleX:animationBtnX},
              {scaleY:animationBtnY},
            ]
          }]}>
          <Text style={styles.buttonText}>Inventory</Text>
          </Animated.View>
          </TouchableOpacity>


          <TouchableOpacity
           onPress={()=>{navigation.replace('itemshop')
           SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
           }}
          >
          <Animated.View style={[styles.button,{
            transform:[
              {scaleX:animationBtnX},
              {scaleY:animationBtnY},
            ]
          }]}>
          <Text style={styles.buttonText}>Shop</Text>
          </Animated.View>
          </TouchableOpacity>


          <TouchableOpacity
           onPress={()=>{    navigation.replace('login')
           setstudProfile({})
           setstudAssets({})
           SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
           }}
          >
          <Animated.View style={[styles.button,{
            transform:[
              {scaleX:animationBtnX},
              {scaleY:animationBtnY},
            ]
          }]}>
          <Text style={styles.buttonText}>Log out</Text>
          </Animated.View>
          </TouchableOpacity>


        </View>

          <View style={styles.mascotContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Welcome back {studProfile.username}!</Text>
          </View>
          <Animated.Image
            source={localImageMap[studAssets.characterequipimg]} // Replace with your mascot
            style={[
              styles.mascot,
              {
                transform:[
              { translateX: charidleX },
              { translateY: charidleY },
                ]
              }
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
      </View>
    </ImageBackground>
        </>
    );

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4A90E2', 
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer:{
     alignItems: 'center',
    // justifyContent: 'center',
     backgroundColor: 'rgba(255,255,255,0.6)',
    // borderWidth:3,
    width:wp('92%'),
    height:hp('80%'),
    borderRadius:20,
    
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap:35
  },
  buttonGroup: {
    marginRight: 15,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#ebf094',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 25,
    minWidth: 160,
    elevation: 10, 
    borderWidth:2,
    borderColor:'#60a05f'
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color:'black'
  },
  image: {
    width: wp('45%'),
    height: hp('40%'),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  speechBubble: {
    backgroundColor: '#c9ed7e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  speechText: {
    width:wp('20%'),
    color: '#333',
    fontWeight: 'bold',
  },
  mascot: {
    width: wp('30%'),
    height: hp('20%'),
  },
});


export default MainScreen;