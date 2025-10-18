import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import MainScreen from "./MainScreen";
// import EditProfile from "./EditProfile";
import MainScreen from "../components/MainScreen";
// import ingameBattle from "../inBattInter/inGameBattle";
import CategoriesChoose from "../components/CategoriesChoose";
import PraticeRoom from "../components/PracticeRoom";
import InGameReadQues from "./InGameReadQues";


// import Leaderboard from "./LeaderBoard";
// import Inventory from "./Inventory";
// import JoinRoom from "./JoinRoom";
// import ItemShop from "./ItemShop";
// import IngameNavigator from "../inBattInter/IngameNavigator";
// import CategoriesChoose from "./CategoriesChoose";
// import playerObj from "../gameObject/playerObj";
// import enemyObj from "../gameObject/enemyObj";




// const Stack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const IngameNavigator=()=>{

    return(
        <>

       <Stack.Navigator
        screenOptions={{headerShown:false}}
        
        >
            {/* <Stack.Screen name = "titlescreen" component={TitlescreenPage} /> */}
            <Stack.Screen name = "mainscreen" component={MainScreen}/>
            <Stack.Screen name = "categorieschoose" component={CategoriesChoose}/>
            {/* <Stack.Screen name = "editprofile" component={EditProfile}/>
            <Stack.Screen name = "leaderboard" component={Leaderboard}/>
            <Stack.Screen name = "inventory" component={Inventory}/>
            <Stack.Screen name = "joinroom" component={JoinRoom}/>
            <Stack.Screen name = "itemshop" component={ItemShop}/>
            <Stack.Screen name="categorieschoose" component={CategoriesChoose} />  */}
             <Stack.Screen name = "practiceroom" component={PraticeRoom}/>
            {/* <Stack.Screen name = "ingamebattle" component={ingameBattle}/> */}
            <Stack.Screen name = "ingamereadques" component={InGameReadQues}/>
{/* 
            <Stack.Screen name="ingame" component={IngameNavigator} />  */}

        </Stack.Navigator>
      

        </>
    );
};

export default IngameNavigator;