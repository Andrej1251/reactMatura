import { Form } from "react-bootstrap"
interface Props {
    onShowModify: (showModify: boolean) => void;
    showModify:boolean;
    onTrasparencyChange: (trasparency: number) => void;
    trasparency:number;
    onRadiusChange: (radius: number) => void;
    radius:number;
    onShowHistory: (showHistory: boolean) => void;
    showHistory:boolean;
    showSettings:boolean;
    onUpdateFrequency: (updateFreq: number) => void;
    updateFreq:number;
}
const Settings = ({showSettings,showHistory,showModify,trasparency,radius,updateFreq,onUpdateFrequency,onShowHistory,onRadiusChange,onShowModify,onTrasparencyChange}:Props) => {

  return (
    <>
    
    {showSettings && <div style={{top:60,width:"30%", position:"absolute",zIndex:100, backgroundColor:"#e6e6e6",padding:10,right: "0"}}>
    <Form>
      <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label="show modify"
        checked={showModify}
        onChange={(e:any)=>{onShowModify(e.target.checked)}}
      />
      <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch2"
        label="show history"
        checked={showHistory}
        onChange={(e:any)=>{onShowHistory(e.target.checked)}}
      />
      <Form.Label>Select trasparency</Form.Label>
      <Form.Range defaultValue={trasparency*100} onChange={(e:any)=>{onTrasparencyChange(e.target.value/100)}} />
      <Form.Label>Select radius</Form.Label>
      <Form.Range defaultValue={radius} onChange={(e:any)=>{onRadiusChange(e.target.value)}} />
      <Form.Label>Update frequency type new value
      <input  type="number" value={updateFreq} onChange={(e:any)=>{onUpdateFrequency(e.target.value)}}/>
       min
      </Form.Label>
    </Form>
    </div>}
    </>
  )
}

export default Settings