import {TFunction} from "i18next";

export function snrColors(t: TFunction<"translation", undefined>): { explanation: string, color: string }[] {
    return [
        {explanation: t('badConnection'), color: 'bg-graphinEdgeRed'},
        {explanation: t('mediumConnection'), color: 'bg-graphinEdgeYellow'},
        {explanation: t('goodConnection'), color: 'bg-graphinEdgeGreen'},
    ];
}