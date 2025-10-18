import {PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { useIsFocused,useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from '../components/StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const LandingPage = () =>{

       const navigation = useNavigation();

    return(
        <>

     <ImageBackground
   source={require('../assets/logsignupBG.png')} // <- use your background image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
        source={require('../assets/logov2.png')} // <- use your LearnENG logo here
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
             onPress={() => navigation.navigate('signup')}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
        

        </>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('4%'),
  },
  logo: {
      width: wp('60%'),
    height: hp('25%'),
    marginBottom: hp('5%'),
    // borderWidth:2
  },
  buttonContainer: {
    flexDirection: 'row',
     gap: wp('4%'),
  },
  button: {
    backgroundColor: '#c8f560',
     paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('7%'),
    borderRadius: wp('5%'),
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
      fontSize: wp('4%'),
  },
});

export default LandingPage;