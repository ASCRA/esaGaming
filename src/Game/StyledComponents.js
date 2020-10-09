import styled, { css } from 'styled-components';

function calculateObjSize(){
  const widescreenSizeModifier = (window.innerHeight > window.innerWidth) ? 1 : 0.75;
  return Math.floor(Math.min(Math.floor(window.innerWidth / 20), Math.floor(window.innerHeight / 20)) * widescreenSizeModifier);
}

const GameBody = styled.div`
    margin-top: 0px;
`;

const Panel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  top: ${props => props.top*calculateObjSize() + window.innerHeight/2}px;
  left: ${props => (window.innerWidth/2 + props.left*calculateObjSize())}px;
  width: ${calculateObjSize()*4}px;
  height: ${calculateObjSize()*2.5}px;
  background-color: green;
  color: white;
  font-size: ${calculateObjSize()*0.5}px;
  border: 5px solid #2b0000ff;
  border-radius: 10%;
`

const Image = styled.img`
  width: ${props => props.width*calculateObjSize()}px;
  height: ${props => props.height*calculateObjSize()}px;
  ${props => props.arrowImg && css`
    margin-top: ${calculateObjSize()*0.1}px;
  `}
  ${props => props.betImg && css`
  margin: ${props => -calculateObjSize()*0.35}px;
  `}
  
`

const Button = styled.button`
  position: absolute;
  top: ${props => props.top*calculateObjSize() + window.innerHeight/2}px;
  left: ${props => (window.innerWidth/2 + props.left*calculateObjSize())}px;
  width: ${props => props.width*calculateObjSize()}px;
  height: ${props => props.height*calculateObjSize()}px;
  background-color: #2b0000ff;
  color: white;
  font-size: ${calculateObjSize()*0.5}px;
  padding: 0;
  margin: -${calculateObjSize()*0.75}px;
  border: 2px solid black;
  border-radius: ${props => props.radius}%;
`

export {Button, GameBody, Panel, Image}