import {useState} from 'react';
import hideNodesIcon from "../../../../../assets/hideNodesIcon.svg";
import { useTranslation } from 'react-i18next';
import {HideNodesChecklist} from "./HideNodesChecklist.tsx";
import {Modal} from "antd";

export function HideNodesModal() {
    const [modalState, setModalState] = useState(false);
    const { t, i18n } = useTranslation();

    return (
        <div>
            <button className={'h-14 w-14 mt-5 rounded-full border border-white'} onClick={() => setModalState(true)}>
                <img className={'rounded-full h-14 w-14'} src={hideNodesIcon} alt={t("hideNodes")} />
            </button>
            <Modal open={modalState}
                   centered={true}
                   className={`flex ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end"}`}
                   title={t("hideNodes")}
                   footer={null}
                   closable={true}
                   onCancel={() => setModalState(false)}
                   afterClose={() => setModalState(false)}>
                <HideNodesChecklist />
            </Modal>
        </div>
    );
}