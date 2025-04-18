type IconProps = {
  color?: string;
  height?: number;
  width?: number;
};

const BringToFrontIcon = ({
  color = "black",
  height = 24,
  width = 24,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 0C8.552 0 9 0.448 9 1V3H14C14.552 3 15 3.448 15 4V9H17C17.552 9 18 9.448 18 10V17C18 17.552 17.552 18 17 18H10C9.448 18 9 17.552 9 17V15H4C3.448 15 3 14.552 3 14V9H1C0.448 9 0 8.552 0 8V1C0 0.448 0.448 0 1 0H8ZM13 5H5V13H13V5Z"
      fill={color}
    />
  </svg>
);

const SendToBackIcon = ({
  color = "black",
  height = 24,
  width = 24,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 0C8.552 0 9 0.448 9 1V3H14C14.552 3 15 3.448 15 4V9H17C17.552 9 18 9.448 18 10V17C18 17.552 17.552 18 17 18H10C9.448 18 9 17.552 9 17V15H4C3.448 15 3 14.552 3 14V9H1C0.448 9 0 8.552 0 8V1C0 0.448 0.448 0 1 0H8ZM13 5H9V8C9 8.552 8.552 9 8 9H5V13H9V10C9 9.448 9.448 9 10 9H13V5Z"
      fill={color}
    />
  </svg>
);

export { BringToFrontIcon, SendToBackIcon };
