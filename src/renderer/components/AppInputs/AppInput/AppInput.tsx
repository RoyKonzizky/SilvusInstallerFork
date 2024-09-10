import {IAppInputProps} from './IAppInputProps';
import {useTranslation} from 'react-i18next';
import {TextualAppInput} from "./TextualAppInput/TextualAppInput.tsx";
import AsyncSelect from 'react-select/async';
import {frequencyLabelsAndValues} from "../../../constants/SilvusDropDownValues.ts";
import {useState} from "react";

function AppInput(props: IAppInputProps) {
    const { t, i18n } = useTranslation();
    const [inputValue, setInputValue] = useState(''); // State to manage what the user types

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);  // Update the input field with what the user is typing
        return newValue;
    };

    const filterFrequency = (inputValue: string) => {
        return frequencyLabelsAndValues.filter((i) =>
            i.value.includes(inputValue)
        );
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: { label: string, value: string }[]) => void
    ) => {
        // Show all options when the input value is empty
        if (inputValue === '') {
            callback(frequencyLabelsAndValues);  // Show all options
        } else {
            callback(filterFrequency(inputValue));  // Otherwise, filter based on input
        }
    };

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: '#303030',
            border: state.isFocused ? '2px solid #4A5568' : '1px solid #2D3748', // focus ring and default border
            boxShadow: state.isFocused ? '0 0 0 2px rgba(72, 187, 120, 0.5)' : 'none',
            borderRadius: '0.75rem',
            textAlign: i18n.language === 'he' ? 'right' : 'left',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4A5568' : '#2D3748',
            color: state.isSelected ? '#FFFFFF' : '#A0AEC0',
            padding: '10px',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#303030',
            borderRadius: '0.75rem',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#A0AEC0',
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#FFFFFF', // Make the input text white
            direction: i18n.language === 'he' ? 'rtl' : 'ltr', // Ensure correct cursor position based on language
        }),
    };

    const handleSelectChange = (selectedOption: { label: string, value: string } | null) => {
        if (props.setValue && selectedOption) props.setValue(selectedOption.value);  // Sync the selected value with props
    };

    // Ensure defaultValue and value are in the correct format
    const defaultValue = props.value ? { label: props.value, value: props.value } : null;

    return (
        <div className={`flex ${(props.type === 'text' || props.type === 'number') && 'bg-[#303030]/70 w-[50%]'} p-3 rounded-xl`}>
            {i18n.language === 'en' && <TextualAppInput type={props.type} label={props.label}/>}
            {props.label === t('frequency') &&
                <div
                    className={`bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-[50%] ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end text-end rtl"} p-2 rounded-xl`}
                >
                    <AsyncSelect
                        defaultOptions={frequencyLabelsAndValues}
                        cacheOptions
                        loadOptions={loadOptions}
                        value={defaultValue}  // Set the selected value
                        defaultValue={defaultValue}  // Show the default selected value initially
                        inputValue={inputValue}  // Allow the user to type
                        onInputChange={handleInputChange}  // Update the input value
                        onChange={handleSelectChange}  // Handle selection changes
                        styles={customStyles}  // Apply custom styles
                        className={`${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "text-end rtl"}`}
                    />
                </div>
            }
            {props.values ? (props.label !== t('frequency') &&
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
            ) : (props.label !== t('frequency') &&
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
                    className={`bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${
                        props.type === 'text' || props.type === 'number'
                            ? `w-[50%] ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end text-end"} p-2 rounded-xl`
                            : props.type === 'button' && 'inline-block px-6 py-3 font-semibold rounded-full border-3 border-teal-500 text-teal-500 transition duration-150 ease-in-out'
                    }`}
                />
            )}
            {i18n.language === 'he' && <TextualAppInput type={props.type} label={props.label}/>}
        </div>
    );
}

export default AppInput;