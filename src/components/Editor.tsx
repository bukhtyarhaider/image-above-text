import { Stage, Layer } from "react-konva";

const Editor: React.FC = () => {
  const stageWidth = 800;
  const stageHeight = 600;

  return (
    <div>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer></Layer>
      </Stage>
    </div>
  );
};

export default Editor;
