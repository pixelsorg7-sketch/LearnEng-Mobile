import {BackHandler,Switch,ImageBackground,TouchableWithoutFeedback,Image,Animated,ActivityIndicator,Modal,Dimensions,ScrollView,TouchableOpacity,RadioButton, Alert,Text, SafeAreaView, StyleSheet,TextInput,Pressable,FlatList,Button, View } from 'react-native';
import React, { useRef,useContext, useState , useEffect} from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import {useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {MyStorage} from './StorageCon'; 
import uuid from 'react-native-uuid';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons'

 

const ItemShop=()=>{

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

};

     const {studProfile,setstudProfile}=useContext(MyStorage)
  const [coinEarned,setcoinEarned]=useState(0);
  const [studentDocid,setstudentDocid]=useState("");

 const [Items,setItems]=useState([])
 const [OwnedItemIds,setOwnedItemIds]=useState([])

  const [Loading,setLoading]=useState(false)

  useEffect(()=>{

    setLoading(true)

    const shopgenerate=async()=>{

      //generate shop
    const shopdblist = firestore().collection('shop');
    const getshop = await shopdblist
    .get()

    const searchshop = getshop.docs.map(doc=>({
      uid:doc.id,
      ...doc.data()
    }))
        setItems(searchshop)

        //generate available coins
     const playercoindblist = firestore().collection('player-assets');
     const getcoin = await playercoindblist
    .where('studentid','==',studProfile.studentID)
    .get()
    const searchcoin = getcoin.docs.map(doc=>({
      uid:doc.id,
      ...doc.data()
    }))
    setstudentDocid(searchcoin[0].uid)
     setcoinEarned(searchcoin[0].coins)

      // Load inventory (owned items)
  const inventorydblist = firestore().collection('inventory');
  const getinventory = await inventorydblist
    .where('studentid', '==', studProfile.studentID)
    .get();

  const inventorystud = getinventory.docs.map(doc => doc.data().itemid); // just the itemids
  setOwnedItemIds(inventorystud);

   setLoading(false)

      }

       shopgenerate()
  },[coinEarned])

  //purchase now

 const  purchaseFunc=(Category,id,itemName,Price,uriImage)=>{

   Alert.alert('Purchase', 'Buy it now?', [ //confirm purchase first
      {
        text: 'Purchase Now',
        onPress: () => { //process purchase

          if(coinEarned >= Price){ //if coin sufficient
          firestore()
          .collection('inventory').doc(uuid.v4())
          .set({
            itemcategory:Category,
            itemid:id,
            itemname:itemName,
            studentid:studProfile.studentID,
            uriImage:uriImage
          })
          .then(()=>{
             Alert.alert(
               "Success",
               "Purchased, "
            )

  

            //update coin balance

            // const newBalance = coinEarned - Price

            // setcoinEarned(coinEarned - Price)

            firestore()
            .collection('player-assets')
            .doc(studentDocid)
            .update({
              coins:firebase.firestore.FieldValue.increment(-Price)
            })

            setcoinEarned(prev => prev - Price)

          })

          }

          else{
             Alert.alert(
               "Nope",
               "Insufficient ENGcoin"
            )
          }
        },
        style: 'cancel',
      },
      {text: 'No,Maybe next time', onPress: () => console.log('cancel pressed')},
    ]);
 }



    return(
        <>

           <ImageBackground source = {require('../assets/joinroom-bg2.png')} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace('mainscreen')}>
          <Image source={require('../assets/backbutton.png')} style = {{width:70,height:70}}/>
        </TouchableOpacity>
        <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',columnGap:10}}>
        <Image source={require('../assets/engcoin.png')} style = {{width:40,height:40}}/>
        <Text style={styles.coinText}>
           {coinEarned}
        </Text>
        </View>
      </View>

      <Text style={styles.shopTitle}>SHOP</Text>

      <View style = {styles.scrollcon}>
      <ScrollView contentContainerStyle={styles.grid}>
        {Items.map((item, index) => (
            <TouchableOpacity onPress={()=>purchaseFunc(item.itemcategory,item.itemid,item.itemname,item.price,item.uriImage)} key={item.itemid} disabled={OwnedItemIds.includes(item.itemid) ? true : false}>
          <View key={index} style={styles.card}>
            <Image source={localImageMap[item.uriImage]} style={styles.image} resizeMode="contain" />
            <Text style={styles.name}>{item.itemname}</Text>
            {OwnedItemIds.includes(item.itemid)  ? (
              <Text style={styles.obtained}>Obtained</Text>
            ) : (
              <View style={styles.priceTag}>
                <Icon name="logo-bitcoin" size={hp('2%')} color="#FFD700" />
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
              
            )}
          </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    backgroundColor: '#E9F5DB',
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  coinText: {
    fontSize: hp('2.5%'),
    color: '#6C584C',
    fontWeight: 'bold',
  },
  shopTitle: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
    color: '#B46060',
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },
  scrollcon:{
     width:wp('90%'),
    height:hp('75%'),
    borderRadius:20,
      borderWidth:2,
      borderColor:'#5e713f',
      padding:7,
      backgroundColor:'#fbffbe'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: hp('4%'),
    // borderWidth:2,
  
    // width:wp('20%')
    // height:hp('50%')
  },
  card: {
    width: wp('28%'),
    backgroundColor:'#f5f5f5',
    // borderRadius: 10,
    alignItems: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('1%'),
    elevation: 3,
    borderWidth:2,
    borderColor:'#f5af4d'
  },
  image: {
    width: wp('25%'),
    height: hp('10%'),
    marginBottom: hp('1%'),
    backgroundColor:'#ffd4a5',
    borderWidth:2,
    borderColor:'#f5af4d'
  },
  name: {
    fontSize: hp('1.5%'),
    textAlign: 'center',
    fontWeight: '600',
    color: '#6C584C',
    marginBottom: hp('0.5%'),
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    backgroundColor: '#F5F5DC',
    paddingHorizontal: wp('2%'),
    borderRadius: 12,
  },
  priceText: {
    fontSize: hp('1.8%'),
    marginLeft: wp('1%'),
    color: '#333',
  },
  obtained: {
    marginTop: hp('0.5%'),
    fontSize: hp('1.5%'),
    color: '#6DA34D',
    fontWeight: 'bold',
    backgroundColor: '#E0F7E0',
    paddingHorizontal: wp('2%'),
    borderRadius: 8,
  },
  loadingModal:{
      width:wp('100%'),
      height:hp('100%'),
      backgroundColor:'black',
      opacity:0.5,
      justifyContent:'center',
      alignItems:'center'
    },
});

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#002A5C',
//       paddingTop: 50,
//       paddingHorizontal: 10,
//       rowGap:20
//     },
//     topBar: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: 15,
//     },
//     backButton: {
//       backgroundColor: '#0353A4',
//       borderRadius: 10,
//       padding: 8,
//     },
//     coinBox: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: '#0353A4',
//       paddingHorizontal: 10,
//       paddingVertical: 5,
//       borderRadius: 10,
//     },
//     coinText: {
//       color: '#fff',
//       fontSize: 16,
//       marginLeft: 6,
//     },
//     title: {
//       color: 'blue',
//       textAlign: 'center',
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 8,
//     },
//     scrollContent: {
//       paddingBottom: 20,
//     },
//     sectionTitle: {
//       color: '#fff',
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 10,
//     },
//     featuredWrapper: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginBottom: 20,
//     },
//     itemCard: {
//       width: '30%',
//       height:hp('30%'),
//       backgroundColor: '#48e51e',
//       borderRadius: 10,
//       padding: 8,
//       alignItems: 'center',
//     },
//     itemImage: {
//       width: 50,
//       height: 50,
//       backgroundColor: '#ccc',
//       borderRadius: 5,
//       marginBottom: 5,
//     },
//     itemName: {
//       color: 'red',
//       fontWeight:'bold',
//       marginBottom: 5,
//     },
//       itemCategory: {
//       color: 'blue',
//       fontWeight:'bold',
//       marginBottom: 5,
//     },
//     priceBox: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: '#4858e8',
//       paddingHorizontal: 6,
//       paddingVertical: 3,
//       borderRadius: 6,
//     },
//     priceText: {
//       color: '#FFD700',
//       marginLeft: 4,
//       fontWeight: 'bold',
//       fontSize: 13,
//     },
//     normalSection: {
//       backgroundColor: 'white',
//       width:wp('95%'),
//       height:hp('70%'),
//       rowGap:20,
//       padding: 10,
//       borderRadius: 12,
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       justifyContent: 'space-between',
//     },
//   });

export default ItemShop;