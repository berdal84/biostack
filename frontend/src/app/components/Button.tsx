import {
    Button as BaseButton,
    ButtonProps
} from '@mui/base/Button';
import React from 'react';

/**
 * Wrapped MUI BaseButton with some Tailwind style.
 */
const Button = React.forwardRef(function Button(
    props: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) {
    return <BaseButton
        {...props}
        ref={ref}
        className="bg-amber-500 hover:bg-amber-500/75 text-white p-2 rounded-sm"
    />;
})

export default Button
