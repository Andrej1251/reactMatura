
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap"

interface Props {
    tempHumData: any[];
}

const Info = ({tempHumData}:Props) => {
    const [show, setShow] = useState(true);
    const typesOfErrors=[
        {
        hedding:"temperature too high",
        variant:"danger",
        text:"The temperature is too high you should open the window",
        },
        {
        hedding:"temperature too low",
        variant:"danger",
        text:"The temperature is too low you should close the window",
        },
        {
        hedding:"humidity too high",
        variant:"danger",
        text:"The humidity is too high you should open the window",
        },
        {
        hedding:"humidity too low", 
        variant:"danger",
        text:"The humidity is too low you should close the window",
        },
        {
        hedding:"no data received",
        variant:"warning",
        text:"No data received from the sensor",
        }
    ];

    
    const [id, setId] = useState([4]);
    useEffect(() => {
        tempHumData.map((data:any) => {
            var test=[];
            if(data.temp>50){
                test.push(0);
            }
            else if(data.temp<-10){
                test.push(1);
            }
            else if(data.humd>90){
                test.push(2);
            }
            else if(data.humd<10){
                test.push(3);
            }
            else if(data.temp==null || data.humd==null){
                test.push(4);
            }
            setId([]);
            setId(test);
            
            setShow(true);
    });
    }, [tempHumData]);
    return (
        id.map((id:any) => (
            <>
            <Alert variant={typesOfErrors[id].variant} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{typesOfErrors[id].hedding}</Alert.Heading>
                <p>
                {typesOfErrors[id].text}
                </p>
            </Alert>
            
            </>
            
        ))
    );

}

export default Info