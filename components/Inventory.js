import {BackHandler,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useRef,useContext, useState , useEffect} from 'react';
import {useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import {MyStorage} from './StorageCon'; 
const Inventory=()=>{

   const navigation = useNavigation(); //navigation

     //back btn func
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

 

 const [sampleItemOwned, setSampleItemOwned] = useState([]);

  const {studProfile,setstudProfile}=useContext(MyStorage);
 const {studAssets,setstudAssets}=useContext(MyStorage)
  

  const [characterEquipped,setcharacterEquipped]=useState("")
  const [titleEquipped,settitleEquipped]=useState("")
  const [medallionEquipped,setmedallionEquipped]=useState("")
  const [inventoryDocuId,setinventoryDocuId]=useState("");

  const [Loading,setLoading]=useState(false)

  // const studentId = 33; // Example

  useEffect(() => {  
   setLoading(true)
    //render all available inventory
    const unsubscribe = firestore() 
      .collection('inventory')
      .where('studentid', '==', studProfile.studentID)
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setSampleItemOwned(items);
    
      });


    return () => unsubscribe();
  }, [characterEquipped,titleEquipped,medallionEquipped]);

  useEffect(()=>{
    
    const playerAssetrend=async()=>{
    try{
   const playerassetsdblist = firestore().collection('player-assets')
   const playerassetStud = await playerassetsdblist
   .where('studentid','==',studProfile.studentID)
   .get()

   const searchplayerasset = playerassetStud.docs.map(doc=>({
    ...doc.data(),
    id:doc.id
   }))
   setcharacterEquipped(searchplayerasset[0].characterequipimg)
   setmedallionEquipped(searchplayerasset[0].medallionequipimg)
   settitleEquipped(searchplayerasset[0].titleequiptext)
   setinventoryDocuId(searchplayerasset[0].id)
   }
   catch(e){

  }

  finally{
       setLoading(false)
  }
  }
  
   playerAssetrend()

  },[characterEquipped,titleEquipped,medallionEquipped])

//functions................

const equipNowFunc=(itemcategory,itemid,itemname,studentid,uriimage,docid)=>{

  Alert.alert('Equip','Are you sure you want to equip selected item',[ //comfirm user to equip?
    {    //if equip now
      text:'Equip now',
      onPress:()=>{
    setLoading(true)
         if(itemcategory === "character"){

          firestore()
        .collection('player-assets')
        .doc(inventoryDocuId)
        .update({
          characterequipimg:uriimage
        })

        setstudAssets({
          ...studAssets,
         characterequipimg:uriimage
        })

        }

        else if(itemcategory === "medallion"){

          firestore()
        .collection('player-assets')
        .doc(inventoryDocuId)
        .update({
          medallionequipimg:uriimage,
          titleequiptext:itemname
        })

        setstudAssets({
          ...studAssets,
          medallionequipimg:uriimage,
          titleequiptext:itemname
        })

        }
        
        

        setcharacterEquipped("")
        settitleEquipped("")
        setmedallionEquipped("")
       

      }
    },
    {text: 'No,Maybe next time', onPress: () => console.log('cancel pressed')} //if dont want to equip
  ])
}

    return(
        <>

<ImageBackground source={require('../assets/inventorybg.jpg')} style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.replace('mainscreen')} style={styles.backButton}>
           <Image source={require('../assets/backbutton.png')} style = {{width:70,height:70}}/>
        </TouchableOpacity>
       
       <View style = {styles.backpackpanelpnl}>
        <Text style={styles.title}>My Backpack</Text>
        </View>

      </View>

      {/* Main Image and Side Inventory */}
      <View style={styles.mainSection}>
        <View style={styles.mainImageBox}>
          <Image style={styles.placeholderImage}
            source={localImageMap[characterEquipped]}
          />
           
            <View style={styles.titlenameCon}>
              <Text style={{ fontSize: 25, color: '#B46060', fontWeight: 'bold' }}>{studProfile.username}</Text>
              <Text style={{ fontSize: 18, color: '#B46060', fontWeight: 'condensedBold' }}>{titleEquipped}</Text>
            </View>
          
        </View>
        <View style={styles.sideInventorycon}>
          <View style={styles.sideInventory}>
            <Image style={styles.sideItemImage}
              source={localImageMap[characterEquipped]}
            />
            <Text style={styles.sideitemtext}>Character</Text>
          </View>
          {/* <View style={styles.sideInventory}>
            <Image style={styles.sideItemImage}
              source={{ uri: 'https://img.freepik.com/premium-vector/boy-with-black-hair-use-school-uniform-outfit-pixel-art-style_682225-30.jpg?ga=GA1.1.1339217056.1740616814&semt=ais_hybrid&w=740' }}
            />
            <Text style={styles.sideitemtext}>Title</Text>
          </View> */}
          <View style={styles.sideInventory}>
            <Image style={styles.sideItemImage}
              source={localImageMap[medallionEquipped]}
            />
            <Text style={styles.sideitemtext}>Medallion</Text>
          </View>
        </View>
      </View>

       <View style = {{rowGap:10}}>
      {/* Item Grid Section */}
      <ImageBackground  style={styles.gridSection}>
        <Text style={styles.itemsTitle}>Items</Text>
        <ScrollView>
          <View style={styles.itemsGrid}>
            {sampleItemOwned.length === 0 && (
              <Text style={{ color: '#fff', marginTop: 20 }}>No items found.</Text>
            )}
            {sampleItemOwned.map((element, index) => (
              <>
              <ImageBackground style={element.itemcategory === "character" ? [styles.gridItem,{backgroundColor:'#8CE7F8'}] : [styles.gridItem,{backgroundColor:'#ecc0e5ff'}] }>
              <TouchableOpacity onPress={()=>equipNowFunc(element.itemcategory,element.itemid,element.itemname,element.studentid,element.uriImage)} key={element.id || index}>
                <Image style={styles.itemImage} source={localImageMap[element.uriImage]} />
              </TouchableOpacity>
                <Text style={styles.itemName}>{element.itemname}</Text>
              </ImageBackground>
                </>
            ))}
          </View>
        </ScrollView>
      
      </ImageBackground>

    <View style = {styles.categoryPnl}>

    <Text style = {{fontSize:15,fontWeight:'bold'}}>Category:</Text>


    <View style = {[styles.circlecategorycolor,{backgroundColor:'#8CE7F8'}]}></View>
    <Text>Character</Text>

     <View style = {[styles.circlecategorycolor,{backgroundColor:'#ecc0e5ff'}]}></View>
        <Text>Title/Medallion</Text>
    </View>

    </View>
      {/* loading modal */}
       <Modal
       transparent={true}
       visible={Loading}
       >

       <View style = {styles.loadingModal}>

       <ActivityIndicator size='large' color='yellow'/>

       </View>



      </Modal> 
    </ImageBackground>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#4483E4',
      paddingTop: 25,
      paddingHorizontal: 10,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    backButton: {
      // backgroundColor: '#0353A4',
      borderRadius: 10,
      padding: 8,
      marginRight: 15,
    },
    title: {
      color: '#B46060',
      fontSize: 26,
      fontWeight: 900,
    },
    mainSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems:'center',
      marginBottom: 15,
      columnGap:30
    },
     titleMedalliondisplay:{
      width:wp('55%'),
      height:hp('7%'),
      paddingLeft:10,
      paddingTop:4,
      alignContent:'center',
      flexDirection:'row',
      backgroundColor:'#42aace',
      columnGap:6
    },
     titlenameCon:{

      width:wp('45%'),
      height:hp('6%'),
      // borderWidth:2,
      borderRadius:20,
      // backgroundColor:'lightgreen',
      alignItems:'center',
      justifyContent:'center'
    },
    sideitemtext:{
      fontSize:18,
      color:'#B46060',
      fontWeight:'800'
    },
    mainImageBox: {
      width: '55%',
      aspectRatio: 1,
     backgroundColor: 'rgba(251, 255, 190, 0.7)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      rowGap:30,
      borderWidth:2,
      borderColor:'#f5af4d'
    },
    placeholderImage: {
      width: '50%',
      height: '50%',
      backgroundColor: 'white',
      borderWidth:2,
      borderColor:'#B46060',
      padding:50,
      borderRadius: 8,
    },
    sideInventory: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    sideInventorycon:{
      width:wp('35%'),
      height:hp('27%'),
      // paddingTop:17,
      // paddingLeft:15,
     backgroundColor: 'rgba(251, 255, 190, 0.7)',
       borderWidth:2,
       borderColor:'#f5af4d',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      // top:wp('5%'),
      // right:wp('3%')
    },
    sideItemImage: {
      width: 60,
      height: 60,
      backgroundColor: 'white',
      borderWidth:2,
      borderColor:'#B46060',
      padding:35,
      borderRadius: 8,

    },
   
    equippedRow: {
      backgroundColor: '#1C4E80',
      borderRadius: 12,
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    equippedItemImage: {
      width: 50,
      height: 50,
      // backgroundColor: '#ccc',
      borderRadius: 8,
    },
    gridSection: {
     backgroundColor: 'rgba(251, 255, 190, 0.8)',
      borderWidth:2,
      borderColor:'#f5af4d',
      borderRadius: 12,
      padding: 10,
      height:hp('45%')
      // flex: 1,
      
 
    },
    itemsTitle: {
      color: '#B46060',
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    itemsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridItem: {
      width: wp('27%'),
      height:hp('14%'),
      marginBottom:10,
      backgroundColor: '#8CE7F8',
      borderRadius: 10,
      borderWidth:2,
      borderColor:'#f5af4d',
      textAlign:'center',
      alignItems: 'center',
      justifyContent:'center',
      
 
    },
    itemImage: {
      width: 70,
      height: 70,
      // backgroundColor: '#ccc',
      // left:wp('10%'),
      borderRadius: 5,
   
      // borderWidth:2
    },
    itemName: {
      color: '#B46060',
      fontWeight:'800',
      fontSize: 15,
    },
     categoryName: {
      color: 'blue',
      fontSize: 17,
      left:50,
      fontWeight:'bold'
      
    },
    loadingModal:{
      width:wp('100%'),
      height:hp('100%'),
      backgroundColor:'black',
      opacity:0.5,
      justifyContent:'center',
      alignItems:'center'
    },
    categoryPnl:{
      width:wp('95%'),
      height:hp('5%'),
      borderWidth:2,
       borderColor:'#f5af4d',
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
      columnGap:10,
      flexDirection:'row',
      backgroundColor:'rgba(251, 255, 190, 0.8)'
    },
    circlecategorycolor:{
      width:20,
      height:20,
      borderWidth:2,
      borderColor:'#f5af4d',
      borderRadius:50
    },
    backpackpanelpnl:{
      height:hp('7%'),
      backgroundColor:'#c9ed7e',
      padding:5,
      borderWidth:2,
      borderColor:'#f5af4d',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center'
    }
   
  });

export default Inventory;