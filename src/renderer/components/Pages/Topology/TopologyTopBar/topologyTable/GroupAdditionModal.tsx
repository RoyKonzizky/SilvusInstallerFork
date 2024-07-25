import {useState} from "react";
import {Button, Input, Modal} from "antd";
import {IUserNode} from "@antv/graphin";
import {useTranslation} from 'react-i18next';

interface IGroupAdditionModal {
    groups: string[],
    nodes: IUserNode[],
    onAdd: (groupName: string) => void,
    isSmall: boolean,
}

export function GroupAdditionModal(props: IGroupAdditionModal) {
    const [modalState, setModalState] = useState(false);
    const [groupName, setGroupName] = useState("");
    const {t} = useTranslation();

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    const handleAddGroup = () => {
        if (groupName.trim() && !props.groups.includes(groupName)) {
            props.onAdd(groupName);
            setGroupName("");
            closeModal();
        }
    };

    return (
        <div>
            <Button className={props.isSmall ? 'text-black h-14 w-20 m-5 rounded-xl mr-[55vh]' :
                'text-black h-14 w-20 m-5 rounded-xl'} onClick={openModal}>
                {t("AddGroup")}
            </Button>
            <Modal closable={true} centered={true} open={modalState} onCancel={closeModal} title={t("AddGroup")}
                   footer={[
                       <Button key={"cancel"} onClick={closeModal}>{t('cancel')}</Button>,
                       <Button className={'text-black border'} key={"add"} onClick={handleAddGroup}>{t('add')}</Button>
                   ]}
            >
                <Input placeholder={t('InsertGroupName')} value={groupName}
                       onChange={(e) => setGroupName(e.target.value)}/>
            </Modal>
        </div>
    );
}
