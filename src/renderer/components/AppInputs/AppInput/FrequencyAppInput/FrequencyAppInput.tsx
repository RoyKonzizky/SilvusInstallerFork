import {useTranslation} from "react-i18next";
import {useState} from "react";
import {frequencyLabelsAndValues} from "../../../../constants/SilvusDropDownValues.ts";
import AsyncSelect from "react-select/async";
import {IFrequencyAppInputProps} from "./IFrequencyAppInputProps.ts";

function FrequencyAppInput(props: IFrequencyAppInputProps) {
    const {i18n} = useTranslation();
    const [inputValue, setInputValue] = useState(''); // State to manage what the user types

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);  // Update the input field with what the user is typing
        return newValue;
    };

    const filterFrequency = (inputValue: string) => {
        return frequencyLabelsAndValues.filter((i) => i.value.includes(inputValue));
    };

    const loadOptions = (inputValue: string, callback: (options: { label: string, value: string }[]) => void) => {
        callback(filterFrequency(inputValue));  // Otherwise, filter based on input
    };

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: '#1F2937',
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
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#A0AEC0',
        }),
        input: (provided: any) => ({
            ...provided,
            backgroundColor: '#1F2937',
            color: '#FFFFFF', // Make the input text white
            direction: i18n.language === 'he' ? 'rtl' : 'ltr', // Ensure correct cursor position based on language
        }),
    };

    const handleSelectChange = (selectedOption: { label: string, value: string } | null) => {
        if (props.setValue && selectedOption) props.setValue(selectedOption.value);  // Sync the selected value with props
    };

    // Ensure defaultValue and value are in the correct format
    const defaultValue = props.value ? {label: props.value, value: props.value} : null;

    return (
        <div
            className={`w-[50%] ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end text-end rtl"} p-2 rounded-xl`}
        >
            <AsyncSelect
                cacheOptions loadOptions={loadOptions} value={defaultValue} defaultValue={defaultValue}
                inputValue={inputValue} defaultOptions={frequencyLabelsAndValues}
                onInputChange={handleInputChange} onChange={handleSelectChange} styles={customStyles}
                className={`${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "text-end rtl"}`}
            />
        </div>
    );
}

export default FrequencyAppInput;