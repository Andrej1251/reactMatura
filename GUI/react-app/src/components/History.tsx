import { Form } from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
interface Props {
    data: any;
    heightInPercent:number;
}
function onClick(e:any){ //TODO send request to server
    e.preventDefault();
    const from = (document.querySelector('input[name="from"]') as HTMLInputElement).value;
    const to = (document.querySelector('input[name="to"]') as HTMLInputElement).value;
    if (from && to) {
        console.log(from,to);
    }
};
const History = ({data,heightInPercent}:Props) => {
    return (
    <>
        <hr/>
        <Form.Group style={{margin:5,display: "flex"}}>
            <Form.Label style={{flex:0.5}} >Select date from-to:</Form.Label>
            <Form.Control style={{flex:1}} type="datetime-local" name="from" placeholder="Select from" />
            <Form.Control style={{flex:1}} type="datetime-local" name="to" placeholder="Select to" />
            <Form.Control style={{flex:1}} type="submit" onClick={onClick} value="Submit" />
        </Form.Group>
        <LineChart width={window.innerWidth} height={(window.innerHeight*heightInPercent)/100} data={data}>
            <Line type="monotone" dataKey="temp" stroke="red" />
            <Line type="monotone" dataKey="hum" stroke="blue" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
        </LineChart>
        
    </>

    )
}

export default History