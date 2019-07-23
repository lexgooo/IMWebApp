import styled from 'styled-components'
import styledTs from 'styled-components-ts'

export interface itemStyleProps {
    leftGap: number,
    normalGap: number,
    index: number
}

function borderTop(props:itemStyleProps):any {
    return `
        position: relative;
        ::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 0.5px;
            background: -webkit-linear-gradient(left, #fff 0, #fff ${props.leftGap}px, #E7E7E7 ${props.leftGap}px, #E7E7E7)
        }
    `
}

export default styledTs<itemStyleProps>(styled.li) `
    background: #fff;
    display: flex;
    align-items: center;
    padding: ${props => props.normalGap}px;
    ${props => {
        if (props.index > 0) {
            return borderTop(props)
        }
    }}
`