import { ITextualAppInputProps } from "./ITextualAppInputProps.ts";
import { useTranslation } from 'react-i18next';

export function TextualAppInput(props: ITextualAppInputProps) {
    const { i18n } = useTranslation();

    return (
        <>
            {(props.type === 'text' || props.type === 'number') &&
                <label
                    style={{
                        display: 'flex',
                        width: '50%',
                        textAlign: i18n.language === 'en' ? "left" : "right",
                        direction: i18n.language === 'en' ? "ltr" : "rtl",
                        alignItems: 'center'
                    }}
                >
                    {props.label}
                </label>
            }
        </>
    );
}