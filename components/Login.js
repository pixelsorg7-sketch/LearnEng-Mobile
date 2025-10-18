import {BackHandler,PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import {useFocusEffect, useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from '../components/StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import SoundPlayer from "react-native-sound-player";
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";

const Login = ()=>{

    useEffect(() => {
      
    console.log('Firebase App:', firebase.apps); 
    // should not be empty if Firebase is initialized
  }, []);


       const navigation = useNavigation();

       //useState

        const [logunameHold,setlogunameHold]=useState("");
           const [logpassHold,setlogpassHold]=useState("");

           //global student credentials
     const {studProfile,setstudProfile}=useContext(MyStorage)
     const {studAssets,setstudAssets}=useContext(MyStorage)

     //forgot password visible

     const [passforgotModal,setpassforgotModal]=useState(false)
     const [forgotemailPass,setforgotemailPass]=useState("")

     //loading state

     const [isLoading,setisLoading]=useState(false);

     //animated values--

     const loadingLoginX = useRef(new Animated.Value(1)).current;


     //show/hide pass
     const [showPassword, setShowPassword] = useState(false);
  
     //back button func

      useFocusEffect(
       React.useCallback(() => {
         const onBackPress = () => {
              navigation.navigate('landingpage')
              return true; 
              
         };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
         return () => backHandler.remove();    
       }, [])
     );

     


           //function

const  LoginFunc= async ()=>{

  //animation login start

  Animated.spring(loadingLoginX,{
    toValue:0.6,
    duration:500,
    useNativeDriver:true
  }).start()

  SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))
  setisLoading(true)
  
      //accessing login
      try{

      //find account
     
        const studentdblist = firestore().collection('students');
        const getstud = await studentdblist 
        .where('username','==',logunameHold)
        .where('isarchived','==',false)
        // .where('password', "==",logpassHold)
        .limit(1)
        .get()
        
       
        
        
   
        const searchstud = getstud.docs.map(doc=>({
         ...doc.data(),
         uid:doc.id  //get stud document id
        }))

        //check credentials
        let email = searchstud[0].studentID
        let password = logpassHold

        await auth().signInWithEmailAndPassword(email, password);

        //find player assets
        const playerassetdblist = firestore().collection('player-assets')
        const getplayerassets = await playerassetdblist
        .where('studentid','==',searchstud[0].studentID)
        .get()

        const searchplayerassets = getplayerassets.docs.map(doc=>({
          uid:doc.id,
          ...doc.data()
        }))
   
    

 
  //password and username validation to proceed further functions

  // if(searchstud.length !== 0){
 
 //put it to active profile
     const convertstud={
   
       uid:searchstud[0].uid,
       username:searchstud[0].username,
       firstname:searchstud[0].firstname,
       lastname:searchstud[0].lastname,
       studentID:searchstud[0].studentID,
       gradelevel:searchstud[0].gradelevel,
       section:searchstud[0].section,
      //  password:searchstud[0].password,
   
     }

     //put it to player assets profile

     const convertplayerassets={
      uid:searchplayerassets[0].uid,
      characterequipimg: searchplayerassets[0].characterequipimg,
      coins:searchplayerassets[0].coins,
      medallionequipimg:searchplayerassets[0].medallionequipimg,
      studentid:searchplayerassets[0].studentid,
      titleequiptext:searchplayerassets[0].titleequiptext
     }

        setstudProfile(convertstud)
        setstudAssets(convertplayerassets)
        navigation.navigate('mainscreen')
        
//  }

    }

    catch(e){
     Toast.show({
        type:'error',
        text1:'LOGIN ERROR',
        text2:'Incorrect username or password',
         visibilityTime: 4000,
      })
      console.log(e)
    }

     //animation login finish

  Animated.spring(loadingLoginX,{
    toValue:1,
    duration:500,
    useNativeDriver:true
  }).start()
  setisLoading(false)

    }

    //forgot password 

    const handleResetPassword=async()=>{

      try{

        let email = forgotemailPass
         await auth().sendPasswordResetEmail(email);
          Toast.show({
        type:'success',
        text1:'Link sent',
        text2:'Pls check your email',
         visibilityTime: 4000,
      })
     

      }

      catch(e){
        console.log(e)
          Toast.show({
        type:'error',
        text1:'Error',
        text2:'Email not formatted properly or not existed',
         visibilityTime: 4000,
      })
      }

      setforgotemailPass("")
      setpassforgotModal(false)
    }

    return(
        <>
           <ImageBackground
   source={require('../assets/logsignupBG.png')} // 🌈 your background image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
        source={require('../assets/logov2.png')} // 🧠 your logo image here
          style={styles.logo}
        />

        <Text style={styles.label}>Username:</Text>
        <View style={styles.logintxtCon}>
        <TextInput
          style={styles.input}
        //   value={username}
          onChangeText={(text)=>setlogunameHold(text)}
          placeholder=""
        />
       </View>

        <Text style={styles.label}>Password:</Text>
            <View style={styles.logintxtCon}>
        <TextInput
          style={[styles.input]}
        //   value={password}
         onChangeText={(text)=>setlogpassHold(text)}
          placeholder=""
        secureTextEntry={!showPassword} 
        />
        <TouchableOpacity
       onPress={() => setShowPassword(!showPassword)} // 👈 toggle
     style={{ position: "absolute", left: wp("74%") }}
         >
        <Image style = {{width:wp('20%'),height:40}} source={require('../assets/showpass.png')}/>
    </TouchableOpacity>

          </View>
        <TouchableOpacity onPress={LoginFunc}>
        <Animated.View style={[styles.button,
        {
          transform:[
            {scaleX:loadingLoginX}
          ]
        }
        ]}>
          <Text style={styles.buttonText}>{isLoading ? <ActivityIndicator size='small' color="#00ff73ff" /> : 'LOG IN'}</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style = {styles.buttonConditionCon}>
        <TouchableOpacity onPress={()=>setpassforgotModal(true)}>
       <Text  style={styles.buttonText2}>Forgot Password</Text>
       </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.replace('landingpage')}>
       <Text style={styles.buttonText2}>Go back</Text>
       </TouchableOpacity>
       </View>

      </View>

      {/* forgot password modal */}

      <Modal
      visible={passforgotModal}
      animationType="slide"
      transparent
      onRequestClose={()=>setpassforgotModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={forgotemailPass}
            onChangeText={(text)=>setforgotemailPass(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.buttonspass}>
            <TouchableOpacity style={styles.buttonforgot} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonforgot, styles.cancel]} onPress={()=>setpassforgotModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </ImageBackground>

        </>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: wp('60%'),
    height: hp('20%'),
    resizeMode: 'contain',
    marginBottom: 30,
    // borderWidth:3
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: wp('5%'),
    color: '#5e4d2c',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: wp('90%'),
    position:'relative',
    backgroundColor: '#f0f8d8',
    padding: 12,
    borderRadius: 12,
    borderColor: '#cddc39',
    borderWidth: 1,
    marginTop: 5,
    color:'black'
  },
  button: {
    backgroundColor: '#7bcf3f',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#f6f1a3',
    elevation: 2,
  },
  buttonforgot:{
backgroundColor: '#7bcf3f',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#f6f1a3',
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
    buttonText2: {
    color: 'brown',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonConditionCon:{
    flexDirection:'row',
    columnGap:60,
    paddingTop:20,
  },
  buttonCondition:{
     backgroundColor: '#7bcf3f',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#f6f1a3',
    elevation: 2,
  },

  buttonspass:{
      flexDirection: "row",
    justifyContent: "space-between",
    columnGap:20
  },
  overlay:{
        flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",

  },
  logintxtCon:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }


  
});

export default Login;