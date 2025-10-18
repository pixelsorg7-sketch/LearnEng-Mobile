import {Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useRef,useContext, useState , useEffect} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {MyInGameStor} from '../gameData/InGameStorage'; 
import axios from 'axios'
import firestore from '@react-native-firebase/firestore'
import SoundPlayer from "react-native-sound-player";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const TermsandCondition=()=>{

    return(
        <>

         <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.paragraph}>
          Welcome to our app! Please read the following terms and conditions carefully.
        </Text>
        <Text style={styles.bullet}>• the user must be accompanied by the parents to use this app.</Text>
        <Text style={styles.bullet}>• Do not use the app for any illegal or harmful activities.</Text>
        <Text style={styles.bullet}>• We may collect data to improve our service.</Text>
        <Text style={styles.bullet}>• Your account security is your responsibility.</Text>
        <Text style={styles.bullet}>• Breaking the rules can result in account suspension.</Text>
        <Text style={styles.paragraph}>
          By Reading this, you agree to be bound by these terms.
        </Text>
      </ScrollView>

      {/* <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonDecline} onPress={handleDecline}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAccept} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View> */}
    </View>

        </>
    )
}

export default TermsandCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollArea: {
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto',
  },
  buttonAccept: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonDecline: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});