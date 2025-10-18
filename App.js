
import {PanResponder,useAnimatedValue,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View ,StatusBar} from 'react-native';
// import * as React from 'react';
import React, { useCallback,memo,useRef,useContext, useState , useEffect, use} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import {StorageCon} from './components/StorageCon';
import {InGameStorage}  from './gameData/InGameStorage';
import Toast from 'react-native-toast-message';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export default function App() {

  // splash
   const [splashLoading, setsplashLoading] = useState(true);
  const fadeSplash = useRef(new Animated.Value(1)).current;

  //toast function
  const toastConfig = {

  grammardraginfo:(props)=>(

  <>
<View style={styles.grammardragcon}> 
<Text style = {{fontSize:20,fontWeight:'bold'}}>Score</Text>
<Text style = {{fontSize:18}}>{props.text1}</Text>
</View>
  </>
  ),

  instruction:(props)=>(

    <>

    <View style={styles.instructionContainer}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}>🍎🍌🍊</Text>
        <Text style={styles.headerTitle}>{ props.text1}</Text>
        <Text style={styles.headerSubtitle}>{props.text2}</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsWrapper}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>
            {props.props.text3}
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>
             {props.props.text4}
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>
            {props.props.text5}
          </Text>
        </View>

        
      </View>

      {/* Game Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Pro Tips:</Text>
        <Text style={styles.tipText}>•  {props.props.protip1}</Text>
        <Text style={styles.tipText}>• {props.props.protip2}</Text>
        <Text style={styles.tipText}>• {props.props.protip3}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.soundText}>🔊 BETTER WITH SOUNDS ON</Text>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
              props.props.onStart(); 
          }}
        >
          <Text style={styles.primaryButtonText}>START GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
   
         
 
        
    </>
   
 
  ),

  success: (props) => (
   <View style={{ height: 'auto', width: wp('90%'), backgroundColor: 'lightgreen', borderRadius: 5, padding: 10, justifyContent: 'center', alignItems: 'center',rowGap:5 }}>
      <Text style={{ color: 'black', fontSize:20, fontWeight: 'bold' }}>{props.text1}</Text>
      <Text style={{ color: 'black',fontSize:15}}>{props.text2}</Text>
    </View>
  ),
  error: (props) => ( // Make sure you have an 'error' type defined
   <View style={{ height: 'auto', width: wp('90%'), backgroundColor: 'red', borderRadius: 5, padding: 10, justifyContent: 'center', alignItems: 'center',rowGap:5 }}>
      <Text style={{ color: 'white', fontSize:20, fontWeight: 'bold' }}>{props.text1}</Text>
      <Text style={{ color: 'white',fontSize:15}}>{props.text2}</Text>
    </View>
  )
};

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      Animated.timing(fadeSplash, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setsplashLoading(false);
      });
    }, 2000);
  }, []);

 if (splashLoading) {
    return (

       <Animated.View style={[styles.splash, { opacity: fadeSplash }]}>
        
        <Image
        source={require('./assets/logov2.png')} // <- use your LearnENG logo here
          style={styles.logo}
          resizeMode="contain"
        />


      </Animated.View>
    
    );
  }


  return (
    <>

      {/* <StatusBar hidden={true} /> */}
      
    <NavigationContainer>
    <StorageCon>
    <InGameStorage>
      <AppNavigator/>
      </InGameStorage>
     </StorageCon> 
   
    </NavigationContainer>
    <Toast config={toastConfig}/>


    

    {/* test */}

    <Modal
    visible={false}
      animationType="fade"
      transparent={true}
    >

 


    </Modal>
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  instructioncontent:{
      width:wp('90%'),
      height:hp('70%'),
      borderWidth:3,
      borderRadius:20,
      rowGap:15,
      borderColor:'blue',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#94f394ff'
  },
  titlegamecon:{
    width:wp('60%'),
    height:hp('9%'),
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F535E5',
    bottom:40
  },
  insboxcon:{
    width:wp('85%'),
    height:hp('15%'),
    // borderWidth:2,
    flexDirection:'row',
    justifyContent:'flex-start',
    padding:10,
    alignItems:'center',
    columnGap:30
  },
  iconinstruction:{
    width:90,
    height:90,
    // borderWidth:3

  },
  instructioncon:{
    width:wp('80%'),
    height:hp('13%'),
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    elevation:5,
    borderWidth:3,
    borderColor:'yellow',
    backgroundColor:'#796BF2'
  },
  instructiontext:{
    fontSize:17,
    fontWeight:'bold',
    color:'white'
  },
  endinstruction:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },

  exclamation:{
    width:55,
    height:55
  },

  //

   instructionContainer: {
    backgroundColor: '#667eea',
    borderRadius: wp('5%'), // Responsive border radius
    padding: wp('5%'), // Responsive padding
    margin: wp('2.5%'), // Responsive margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.5%'), // Responsive shadow
    },
    shadowOpacity: 0.3,
    shadowRadius: wp('2%'), // Responsive shadow radius
    elevation: 8,
    borderWidth: wp('0.5%'), // Responsive border
    borderColor: '#fff',
    width: wp('90%'), // Responsive width instead of maxWidth
    minHeight: hp('50%'), // Responsive minimum height
    maxHeight: hp('85%'), // Prevent overflow on smaller screens
    alignSelf: 'center', // Center the container
  },
  
  headerContainer: {
    alignItems: 'center',
    marginBottom: hp('2.5%'), // Responsive margin
    paddingBottom: hp('2%'), // Responsive padding
    borderBottomWidth: wp('0.5%'), // Responsive border
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  
  headerEmoji: {
    fontSize: wp('8%'), // Responsive font size
    marginBottom: hp('1%'), // Responsive margin
  },
  
  headerTitle: {
    fontSize: wp('6%'), // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: wp('2%'), // Prevent text overflow
  },
  
  headerSubtitle: {
    fontSize: wp('4%'), // Responsive font size
    color: '#f0f0f0',
    fontStyle: 'italic',
    marginTop: hp('0.5%'), // Responsive margin
  },
  
  instructionsWrapper: {
    marginBottom: hp('2.5%'), // Responsive margin
    width: '100%', // Full width
  },
  
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'), // Responsive margin
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp('3%'), // Responsive border radius
    padding: wp('3%'), // Responsive padding
    borderLeftWidth: wp('1%'), // Responsive border
    borderLeftColor: '#FFD700',
    minHeight: hp('6%'), // Minimum height for touch targets
  },
  
  instructionNumber: {
    fontSize: wp('4.5%'), // Responsive font size
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: wp('4%'), // Responsive border radius
    width: wp('8%'), // Responsive width
    height: wp('8%'), // Responsive height (square)
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: wp('3%'), // Responsive margin
    lineHeight: wp('8%'), // Center text vertically
  },
  
  instructionText: {
    fontSize: wp('4%'), // Responsive font size
    color: '#fff',
    flex: 1,
    lineHeight: wp('5.5%'), // Responsive line height
    fontWeight: '500',
    flexWrap: 'wrap', // Allow text wrapping
  },
  
  tipsContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: wp('3%'), // Responsive border radius
    padding: wp('4%'), // Responsive padding
    marginBottom: hp('2.5%'), // Responsive margin
    borderWidth: wp('0.25%'), // Responsive border
    borderColor: 'rgba(255,255,255,0.2)',
    width: '100%', // Full width
  },
  
  tipsTitle: {
    fontSize: wp('4.2%'), // Responsive font size
    fontWeight: 'bold',
    color: '#FFE135',
    marginBottom: hp('1%'), // Responsive margin
  },
  
  tipText: {
    fontSize: wp('3.5%'), // Responsive font size
    color: '#f0f0f0',
    marginBottom: hp('0.5%'), // Responsive margin
    paddingLeft: wp('2%'), // Responsive padding
    lineHeight: wp('4.5%'), // Responsive line height
  },
  
  footerContainer: {
    alignItems: 'center',
    paddingTop: hp('2%'), // Responsive padding
    borderTopWidth: wp('0.5%'), // Responsive border
    borderTopColor: 'rgba(255,255,255,0.3)',
    width: '100%', // Full width
  },
  
  soundText: {
    fontSize: wp('4.5%'), // Responsive font size
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: hp('1%'), // Responsive margin
    textAlign: 'center', // Center align for better responsive layout
  },
  
  readyText: {
    fontSize: wp('4%'), // Responsive font size
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
    textAlign: 'center', // Center align
  },

  // Additional responsive button styles (if using buttons)
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: hp('2%'),
    paddingHorizontal: wp('2%'),
    columnGap: wp('3%'),
  },
  
  button: {
    flex: 1,
    paddingVertical: hp('1.5%'), // Responsive padding
    paddingHorizontal: wp('5%'), // Responsive padding
    borderRadius: wp('6%'), // Responsive border radius
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    minHeight: hp('6%'), // Minimum touch target
  },
  
  buttonText: {
    fontSize: wp('4%'), // Responsive font size
    fontWeight: 'bold',
  },

  primaryButton: {
    backgroundColor: '#62cc65ff',
  },
  
  primaryButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: wp('0.5%'),
    borderColor: '#4CAF50',
  },
  
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },

  grammardragcon:{
    width:wp('40%'),
    height:hp('6%'),
    backgroundColor:'#62cc65ff',
    borderWidth:2,
    borderColor:'green',
    borderRadius:20,
    padding:10,
    alignItems:'center',
    justifyContent:'center'
  },

   splash: {
    flex: 1,
    backgroundColor: '#62cc65ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    logo: {
      width: wp('60%'),
    height: hp('25%'),
    marginBottom: hp('5%'),
    // borderWidth:2
  },


});
