import React from 'react';

type IconSizeProps = {
  width?: number;
  height?: number;
  color?: string;
};

function BookmarkIcon({ width = 16, height = 18, color = 'black' }: IconSizeProps): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 18"
      fill="none"
    >
      <path
        d="M12.6667 15.75L8.00004 12L3.33337 15.75V3.75C3.33337 3.35218 3.47385 2.97064 3.7239 2.68934C3.97395 2.40804 4.31309 2.25 4.66671 2.25H11.3334C11.687 2.25 12.0261 2.40804 12.2762 2.68934C12.5262 2.97064 12.6667 3.35218 12.6667 3.75V15.75Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BookmarkIcon;
