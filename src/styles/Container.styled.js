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