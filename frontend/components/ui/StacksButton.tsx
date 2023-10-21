import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// ⚠️ Disclaimer: Use of Tailwind CSS is optional
const button = cva('button', {
  variants: {
    intent: {
      primary: [
        'text-brown',
        'border-[2px] border-[#141414]',
        'border rounded-[3rem]',
        'shadow-darkshadow hover:shadow-darkershadow ',
        'hover:-translate-y-[4px]',
        'active:translate-y-[4px] active:shadow-activeshadow active:bg',
        'buttonShadow',
        'btn',
      ],
      secondary: [
        'bg-white',
        'text-gray-800',
        'border-gray-400',
        'hover:bg-gray-100',
      ],
    },
    size: {
      small: ['', 'py-1', 'px-2'],
      medium: ['', 'py-2', 'px-4'],
      large: ['', 'py-3', 'px-6'],
    },
    hover: {},
  },
  compoundVariants: [
    { intent: 'primary', size: 'medium', className: 'rounded-[2.3rem]' },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
})

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent = 'primary',
  size,
  children,
  ...props
}) => (
  <button className={button({ intent, size, className })} {...props}>
    {children}
  </button>
)
