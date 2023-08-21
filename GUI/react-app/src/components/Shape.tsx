import {Line,  Layer, Circle} from 'react-konva';
import { useEffect, useState } from 'react';
interface Props {
    pointsData: number[];
    color: string;
    modyfyPonts: boolean;
    trasparency: number;
    padding: number;
    radius: number;
    onModify: (pointsData: number[]) => void;
    onClickShape: () => void;
}
const Shape = ({pointsData,color,modyfyPonts,trasparency,onModify, onClickShape, padding,radius}:Props) => {
  const [points, setPoints] = useState(pointsData);
  const handleDrag = (e:any) => {
    points[e.target.index*2]=e.target.x();
    points[e.target.index*2+1]=e.target.y();
    setPoints([...points]);
    onModify(points);
  }
  useEffect(() => {
    setPoints(pointsData);
  }, [pointsData])
  
  return (
    <>
      <Layer>
          {modyfyPonts ?<Line x={padding} y={padding} points={points} onClick={()=>{onClickShape}} stroke={"black"} closed fill={color} />:<Line x={padding} y={padding} points={points} stroke={color} onClick={()=>{onClickShape()}} opacity={trasparency} closed fill={color} />}
      </Layer>
      <Layer>
      {modyfyPonts && 
      points.map((point, index2) => (
          index2%2!=0 && <Circle x={points[index2-1]+padding} y={point+padding} key={index2} draggable radius={radius} fill={"black"} onDragEnd={handleDrag}/>
      ))
      }
      </Layer>
    </>
  )
}

export default Shape