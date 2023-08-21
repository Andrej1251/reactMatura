import { Button, Stack, Dropdown, Form} from 'react-bootstrap';

interface Props {
    allData: any;
    onSelectedFloor: (floor: number) => void;
    onAddFloor: () => void;
    onRemoveFloor: () => void;
    onAddBackground: () => void;
    showModify: boolean;
    showHumTemp: boolean;
    onShowHumTemp: (showHumTemp: boolean) => void;
}
const Modify = ({allData,showModify, showHumTemp,onShowHumTemp,onSelectedFloor,onAddFloor,onRemoveFloor,onAddBackground}:Props) => {
  return (
    <>
        <Stack direction="horizontal" gap={2} style={{margin:10}}>
            <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">select floor</Dropdown.Toggle>
            <Dropdown.Menu>
                {allData.map((array:any,index:any)=>(
                    array.floor!=-1 && <Dropdown.Item key={index} onClick={()=>{onSelectedFloor(index)}}>{array.floor}</Dropdown.Item>
                )
                )}
            </Dropdown.Menu>
            </Dropdown>
            {showModify &&<Button as="a" variant="success" onClick={onAddFloor}>add floor</Button>}
            {showModify &&<Button as="a" variant="danger" onClick={onRemoveFloor}>remove floor</Button>}
            {showModify &&<Button as="a" variant="warning" onClick={onAddBackground}>add background</Button>}
            <Form.Check 
                type="switch"
                id="custom-switch"
                label="switch humidity/temperature"
                checked={showHumTemp}
                onChange={(e:any)=>{onShowHumTemp(e.target.checked)}}
            />
        </Stack>
    </>
  )
}

export default Modify