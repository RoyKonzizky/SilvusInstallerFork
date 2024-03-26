import {IBottomCircleProps} from "./IBottomCircleProps.ts";

function BottomCircle(props: IBottomCircleProps) {
    return (
        <svg width={props.radius * 2} height={props.radius * 2}>
            <circle cx={props.radius} cy={props.radius} r={props.radius} fill={props.bgColor}/>
            <image xlinkHref={props.image} x="15%" y="15%" width={props.radius * 1.5} height={props.radius * 1.5} />
        </svg>
    );
}

export default BottomCircle;