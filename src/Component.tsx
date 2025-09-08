// import React from 'react'
import { FC } from 'react';
import styled from 'styled-components'



interface IComponent {
    name: string;
    age?: number;
}
export const Component: FC<IComponent> = ({name, age}) => {
    return (
        <Wrapper color='blue'>
            <h1>Hello {name}!</h1>
            {age && <p>Age: {age}</p>}
        </Wrapper>
    );
};

type WrapperProps = {
    color: string;
}

const Wrapper = styled.div<WrapperProps>`
margin: 10px;
font-size: 20px;
cursor: pointer;
&: hover {
    color: ${({color}) => color ? color : 'green'};
}
`;