import styled from 'styled-components'
import styledTs from 'styled-components-ts'

export interface ItemPorps {
    leftGap: number
    index: number
    normalGap: number
}

function borderTop(props:ItemPorps):string | any {
    if (props.index > 0) {
        return `
        position: relative;
        ::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 0.5px;
            width: 100%;
            background: -webkit-linear-gradient(left, #fff 0, #fff ${props.leftGap}px, #D5D5D5 ${props.leftGap}px, #D5D5D5);
        }
        `
    }
}

export default styledTs<ItemPorps>(styled.li)`
background: #fff;
display: flex;
padding: ${props => props.normalGap}px;
${props => borderTop(props)}
`