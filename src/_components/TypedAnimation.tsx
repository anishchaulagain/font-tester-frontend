import { TypeAnimation } from 'react-type-animation';

const TypedAnimation = () => {
    return (
        <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'Typography.',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Lettering.',
                1000,
                'Message.',
                1000,
                'Fonts.',
                1000,

                'Aesthetic.',
                1000
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            repeat={Infinity}
        />
    );
};

export default TypedAnimation