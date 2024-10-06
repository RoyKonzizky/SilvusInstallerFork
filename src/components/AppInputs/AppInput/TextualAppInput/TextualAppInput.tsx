import {ITextualAppInputProps} from "./ITextualAppInputProps.ts";
import { useTranslation } from 'react-i18next';

export function TextualAppInput(props: ITextualAppInputProps) {
    const { i18n } = useTranslation();

    return (
        <>
            {(props.type === 'text' || props.type === 'number') && <label className={`w-[60%] flex ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end"}`}>{props.label}</label>}
        </>
    );
}