import React from "react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };

/** 👍 */
export const LikeIcon = ({ size = 20, ...p }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
       fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 9h4a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2h-7a3 3 0 0 1-3-3V10l4-6a2 2 0 0 1 2 2v3z"/>
    <path d="M7 10H4a2 2 0 0 0-2 2v6h5"/>
  </svg>
);

/** 👎 */
export const DislikeIcon = ({ size = 20, ...p }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
       fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10 15H6a2 2 0 0 1-2-2l1-7a2 2 0 0 1 2-2h7a3 3 0 0 1 3 3v7l-4 6a2 2 0 0 1-2-2v-3z"/>
    <path d="M17 14h3a2 2 0 0 0 2-2V6h-5"/>
  </svg>
);

/** 🔖 */
export const BookmarkIcon = ({ size = 20, ...p }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
       fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

/** … */
export const MoreIcon = ({ size = 20, ...p }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size}
       fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="5"  cy="12" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="19" cy="12" r="1"/>
  </svg>
);
