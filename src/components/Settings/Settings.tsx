import SettingLine from "./SettingLine/SettingLine.tsx";

function Settings() {
    return (
        <div className="text-3xl">
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center space-y-5 text-2xl">
                    <SettingLine label="PLACE HOLDER 1"/>
                    <SettingLine label="PLACE HOLDER 2"/>
                    <SettingLine label="PLACE HOLDER 3"/>
                </div>
            </div>
        </div>
    );
}

export default Settings;