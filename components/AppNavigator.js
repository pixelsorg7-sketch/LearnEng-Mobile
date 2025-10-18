import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import TitlescreenPage from "./TitlescreenPage";
import MainScreen from "./MainScreen";
import EditProfile from "./EditProfile";
// import ingameBattle from "../inBattInter/inGameBattle";
import Leaderboard from "./LeaderBoard";
import Inventory from "./Inventory";
import JoinRoom from "./JoinRoom";
import ItemShop from "./ItemShop";
import IngameNavigator from "../inBattInter/IngameNavigator";
import CategoriesChoose from "./CategoriesChoose";
import PraticeRoom from "./PracticeRoom";
import TermsandCondition from "./TermsandCondition";
import IngameFruit from "../inBattInter/InGameFruit";
import InGameGrammarDrag from "../inBattInter/InGameGrammarDrag";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./Signup";
import InGameReading from "../inBattInter/InGameReading";
import InGameReadQues from "../inBattInter/InGameReadQues";


// import IngameFruit from "../inBattInter/FruitbasketGameplay/InGameFruit";
// import playerObj from "../gameObject/playerObj";
// import enemyObj from "../gameObject/enemyObj";




// const Stack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const AppNavigator=()=>{

    return(
        <>

       <Stack.Navigator
        screenOptions={{headerShown:false,
        animation: 'none'
        }}
        
        
        >

            <Stack.Screen name = "landingpage" component={LandingPage}/>
              <Stack.Screen name = "login" component={Login}/>
                <Stack.Screen name = "signup" component={Signup}/>
            {/* <Stack.Screen name = "titlescreen" component={TitlescreenPage} /> */}
            <Stack.Screen name = "mainscreen" component={MainScreen}/>
            <Stack.Screen name = "editprofile" component={EditProfile}/>
            <Stack.Screen name = "leaderboard" component={Leaderboard}/>
            <Stack.Screen name = "inventory" component={Inventory}/>
            <Stack.Screen name = "joinroom" component={JoinRoom}/>
            <Stack.Screen name = "itemshop" component={ItemShop}/>
            <Stack.Screen name="categorieschoose" component={CategoriesChoose} /> 
            <Stack.Screen name = "practiceroom" component={PraticeRoom}/>
            <Stack.Screen name = "termscondition" component={TermsandCondition}/>
{/* 
            <Stack.Screen name = "ingamebattle" component={ingameBattle}/> */}
              <Stack.Screen name = "ingamefruit" component={IngameFruit}/>
               <Stack.Screen name = "ingamegrammardrag" component={InGameGrammarDrag}/>
                 <Stack.Screen name = "ingamereading" component={InGameReading}/>
                   <Stack.Screen name = "ingamereadques" component={InGameReadQues}/>
{/* 
{/* 
            <Stack.Screen name="ingame" component={IngameNavigator} />  */}

        </Stack.Navigator>
      

        </>
    );
};

export default AppNavigator;