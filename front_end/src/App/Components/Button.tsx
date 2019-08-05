import styled from 'styled-components'
import styledTs from 'styled-components-ts'

export interface btnProps {
    background?: string
    fontSize?: string
    color?:string
}

export default styledTs<btnProps>(styled.button) `
    font-size: ${props => props.fontSize ? props.fontSize : '18px'};
    background: ${props => props.background ? props.background : '#fff'};
    color: ${props => props.color ? props.color : '#262626'};
    padding: 15px 0;
    width: 100%;
    text-align: center
`