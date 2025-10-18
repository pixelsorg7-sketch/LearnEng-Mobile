
import React, {createContext,useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyStorage = createContext();

const StorageCon=({children})=>{



    

    const [studProfile,setstudProfile]=useState({});
    const [studAssets,setstudAssets]=useState({});

    console.log("Active Prof"+studProfile)
    //active login
    // const [studactiveuname,setstudactiveuname]=useState("");  
    // const [studactiveindex,setstudactiveindex]=useState(0);
    // const [studactiveschoolid,setstudactiveschoolid]=useState(0);
    // const [studactivepass,setstudactivepass]=useState(0);
    // console.log(studactiveuname)
    // console.log(studactiveschoolid)
    // console.log(studactivepass)

    const [profileBox,setprofileBox]=useState(false); //profile box response

    //edit Profile State

    const [editunameHold,seteditunameHold]=useState("")
    const [editfnameHold,seteditfnameHold]=useState("")
    const [editlnameHold,seteditlnameHold]=useState("")
    const [editschoolidHold,seteditschoolidHold]=useState()
    const [editsectionHold,seteditsectionHold]=useState("")
    const [editgradelevelHold,seteditgradelevelHold]=useState()
    const [editcurrpassHold,seteditcurrpassHold]=useState("")
    const [editnewpassHold,seteditnewpassHold]=useState(null)
    const [editretypepassHold,seteditretypepassHold]=useState("")

    //animation toggle Usestate global..................


        // const [isLogSignvisible,setisLogSignvisible]=useState(true);
        // const [isLogSignFaderesize,setisLogSignFaderesize]=useState(true);

        //for bg title animation --> TitlescreenPage
        // const [isbgMoveWidthLeft,setisbgMoveWidthLeft]=useState(false);
        // const [isbgMoveHeightTop,setisbgMoveHeightTop]=useState(false);
        

    
    console.log(studProfile)
    return(
        <>
            <MyStorage.Provider 
            value={{
                studProfile,setstudProfile,
                // studactiveuname,setstudactiveuname,
                // studactiveindex,setstudactiveindex,
                // studactiveschoolid,setstudactiveschoolid,
                profileBox,setprofileBox,

                editunameHold,seteditunameHold,
                editfnameHold,seteditfnameHold,
                editlnameHold,seteditlnameHold,
                editschoolidHold,seteditschoolidHold,
                editsectionHold,seteditsectionHold,
                editgradelevelHold,seteditgradelevelHold,
                editcurrpassHold,seteditcurrpassHold,
                editnewpassHold,seteditnewpassHold,
                editretypepassHold,seteditretypepassHold,
                studAssets,setstudAssets
                // studactivepass,setstudactivepass,
                // isLogSignvisible,setisLogSignvisible,
                // isLogSignFaderesize,setisLogSignFaderesize,
                // isbgMoveWidthLeft,setisbgMoveWidthLeft,
                // isbgMoveHeightTop,setisbgMoveHeightTop


                
                
            }}
            >
                {children}
            </MyStorage.Provider>
        </>
    )
}

export {MyStorage,StorageCon}