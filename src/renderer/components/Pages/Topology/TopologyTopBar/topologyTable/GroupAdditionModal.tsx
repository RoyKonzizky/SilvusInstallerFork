import { useState } from "react";
import { Button, Input, Modal } from "antd";
import { IUserNode } from "@antv/graphin";

interface IGroupAdditionModal {
    selectedOptions: { [group: string]: { [nodeId: string]: number } };
    groups: string[];
    nodes: IUserNode[];
    onAdd: (groupName: string) => void;
}

export function GroupAdditionModal(props: IGroupAdditionModal) {
    const [modalState, setModalState] = useState(false);
    const [groupName, setGroupName] = useState("");

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
            <Button className={'text-black h-14 w-20 m-5 rounded-xl'} onClick={openModal}>
                Add Group
            </Button>
            <Modal closable={true} centered={true} open={modalState} onCancel={closeModal} title={"Add group"}
                footer={[
                    <Button key={"cancel"} onClick={closeModal}>Cancel</Button>,
                    <Button className={'text-black border'} key={"add"} onClick={handleAddGroup}>Add</Button>
                ]}
            >
                <Input placeholder={"Insert group name"} value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}/>
            </Modal>
        </div>
    );
}
