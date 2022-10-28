import styled from 'styled-components'

export const Container = styled.div`
     background:white;
     height: 95vh;
`

export const Box = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;
`


export const socialBox = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;
`


export const Select = styled.select`
	margin:0px;
	min-width: 0;
	display: block;
	width: 500px;
	padding: 8px 8px;
	line-height: inherit;
	border: 1px solid;
	border-radius: 4px;
	color: inherit;
	background-color: transparent;
	&:focus {
		border-color: black;
	}
`;


export const ProfileBox = styled.div`
display: flex;
height: 100%;
justify-content: center;
`

export const ProfileInput=styled.input`
	border: 2px solid gray;
	border-radius: 5px;
`


export const ProfileSelect = styled.select`
	margin:0px;
	min-width: 0;
	display: block;
	width: 200px;
	padding: 8px 8px;
	line-height: inherit;
	border: 2px solid gray;
	border-radius: 8px;
	color: inherit;
	background-color: transparent;
	&:focus {
		border-color: black;
	}
`;
