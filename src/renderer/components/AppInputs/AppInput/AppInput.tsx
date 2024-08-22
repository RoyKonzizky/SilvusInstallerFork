import { IAppInputProps } from './IAppInputProps';
import { useTranslation } from 'react-i18next';
import { TextualAppInput } from "./TextualAppInput/TextualAppInput.tsx";

function AppInput(props: IAppInputProps) {
    const { i18n } = useTranslation();

    return (
        <div className={`flex ${(props.type === 'text' || props.type === 'number') && 'bg-[#303030]/70 w-[50%]'} p-3 rounded-xl`}>
            {i18n.language === 'en' && <TextualAppInput type={props.type} label={props.label} />}
            {props.values ? (
                <select
                    value={props.value}
                    onChange={(event) => {
                        if (props.setValue) props.setValue(event.target.value);
                    }}
                    className={`bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-[50%] ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end text-end rtl"} p-2 rounded-xl`}
                >
                    {props.values.map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={props.type === 'number' ? 'text' : props.type}
                    value={props.type === 'button' ? props.label : props.value}
                    onClick={() => {
                        if (props.onClick) props.onClick();
                    }}
                    onChange={(event) => {
                        if (props.setValue) props.setValue(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (
                            props.type === 'number' &&
                            ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(event.key) === -1
                        )
                            event.preventDefault();
                        if (props.type === 'text' && [' ', '/', '\\'].indexOf(event.key) !== -1) event.preventDefault();
                    }}
                    inputMode={props.type === 'number' ? 'numeric' : 'text'}
                    className={`bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${props.type === 'text' || props.type === 'number'
                            ? `w-[65%] ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end text-end"} p-2 rounded-xl`
                            : props.type === 'button' && 'inline-block px-6 py-3 font-semibold rounded-full border-3 border-teal-500 text-teal-500 transition duration-150 ease-in-out'
                        }`}
                />
            )}
            {i18n.language === 'he' && <TextualAppInput type={props.type} label={props.label} />}
        </div>
    );
}

export default AppInput;