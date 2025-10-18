import {Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View,KeyboardAvoidingView } from 'react-native';
import React, { useRef,useContext, useState , useEffect} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios'
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";

const EditProfile=()=>{

    //navigation

    const navigation = useNavigation();
    const route = useRoute();


     //context state...
    
        const {studProfile,setstudProfile}=useContext(MyStorage)

      //for edit context state

    const {editunameHold,seteditunameHold}=useContext(MyStorage)
     const {editfnameHold,seteditfnameHold}=useContext(MyStorage)
     const {editlnameHold,seteditlnameHold}=useContext(MyStorage)
     const {editschoolidHold,seteditschoolidHold}=useContext(MyStorage)
     const {editsectionHold,seteditsectionHold}=useContext(MyStorage)
     const {editgradelevelHold,seteditgradelevelHold}=useContext(MyStorage)
     const {editcurrpassHold,seteditcurrpassHold}=useContext(MyStorage)
     const {editnewpassHold,seteditnewpassHold}=useContext(MyStorage)
     const {editretypepassHold,seteditretypepassHold}=useContext(MyStorage)



    //functions.........

    const editprofFunc= async ()=>{  //edit profile func

         SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

        if(studProfile.password === editcurrpassHold){     //verify password

  
        if(editnewpassHold === null){ //if user doesnt change password.................

            //update by firebase    
        firestore()
        .collection('students')
        .doc(studProfile.uid)
        .update({
          
            username:editunameHold,
            firstname:editfnameHold,
            lastname:editlnameHold,
            studentID:editschoolidHold,
            section:editsectionHold,
            gradelevel:editgradelevelHold,
            password:studProfile.password,
        })
        .then(() => {
            Alert.alert(
            'qwerty',
            'Stud updated'
        )

        
        const updatedstudnopass={ //update active stud
           
        
            username:editunameHold,
            firstname:editfnameHold,
            lastname:editlnameHold,
            studentID:editschoolidHold,
            section:editsectionHold,
            gradelevel:editgradelevelHold,
            password:studProfile.password,
        }

        setstudProfile(updatedstudnopass)

        });

      navigation.navigate('titlescreen')
        
         }

        else{ //if user does change password............................

            if(editnewpassHold === editretypepassHold){ //if pass and repass matched
        
            //update by firebase    
            firestore()
            .collection('students')
            .doc(studProfile.uid)
            .update({
              
                username:editunameHold,
                firstname:editfnameHold,
                lastname:editlnameHold,
                studentID:editschoolidHold,
                section:editsectionHold,
                gradelevel:editgradelevelHold,
                password:editnewpassHold,
            })
            .then(() => {
                Alert.alert(
                'qwerty',
                'Stud updated'
            )
    
            
            const updatedstudpass={ //update active stud
               
            
                username:editunameHold,
                firstname:editfnameHold,
                lastname:editlnameHold,
                studentID:editschoolidHold,
                section:editsectionHold,
                gradelevel:editgradelevelHold,
                password:editnewpassHold,
            }
    
            setstudProfile(updatedstudpass)
    
            });

     navigation.navigate('titlescreen')
        
            }
            else{ //else pass and repass matched

                
             Alert.alert(
            'Invalid',
            'Password not matched'
                )


            
            }
        } 

      
      }

      else{
              
             Alert.alert(
            'Invalid',
            'Current Password Wrong'
                )
      }
        

        
       

    }

    const resetFunc=(e)=>{
          
         SoundPlayer.playAsset(require("../assets/sounds/clickedIn.mp3"))

        seteditunameHold(studProfile.username)
        seteditfnameHold(studProfile.firstname)
        seteditlnameHold(studProfile.lastname)
        seteditschoolidHold(String(studProfile.studentID))
        seteditsectionHold(studProfile.section)
        seteditgradelevelHold(String(studProfile.gradelevel))


            
    }
       
    return(
        <>
        <ScrollView style = {styles.container}>

        <Text style = {{
            color:'white',
            top:80,
            left:115,
            fontWeight:'bold',
            fontSize:20
        }}>EDIT YOUR PROFILE</Text>

        <View style = {styles.edittfcon}>

        <View style = {styles.tfindicon}>
       {editunameHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'Username Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
        <TextInput
            style = {styles.edittf}
            placeholder='Username'
            onChangeText={(text)=>seteditunameHold(text)}
            value={editunameHold}
        />
        </View>
        

        <View style = {styles.tfindicon}>
        {editfnameHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'Firstname Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
        <TextInput
            style = {styles.edittf}
            placeholder='Firstname'
            onChangeText={(text)=>seteditfnameHold(text)}
            value={editfnameHold}
        />
       </View>

       <View style = {styles.tfindicon}>
       {editlnameHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'Lastname Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
        <TextInput
            style = {styles.edittf}
            placeholder='Lastname'
            onChangeText={(text)=>seteditlnameHold(text)}
            value={editlnameHold}
        />
     </View>

       <View style = {styles.tfindicon}>
       {editschoolidHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'School ID Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
        <TextInput
            style = {styles.edittf}
            placeholder='School ID'
            onChangeText={(text)=>seteditschoolidHold(text)}
            keyboardType="numeric"
            value={editschoolidHold}
        />
     </View>

     <View style = {styles.tfindicon}>
     {editsectionHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'Section Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
         <TextInput
            style = {styles.edittf}
            placeholder='Section'
            onChangeText={(text)=>seteditsectionHold(text)}
            value={editsectionHold}
        />

     </View>

     <View style = {styles.tfindicon}>
     {editgradelevelHold === "" ? <Pressable onPress={
        ()=>Alert.alert(
                  'Required',
                  'Grade level Cannot be Empty'
                )
       }><Image style = {styles.tfindiimg} source={{uri:'https://img.freepik.com/free-photo/red-exclamation-circle-sign-warning-danger-risk-message-alert-problem-icon-background-concept-3d-rendering_56104-1145.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740'}}/></Pressable> : ''} 
        <TextInput
            style = {styles.edittf}
            placeholder='Grade Level'
            onChangeText={(text)=>seteditgradelevelHold(text)}
            keyboardType="numeric"
            value={editgradelevelHold}
        />

     </View>

     <View style = {styles.tfindicon}>
    
        <TextInput
            style = {styles.edittf}
            placeholder='Current Password (Required)'
            onChangeText={(text)=>seteditcurrpassHold(text)}

        />
     </View>   

     <View style = {styles.tfindicon}>
     
        <TextInput
            style = {styles.edittf}
            placeholder='New Password(Optional)'
            onChangeText={(text)=>seteditnewpassHold(text)}
        />

     </View>

      <View style = {styles.tfindicon}>
    
        <TextInput
            style = {styles.edittf}
            placeholder='Re-Type New Password(Optional)'
            onChangeText={(text)=>seteditretypepassHold(text)}
        />
     </View>

        </View>

         <View
         style = {{
            flexDirection:'row',
            top:hp('87%'),
            left:wp('3%'),
            columnGap:15,
            position:'absolute'
         }}
         >

        <TouchableOpacity 
        style = {styles.modifierbtn}
        onPress={resetFunc}
        >
            <Text>RESET</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style = {styles.modifierbtn}
        onPress={editprofFunc}
        >
            <Text>APPLY </Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style = {styles.modifierbtn}
        onPress = {()=>{navigation.navigate('titlescreen')
          SoundPlayer.playAsset(require("../assets/sounds/clickedOut.mp3"))
        }}
        >
            <Text>EXIT</Text>
        </TouchableOpacity>

         </View>

         

        </ScrollView>

        </>
    );
};


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor:'darkblue',
        flex:1

    },

    edittfcon:{
        width:'80%',
        height:hp('81%'),
        alignItems:'center',
        backgroundColor:'#4b42cd',
        position:'relative',
        left:40,
        top:0,
        borderRadius:20,
        paddingTop:12,
        paddingLeft:17,
        rowGap:10
        
    },

    edittf:{
        width:'90%',
        height:hp('7%'),
        borderWidth:3,
        borderRadius:20,
        backgroundColor:'#aeacc9'
    },
    modifierbtn:{
        width:wp('29%'),
        height:40,
        backgroundColor:'lightblue',
        alignItems:'center',
        paddingTop:10,
        borderRadius:30,
        
    },
    tfindicon:{
        width:'100%',
        flexDirection:'row'
    },
    tfindiimg:{
        width:30,height:30,right:10,top:8
    }

})



export default EditProfile;