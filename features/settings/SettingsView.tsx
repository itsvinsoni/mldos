
import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Resource, Action } from '../../types';
import { NotificationContext } from '../../contexts/NotificationContext';

const SettingsView: React.FC = () => {
    const { settings, saveSettings, loading } = useContext(SettingsContext);
    const { addNotification } = useContext(NotificationContext);
    const { can } = usePermissions();
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const canUpdate = can(Resource.ADMIN, Action.UPDATE);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveSettings(localSettings);
        addNotification('Settings saved successfully!', 'success');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <p>Loading settings...</p>;

    if (!can(Resource.ADMIN, Action.READ)) {
        return <p>You do not have permission to view this page.</p>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text mb-6">Application Settings</h1>
            <div className="bg-white p-6 rounded-2xl shadow-subtle max-w-2xl">
                <form onSubmit={handleSave}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="appName" className="block text-sm font-medium text-gray-700">
                                Application Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="appName"
                                    id="appName"
                                    className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                                    value={localSettings.appName}
                                    onChange={handleChange}
                                    disabled={!canUpdate}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                This will appear in the header and login page.
                            </p>
                        </div>
                        
                        <div>
                            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700">
                                Primary Theme Color
                            </label>
                            <div className="mt-1 flex items-center space-x-3">
                                <input
                                    type="color"
                                    name="themeColor"
                                    id="themeColor"
                                    className="h-10 w-10 p-1 border border-gray-300 rounded-md"
                                    value={localSettings.themeColor}
                                    onChange={handleChange}
                                    disabled={!canUpdate}
                                />
                                 <input
                                    type="text"
                                    className="block w-full max-w-xs shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                                    value={localSettings.themeColor}
                                    onChange={handleChange}
                                    disabled={!canUpdate}
                                />
                            </div>
                             <p className="mt-2 text-sm text-gray-500">
                                Used for buttons, links, and highlights throughout the application.
                            </p>
                        </div>
                    </div>
                    <div className="pt-5 mt-5 border-t">
                        <div className="flex justify-end">
                            {canUpdate && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors"
                                >
                                    Save Settings
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsView;
