import { SetStateAction, useEffect, useRef, useState } from "react";
import MainArea from "./components/MainArea"
import Modify from "./components/Modify"
import History from "./components/History"
import { Button, Stack } from "react-bootstrap";
import Settings from "./components/Settings";
import { fetchEventSource } from "@microsoft/fetch-event-source";

function App() {
  
  //const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(() => {
    const storedSelectedFloor = localStorage.getItem('selectedFloor');
    return storedSelectedFloor ? parseInt(storedSelectedFloor) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem('selectedFloor', selectedFloor.toString());
  }, [selectedFloor]);

  const [modifyPonts, setModyfyPonts] = useState(-1);

  //settings
  //const [updateFreq, setUpdateFreq] = useState(0);
  const [updateFreq, setUpdateFreq] = useState(() => {
    const storedUpdateFreq = localStorage.getItem('updateFreq');
    return storedUpdateFreq ? parseInt(storedUpdateFreq) : 1;
  });
  useEffect(() => {
    localStorage.setItem('updateFreq', updateFreq.toString());
  }, [updateFreq]);

  //const [showModify, setShowModify] = useState(false);
  const [showModify, setShowModify] = useState(() => {
    const storedShowModify = localStorage.getItem('showModify');
    return storedShowModify ? JSON.parse(storedShowModify) : false;
  });
  
  useEffect(() => {
    localStorage.setItem('showModify', JSON.stringify(showModify));
  }, [showModify]);

  //const [trasparency, setTrasparency] = useState(0.5);
  const [trasparency, setTrasparency] = useState(() => {
    const storedTrasparency = localStorage.getItem('trasparency');
    return storedTrasparency ? parseFloat(storedTrasparency) : 0.5;
  });
  
  useEffect(() => {
    localStorage.setItem('trasparency', trasparency.toString());
  }, [trasparency]);
  //const [radius, setRadius] = useState(10);
  const [radius, setRadius] = useState(() => {
    const storedRadius = localStorage.getItem('radius');
    return storedRadius ? parseInt(storedRadius) : 10;
  });
  
  useEffect(() => {
    localStorage.setItem('radius', radius.toString());
  }, [radius]);

  //const [showHistory, setShowHistory] = useState(true);
  const [showHistory, setShowHistory] = useState(() => {
    const storedShowHistory = localStorage.getItem('showHistory');
    return storedShowHistory ? JSON.parse(storedShowHistory) : true;
  });
  
  useEffect(() => {
    localStorage.setItem('showHistory', JSON.stringify(showHistory));
  }, [showHistory]);

  const [showSettings, setShowSettings] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  /*const allDataStatic = [
    {floor:1,
    image: "",
    data:[
      { id:1,
        color: 'red',
        points: [0,0,110,220,180,22,100,0]},
      { id:2,
        color: 'gray',
        points: [200,10,210,120,280,320,330,110]},
      ]
    },
    {floor:2,
    image: "",
    data:[
      { id:3,
        color: 'blue',
        points: [0,10,100,420,180,22,100,0]},
      { id:4,
        color: 'orange',
        points: [200,10,214,420,380,620,330,110]},
      ]
    },
  ];*/
  

  //const [allData, setallData] = useState([{floor:-1,image:"",data:[]}]);//[{floor:-1,image:"",data:[]}]);
  const [allData, setallData] = useState(() => {
    const storedData = localStorage.getItem('allData');
    return storedData? JSON.parse(storedData) : [{ floor: -1, image: null, data: [] }];
  });

  // Update local storage whenever the allData state changes
  useEffect(() => {
    localStorage.setItem('allData', JSON.stringify(allData));
  }, [allData]);

  const [addIdhistory, setAddIdhistory] = useState(-1);
  function onClickShape(id:any){//TODO open history for that id
    setShowHistory(true);
    setAddIdhistory(id);
  }
  function updateData(e:any){
    allData[selectedFloor].data=e;
    setallData([...allData]);
  }
  function onAddFloor() {
    setallData([...allData,{floor:allData[allData.length-1].floor+1,image:"",data:[]}]);
  }
  function onRemoveFloor(){
    allData.pop();
    selectedFloor==allData.length && setSelectedFloor(selectedFloor-1);
    allData.length==0 && allData.push({floor:-1,image:"",data:[]}),setSelectedFloor(0);
    setallData([...allData]);
  }
  function onAddBackground(){
    inputRef.current !=null && inputRef.current.click();
    
  }
  function handleFileChange(e:any){
    //localStorage.clear();
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        allData[selectedFloor].image=base64String;
        setallData([...allData]);
      };
      reader.readAsDataURL(file);
    }
  }

  function onUpdateFrequency(e:any){
    //send to api
    fetch('http://localhost:3001/api/freq',{ //pi.local !!!!!!!!!!!!!!!!!!!!!!!!
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json', // Set the content type header
      },
      body: JSON.stringify({ updateFreq: e *60000})//min to ms
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error(error));
    setUpdateFreq(e);
    
  }
  //realtime data
  const [useTemp, setUseTemp] = useState(false);
  useEffect(() => {

    console.log("useTemp changed")
    const fetchData = async () => {
      await fetchEventSource(`http://localhost:3001/subscribe`, { //pi.local !!!!!!!!!!!!!!!!!!!!!!!!
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
        onmessage(event) {
          const parsedData = JSON.parse(event.data);
          allData.forEach((floor:any) => {
            floor.data.forEach((shape:any) => {
              if(shape.id==parsedData.idLora ){
                console.log("updated shape color")
                if(useTemp){
                  const minTemp=-10;
                  const minHue=85;
                  const maxTemp=50;
                  const maxHue=0;
                  shape.color=`hsl(${minHue+(maxHue-minHue)*(parsedData.temp-minTemp)/(maxTemp-minTemp)},100%,50%)`;
                }
                else {
                  const minHum=0;
                  const minHue=129;
                  const maxHum=100;
                  const maxHue=214;
                  shape.color=`hsl(${minHue+(maxHue-minHue)*(parsedData.humd-minHum)/(maxHum-minHum)},100%,50%)`;
                }
              }
            });
          });
          setallData([...allData]);
          
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      });
    };
    onUpdateFrequency(updateFreq);
    fetchData();
  }, []);
    
  return (
    <>
    <Button onClick={()=>{showSettings?setShowSettings(false):setShowSettings(true)}} style={{position:"absolute",zIndex:100,padding:10,right: "0"}} size="lg" variant="info"><img src="src/assets/settings.svg" height={30}/></Button>
    <Settings onUpdateFrequency={(e)=>onUpdateFrequency(e)} updateFreq={updateFreq} showHistory={showHistory} showModify={showModify} trasparency={trasparency} radius={radius} showSettings={showSettings} onShowHistory={setShowHistory} onRadiusChange={setRadius} onShowModify={setShowModify} onTrasparencyChange={setTrasparency}/>

    <Stack direction="horizontal" gap={2} style={{margin:10}}>
      <h1>App</h1>
      <input style={{display: 'none'}} ref={inputRef} type="file" onChange={handleFileChange}/>
      <Modify showModify={showModify} allData={allData} onSelectedFloor={(e)=>{setModyfyPonts(-1),setSelectedFloor(e)}} onAddFloor={onAddFloor} onAddBackground={onAddBackground} onRemoveFloor={onRemoveFloor}/>
      <label>selected floor: <b>{allData[selectedFloor].floor!=-1 && allData[selectedFloor].floor}</b></label>
    </Stack>

    <MainArea radius={radius} trasparency={trasparency} showModify={showModify} heightInPercent={showHistory?55:75 } onCliskShape={(e)=>{onClickShape(e)}} modyfyPonts={modifyPonts} setModyfyPonts={(e)=>setModyfyPonts(e)} pointsData={allData[selectedFloor].data } setPointsData={(e)=>updateData(e)} imageData={allData[selectedFloor].image}/>
    <div>
      {showHistory && <History heightInPercent={20} id={addIdhistory}/>}
    </div>
    </>
  )
}

export default App
