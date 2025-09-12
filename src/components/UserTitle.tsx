// import React from 'react'
import { FC, useState } from 'react';
import styled from 'styled-components'



interface IComponent {
    userName?: string;
}
export const UserTitle: FC<IComponent> = ({userName}) => {
    const [value, setValue] = useState(userName);
    const [list, setList] = useState<string[]>([
        'Alex',
        'Serg',
        'Mike'
    ]);

    const getInitial = (name?: string) =>
        name
            ?.split(' ')
            ?.map((word) => word[0])
            ?.join('')
            ?.toUpperCase();
    return (
        <Wrapper>
            {!!userName ? (
          <UserFirstLetterWrapper>{getInitial(userName)}</UserFirstLetterWrapper> 
            ):(
            <UserFirstLetterWrapper>AM</UserFirstLetterWrapper> 
            )}
          <UserName>{value}</UserName>
          <button onClick={() => setValue('Sergey Man')}>Change Name</button>
          <ol>
            {list.map((element: string, index) => (
                <li key={index}>{element}</li>
            ))}
          </ol>
        </Wrapper>
    );
};

type WrapperProps = {
    color: string;
    rols: string;
}

const Wrapper = styled.div`
padding: 20px;
background-color: blue;
display: flex;
gap: 20px;
`;

const UserName = styled.p`
font-size: 18px;
color: white;
`;
const UserFirstLetterWrapper = styled.div`
padding: 20px;
background-color: aqua;
`;