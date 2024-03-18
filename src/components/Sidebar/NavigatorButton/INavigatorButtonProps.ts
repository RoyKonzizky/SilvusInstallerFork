export interface INavigatorButtonProps {
    href: string;
    text: string;
    file: string;
    subsections?: JSX.Element;
    isSubsection: boolean;
    onClick?: () => void;
}