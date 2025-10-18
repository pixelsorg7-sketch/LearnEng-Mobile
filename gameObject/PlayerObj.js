import {Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, {memo, useRef,useContext, useState , useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const PlayerObj = () =>{

    return(
        
        <>

        <View style = {styles.playercon}>
             <Image style = {styles.playerpic} source = {require('../assets/playersamp.png')}/>
        </View>

        </>
    );

};

const styles = StyleSheet.create({

    playercon:{
        width:wp('30%'),
        height:hp('12%'),
        position:'absolute',
        top:hp('1%'),
        left:hp('6%'),
        // borderWidth:3,
        alignItems:'center'
    },

    playerpic:{
        width:wp('19%'),
        height:hp('11%'),
    
    }

});

export default memo(PlayerObj);