import {IBottomCircleProps} from "./IBottomCircleProps.ts";

function BottomCircle(props: IBottomCircleProps) {
    return (
        <svg width={props.radius * 2} height={props.radius * 2}>
            <circle cx={props.radius} cy={props.radius} r={props.radius} fill={props.bgColor}/>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill='black'>
                {props.text}
            </text>
        </svg>
    );
}

export default BottomCircle;