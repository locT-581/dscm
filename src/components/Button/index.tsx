import { forwardRef } from "react";
import "./style.css";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  text: React.ReactNode;
  onClick?: () => void;
}

export default forwardRef<HTMLButtonElement, IButtonProps>(function Button(
  { color, text, onClick }: IButtonProps,
  ref
) {
  return (
    <button ref={ref} onClick={onClick} style={{ backgroundColor: color }} className="btn">
      {text}
    </button>
  );
});
