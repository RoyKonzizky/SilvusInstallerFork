export interface INavigatorButtonProps {
    href: string;
    text: string;
    file: string;
    subsections?: JSX.Element;
    possibleHrefSubsections?: string[];
    isSubsection: boolean;
    onClick?: () => void;
}