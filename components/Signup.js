import {PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from '../components/StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore, { doc } from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import uuid from 'react-native-uuid'
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";

const Signup=()=>{

const navigation = useNavigation();

 const [termsModal,settermsModal]=useState(false)

//useState


    //useState signup hold

    const [unameHold,setunameHold]=useState("");
    const [fnameHold,setfnameHold]=useState("");
    const [lnameHold,setlnameHold]=useState("");
    const [schoolidHold,setschoolidHold]=useState(0);
    const [sectionHold,setsectionHold]=useState("");
    const [gradelevelHold,setgradelevelHold]=useState(0);
    const [passHold,setpassHold]=useState("");
    const [repassHold,setrepassHold]=useState("");

    
  //show/hide pass
   const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [isLoading,setisLoading]=useState(false);
    //functions-----------------------------

     const SignupFunc=async()=>{

      setisLoading(true)
       SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

       try{

      if(unameHold.length <= 12){ //username limitation if

        // if(gradelevelHold <= 6 && gradelevelHold >=1){//grade level limitation if

          if(passHold === repassHold){//password comparison if

            if(unameHold!=="" && fnameHold!=="" && lnameHold!=="" && schoolidHold!==""  && passHold!=="" && repassHold!==""){ //not equal blank if

              //check grade level only accept 2-4

              if(Number(gradelevelHold) < 2 || Number(gradelevelHold) > 4){
                Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Accepts only Grades 2-4',
            visibilityTime: 4000
              })
               return;
              }


              //check if pass > 6

              if(passHold.length < 6){
              Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Password is less than 6. Pls add more',
            visibilityTime: 4000
              })
                 return;
              }

      //check if studentid exist

      const studentidlist = firestore().collection('studentid-list')
      const getstudentid = await studentidlist
      .where('studentid','==',schoolidHold.toLowerCase())
      .get()

      const searchstudentid = getstudentid.docs.map(doc=>({
        ...doc.data(),
        id:doc.id
      }))

      if(searchstudentid.length <= 0){
         Toast.show({
            type:'error',
            text1:'NOT FOUND',
            text2:'student email not registered',
            visibilityTime: 4000
              })
        // Alert.alert("Not found","student id not registered")
        return
      }

      //check if username exist

      const studentdblist = firestore().collection('students')
      const getstudent = await studentdblist
      .where('username','==',unameHold)
      .get()

      const searchstudent = getstudent.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      if(searchstudent.length > 0){
          Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Username Exist',
            visibilityTime: 4000
              })
          return
      }

      //check if student id already used
      
      const studentdb2list = firestore().collection('students')
      const get2student = await studentdb2list
      .where('studentID','==',schoolidHold.toLowerCase())
      .get()

      const searchstudent2 = get2student.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))

      if(searchstudent2.length > 0){
        Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Student Email Already registered',
            visibilityTime: 4000
              })
              return;
      }

      console.log("OKE NOW")

      //firebase auth add
      let email = schoolidHold.toLowerCase()
      let password = passHold

      const userCredential = await auth().createUserWithEmailAndPassword(email,password);
      console.log(userCredential.user)
      //firebase add profile

      firestore()
      .collection('students').doc(uuid.v4())
      .set({
        username:unameHold,
        firstname:fnameHold,
        lastname:lnameHold,
        studentID:schoolidHold.toLowerCase(),
        gradelevel:Number(gradelevelHold),
        isarchived:false

      })
      .then(()=>{
        Toast.show({
            type:'success',
            text1:'Success',
            text2:'Account Created',
            visibilityTime: 4000
              })
       navigation.navigate('landingpage')
    //    setisSignup(false)
      })

      //firebase add player-assets
      const defaultavatar = "char1"
      const defaultmedallion = ""
      firestore()
      .collection('player-assets').doc(uuid.v4())
      .set({
        characterequipimg:defaultavatar,
        coins:300,
        medallionequipimg:defaultmedallion,
        studentid:schoolidHold.toLowerCase(),
        titleequiptext:"Beginner",
      })

      //add default inventory

      firestore()
          .collection('inventory').doc(uuid.v4())
          .set({
            itemcategory:"character",
            itemid:104,
            itemname:"Penny",
            studentid:schoolidHold.toLowerCase(),
            uriImage:"char1"
          })

      //add player to analytics

      firestore()
      .collection('analytics').doc(uuid.v4())
      .set({
        assessments:0,
        gradelevel:Number(gradelevelHold),
        studentid:schoolidHold.toLowerCase(),
        studentname:`${fnameHold} ${lnameHold}`,
        performance:[],
        grammarassessment:[],
        readingassessment:[],
        spellingassessment:[],
        performancedate:[],
        grammardate:[],
        spellingdate:[],
        readingdate:[],
        datecreated:firestore.FieldValue.serverTimestamp(),
      })

      //temporary achievements new set

      firestore()
      .collection('student_achievement').doc()
      .set({
        completedby:["perfectscore","correctcount","playtime","correctcount","fruitharvesting"],
        gametype:["spelling","spelling","grammar","grammar","comprehension"],
        isfinished:[false,false,false,false,false],
        progression:[0,0,0,0,0],
        requiredvalue:[1,5,5,3,5],
        reward:["perfect_assessmentspellingmedal1","countspellmedal1","gamecountgrammar1","countgrammarmedal1","comprehensionfruitharvestmedal1"],
        task:["Perfectly scored an assessment","Correct the spelling 5 times","finish the game 5 times","get atleast 3 correct answers","harvest some fruit 5 times"],
        taskmode:["single","single","single","single","single"],
        titlereward:["Ace of the spelling","kiddie speller","Replenishing talk","know-to-learnEng","fruit poker"],
        studentid:schoolidHold.toLowerCase()
      })
    

            }

            else{ //not equal blank else

              Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Fill all the required fields',
            visibilityTime: 4000
              })


            }

           
          }

          else{//password comparison else

             Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Password not matched',
            visibilityTime: 4000
              })

      

          }

       

      }
      else{ //username limitation else

         Toast.show({
            type:'error',
            text1:'SIGNUP ERROR',
            text2:'Character Limit Reached (Max.12)',
            visibilityTime: 4000
              })


      }
}

catch(error){
   Toast.show({
            type:'error',
            text1:'Something wrong',
            text2:'Check your connection and try again',
            visibilityTime: 4000
              })

 
} finally{
  setisLoading(false)
}



       
    };


 

    return(
        <>

         <ImageBackground
     source={require('../assets/logsignupBG.png')} // Set your background here
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
        source={require('../assets/logov2.png')}  // Set your logo here
          style={styles.logo}
        />

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput style={styles.input}  onChangeText={(text)=>setfnameHold(text)}/>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name:</Text>
            <TextInput style={styles.input}  onChangeText={(text)=>setlnameHold(text)} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student Email:</Text>
            <TextInput style={styles.input}
            placeholder='School Email'
            placeholderTextColor="#888"
              onChangeText={(text)=>setschoolidHold(text)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Level:</Text>
            <TextInput style={styles.input} 
              keyboardType="numeric"
              placeholder='Grade 2-4 only'
              placeholderTextColor="#888"
             onChangeText={(text)=>setgradelevelHold(text)}/>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input}  onChangeText={(text)=>setunameHold((text))} />
          </View>
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} keyboardType="email-address"  />
          </View> */}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password:</Text>
          <View style = {styles.signuptxtCon}>
          <TextInput style={[styles.input,{width:wp('90%')}]} secureTextEntry ={!showPassword}  onChangeText={(text)=>setpassHold(text)} />
             <TouchableOpacity
                 onPress={() => setShowPassword(!showPassword)} // 👈 toggle
               style={{ position: "absolute", left: wp("74%") }}
                   >
                  <Image style = {{width:wp('20%'),height:40}} source={require('../assets/showpass.png')}/>
              </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password:</Text>
          <View style = {styles.signuptxtCon}>
          <TextInput style={[styles.input,{width:wp('90%')}]} secureTextEntry={!showPassword2}  onChangeText={(text)=>setrepassHold(text)}/>
          <TouchableOpacity
                 onPress={() => setShowPassword2(!showPassword2)} // 👈 toggle
               style={{ position: "absolute", left: wp("74%") }}
                   >
                  <Image style = {{width:wp('20%'),height:40}} source={require('../assets/showpass.png')}/>
              </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={SignupFunc} >
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>

         <View style = {styles.buttonConditionCon}>
        <TouchableOpacity onPress={()=>navigation.replace('landingpage')}>
               <Text style={styles.buttonText2}>Go back</Text>
               </TouchableOpacity>
          <TouchableOpacity onPress={()=>settermsModal(true)}>
               <Text style={styles.buttonText2}>Terms and conditions</Text>
               </TouchableOpacity>
        </View>


      </ScrollView>

      {/* //terms */}

       <Modal
            visible={termsModal}
            animationType="slide"
            transparent
            onRequestClose={()=>settermsModal(false)}
          >
           <Pressable onPress={()=>settermsModal(false)} style={styles.overlay}>

           <View style={styles.termscontainer}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
            
            <ScrollView style={styles.scrollView}>
              <Text style={styles.modalText}>
                Welcome to our app! {"\n\n"}
                1. By using this app, you agree to follow all rules. {"\n\n"}
                2. You must not misuse or copy content. {"\n\n"}
                3. We may update terms anytime. {"\n\n"}
                4. Continued use means you accept the latest version. {"\n\n"}
                5. Contact support for questions. {"\n\n"}
              </Text>
            </ScrollView>

            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => settermsModal(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
           </View>

           </Pressable>

          </Modal>

            <Modal
                transparent
                animationType='none'
                visible={isLoading}
                >
                <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#d0ff00ff" />
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
    alignItems: 'center',
    justifyContent:'center',
      padding: wp('2%'),
    paddingBottom: hp('10%'),
  },
  logo: {
    width: wp('60%'),
    height: hp('20%'),
    marginBottom: hp('3%'),
    resizeMode: 'contain',
    // borderWidth:2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
 width: wp('90%'),
  },
  inputGroup: {
    flex: 1,
     marginHorizontal: wp('1%'),
    marginVertical: hp('1%'),
  },
  label: {
    color: '#5e4d2c',
    fontWeight: 'bold',
      marginBottom: hp('0.5%'),
    fontSize: wp('3.8%'),
  },
  input: {
    backgroundColor: '#f0f8d8',
   borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    borderWidth: 1,
    borderColor: '#d1dd8e',
      fontSize: wp('3.8%'),
          color:'black'
  },
  submitButton: {
    backgroundColor: '#7bcf3f',
   paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('15%'),
    borderRadius: wp('7%'),
    marginTop: hp('3%'),
    elevation: 3,
    borderWidth: 2,
    borderColor: '#f6f1a3'
  },
  submitText: {
    fontWeight: 'bold',
     fontSize: wp('4.2%'),
    color: 'white',
    textAlign: 'center',
  },
  buttonConditionCon:{
    flexDirection:'row',
    columnGap:60,
    paddingTop:20,
  },
   buttonText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
   overlay:{
        flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",

  },
  termscontainer:{
      flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
      backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "80%",
  },
   modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  scrollView: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
   signuptxtCon:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }
});

export default Signup;