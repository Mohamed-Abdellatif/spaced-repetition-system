import {
  BaseButton,
  GoogleSignInButton,
  InvertedButton,
} from "./button.styles";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

export const BUTTON_TYPE_CLASSES = {
  base: "base",
  google: "google",
  inverted: "inverted",
} as const;

// Use key type (base | google | inverted)
export type ButtonType = keyof typeof BUTTON_TYPE_CLASSES;

// Button props interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonType?: ButtonType;
}

// Map button types to styled components
const getButton = (buttonType: ButtonType = "base") => {
  const buttonMap = {
    base: BaseButton,
    google: GoogleSignInButton,
    inverted: InvertedButton,
  };

  return buttonMap[buttonType] || BaseButton;
};

// Functional component
const Button: FC<ButtonProps> = ({
  children,
  buttonType = "base",
  ...otherProps
}) => {
  const CustomButton = getButton(buttonType);

  return (
    <CustomButton
      type="button"
      className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
      {...otherProps}
    >
      {children}
    </CustomButton>
  );
};

export default Button;
