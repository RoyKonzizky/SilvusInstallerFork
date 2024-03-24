export interface INavigatorButtonProps {
    href: string;
    isSandwichCollapsed: boolean;
    text: string;
    file: string;
    subsections?: JSX.Element;
    possibleHrefSubsections?: string[];
    isSubsection: boolean;
    onClick?: () => void;
}