import { useState, useEffect, memo } from "react";
import ColorPickerComponent, {
  ColorPickerProps as ColorPickerComponentProps,
} from "react-best-gradient-color-picker";

interface ColorPickerProps extends Partial<ColorPickerComponentProps> {
  setColor: (color: string) => void;
  color?: string;
}

const ColorPicker = memo(function ColorPicker({
  setColor,
  color,
  ...rest
}: ColorPickerProps) {
  const [palette, setPalette] = useState<string>(color || "#000000");

  useEffect(() => {
    if (color && color !== palette) {
      setPalette(color);
    }
  }, [color]);

  const handleChange = (newColor: string) => {
    if (newColor !== palette) {
      setColor(newColor);
      setPalette(newColor);
    }
  };

  return (
    <div>
      <ColorPickerComponent
        onChange={handleChange}
        // value={palette}
        hideEyeDrop
        {...rest}
      />
    </div>
  );
});

export default ColorPicker;
