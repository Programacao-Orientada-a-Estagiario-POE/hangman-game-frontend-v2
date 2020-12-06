import { useRef, useState, useEffect } from 'react';

import { Square } from './styles';

interface IDraw {
  life: number,
  isResetedGame: boolean,
}

const Draw: React.FC<IDraw> = ({life, isResetedGame}: IDraw)  => {
  const stickMan = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D>()

  const startHangman =  () => {
    draw( 10, 150, 150, 150); // bottom line
    draw( 10, 5, 10, 600); // vertical line ( bigger one )
    draw( 10, 5, 60, 5); // top line
    draw(60, 5, 60, 15); // rope
  }

  useEffect(() => {
    startHangman();
  }, [life])

  useEffect(()=> {
    console.log(isResetedGame)
    if(isResetedGame) reset()
  }, [isResetedGame])



  const draw = (pathFromX: number, pathFromY: number, pathToX: number, pathToY: number) => {
    if(stickMan.current) {
      const canvasContext  = stickMan.current.getContext('2d') ;
      if(canvasContext){
        canvasContext.strokeStyle = "#fff";
        canvasContext.lineWidth = 2;
        canvasContext.moveTo(pathFromX, pathFromY);
        canvasContext.lineTo(pathToX, pathToY);
        canvasContext.stroke();
        setContext(canvasContext)
      }
    }

  }

  const head = () => {
    if(context) {
      context.beginPath();
      context.arc(60, 25, 10, 0, Math.PI*2, true);
      context.stroke();
    }
  }

  const drawParts = () => {
    if(life <= 5)  head();
    if(life <= 4)  draw (60, 36, 60, 70);
    if(life <= 3)  draw (60, 46, 100, 50);
    if(life <= 2)  draw (60, 46, 20, 50);
    if(life <= 1)  draw (60, 70, 100, 100);
    if(life == 0)  draw (60, 70, 20, 100);
  }
  const reset = () => {
    if(context) {
      context.clearRect(0, 0, 400, 400)
      startHangman()
    }
  }

  return (
    <>
      <Square ref={stickMan}></Square>
    </>
    )


}

export default Draw;
