import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
interface Props {
    heightInPercent:number;
    id:number;
}

//const data = [{name: 'Pont 1', temp: 400, hum: 2400},{name: 'Pont 1', temp: 800, hum: 200},{name: 'Pont 1', temp: 200, hum: 100}];
const History = ({heightInPercent,id}:Props) => {
    const[pointsData,setPointsData]=useState([{}]);
    function onClick(e:any){ //TODO send request to server
        if (e.target.value=="show all submit") {
            id=-1;
        }
        e.preventDefault();
        const from = (document.querySelector('input[name="from"]') as HTMLInputElement).value;
        const to = (document.querySelector('input[name="to"]') as HTMLInputElement).value;
        if (from && to) {
            console.log(id);
            //send request to server
            fetch('http://192.168.8.150:3001/api/history',{ //pi.local !!!!!!!!!!!!!!!!!!!!!!!!
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json', // Set the content type header
            },
            body: JSON.stringify({"from":from,"to":to,"id":id})//min to ms
            })
            .then(response => response.json())
            .then(json => setPointsData(json.data))
            .catch(error => console.error(error));
        }
    };
    

    return (
    <>
        <hr/>
        <Form.Group style={{margin:5,display: "flex"}}>
            <Form.Label style={{flex:0.5}} >Select date from-to:</Form.Label>
            <Form.Control style={{flex:1}} type="datetime-local" name="from" placeholder="Select from" />
            <Form.Control style={{flex:1}} type="datetime-local" name="to" placeholder="Select to" />
            <Form.Control style={{flex:1}} type="submit" onClick={onClick} value="Submit" />
            <Form.Control style={{flex:1}} type="submit" onClick={onClick} value="show all submit" />
        </Form.Group>
        <LineChart width={window.innerWidth} height={(window.innerHeight*heightInPercent)/100} data={pointsData}>
            <Line type="monotone" dataKey="tem" stroke="red" />
            <Line type="monotone" dataKey="hum" stroke="blue" />
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="datetime"/>
            <YAxis />
        </LineChart>
        
    </>

    )
}

export default History
