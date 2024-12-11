import {ChangeEvent, Dispatch, SetStateAction} from "react";

interface IImageImport {
    setBackgroundImage: Dispatch<SetStateAction<string | null>>
}

export function ImageImport(props: IImageImport) {
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    props.setBackgroundImage(reader.result); // Set base64 image as background
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return(
        <input type="file" accept="image/*" onChange={handleImageUpload} className={'w-72 h-14'}/>
    );
}