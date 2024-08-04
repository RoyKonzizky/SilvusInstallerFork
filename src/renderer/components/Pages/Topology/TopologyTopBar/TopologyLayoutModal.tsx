import { useState } from "react";
import { Modal } from "antd";
import { useTranslation } from 'react-i18next';
import TopologyLogo from '../../../../assets/topology.svg';
import { Select } from "antd";
import { useDispatch } from "react-redux";
import { setGraphLayoutType } from "../../../../redux/TopologyGroups/topologyGroupsSlice";

const TopologyLayoutModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    return (
        <div>
            <button className={'text-black h-14 w-14 mt-5 rounded-xl'} onClick={() => setIsOpen(true)}>
                <img className={'bg-black rounded-full border-white border'} src={TopologyLogo} alt={t("graphLayout")} />
            </button>
            <Modal
                title={t('graphLayout')}
                closable={true}
                centered={true}
                open={isOpen}
                className={`flex ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end"} ${i18n.language === 'he' && 'rtl-title'}`}
                footer={false}
                afterClose={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
            >
                <div className="p-4 bg-white rounded flex justify-center items-center h-full" dir="rtl">
                    <Select
                        style={{ width: "60%" }}
                        defaultValue={'dagre'}
                        options={[
                            { value: 'dagre', label: <span>{t('dragOptionLabel')}</span> },
                            { value: 'grid', label: <span>{t('gridOptionLabel')}</span> },
                            { value: 'circular', label: <span>{t('circularOptionLabel')}</span> },
                            { value: 'concentric', label: <span>{t('concentricOptionLabel')}</span> }
                        ]}
                        onSelect={(value) => {
                            dispatch(setGraphLayoutType(value));
                            setIsOpen(false);
                        }}
                        direction={i18n.language === 'en' ? "ltr" : "rtl"}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default TopologyLayoutModal;