import {  Stage, Image, Layer } from 'react-konva';
import Shape from './Shape';
import { Button, Stack, Dropdown, Form } from 'react-bootstrap';
import { useEffect, useState} from 'react';
import useImage from 'use-image';

interface Props {
    trasparency: number;
    padding?: number;
    radius: number;
    pointsData: any;
    setPointsData: (pointsData: any) => void;
    imageData:any;
    modyfyPonts:number;
    setModyfyPonts:(modifyPonts:number)=>void;
    onCliskShape:(id:number)=>void;
    heightInPercent:number;
    showModify:boolean;
}
const MainArea = ({trasparency,padding=10,radius,showModify,heightInPercent,pointsData,imageData,modyfyPonts,onCliskShape,setModyfyPonts,setPointsData}:Props) => {
  
  useEffect(() => {setPointsData(pointsData)}, [pointsData,imageData]);
  function addData(){
    setPointsData([...pointsData,{id:-1,color:'blue',text:"null",points:[0,0,0,100,100,100,100,0]}]);
  };
  function removeData(){
    setPointsData(pointsData.slice(0,pointsData.length-1));
  }
  function removePoint(){
    pointsData[modyfyPonts].points=pointsData[modyfyPonts].points.slice(0,pointsData[modyfyPonts].points.length-2)
    setPointsData([...pointsData]);

  };
  function addPoint(){
    pointsData[modyfyPonts].points=[...pointsData[modyfyPonts].points,0,0]
    setPointsData([...pointsData]);
  };
  const [status, setStatus] = useState('');//update status of the server

  function onSubmit(e:any){
    e.preventDefault();
    pointsData[modyfyPonts].id=e.target.id.value;
    pointsData[modyfyPonts].text=e.target.text.value;
    setPointsData([...pointsData]);
    fetch('http://localhost:3001/api/newID',{//pi.local !!!!!!!!!!!!!!!!!!!!!!!!
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json', // Set the content type header
      },
      body: JSON.stringify({ id: e.target.id.value, name:e.target.text.value})//min to ms
    })
      .then(response => response.json())
      .then(json => {if (json.status!=200) {setStatus(json.data)}})
      .catch(error => console.error(error));
  }
  const BackgroundImage = () => {
    const [image] = useImage(imageData);
    //console.log(image);
    if (image!=null) {
      let a=(window.innerHeight*heightInPercent)/100;
      return <Image  image={image} height={a} width={(heightInPercent*image?.width)/100}/>;
    };
    
    return <Image image={image}/>;

  };
  return (
    <>
      <Stack direction="horizontal" gap={2}>
          <Dropdown>
          {showModify &&<Dropdown.Toggle variant="info" id="dropdown-basic">select Modify</Dropdown.Toggle>}

          <Dropdown.Menu>
            {pointsData.map((array:any,index:any)=>(
              <Dropdown.Item key={index} onClick={()=>{setModyfyPonts(index)}}>{array.id}</Dropdown.Item>
            )
            )}
          </Dropdown.Menu>
        </Dropdown>
        {showModify && modyfyPonts!=-1 && 
          <>
          <Button as="a" variant="danger" onClick={removePoint}>remove point</Button>
          <Button as="a" variant="success" onClick={addPoint}>add point</Button>
          update id:
          <Form onSubmit={onSubmit}>
            <label>
            <Form.Control type="number" name="id" placeholder= {'' + pointsData[modyfyPonts].id}/>
            </label>
            Update text:
            <label>
            <Form.Control type="text" name="text" placeholder= {'' + pointsData[modyfyPonts].text}/>
            </label>
            <label>
            <Form.Text className="text-muted">
              {status}
            </Form.Text>
            </label>
            <label>
              <button type="submit">Submit</button>
            </label>
          </Form>
          <Button as="a" variant="warning" onClick={()=>{setModyfyPonts(-1)}}>Back</Button>
          </>
        }
        {showModify && modyfyPonts==-1 && 
          <>
          <Button as="a" variant="success" onClick={addData}>add data</Button>
          <Button as="a" variant="danger" onClick={removeData}>removeData</Button>
          </>
        }
      </Stack>
      <hr/>
      <Stage width={window.innerWidth} height={(window.innerHeight*heightInPercent)/100}>
        <Layer>
          <BackgroundImage />
        </Layer>
        {pointsData.map((array:any,index:any)=>(
          <Shape onClickShape={()=>{onCliskShape(array.id)}} pointsData={array.points} key={index} color={array.color} modyfyPonts={modyfyPonts==index} onModify={(a)=>{array.points=a}} trasparency={trasparency} padding={padding} radius={radius}/>
        ))
        }
        
      </Stage>
      
    </>
  )
}

export default MainArea