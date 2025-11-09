import React, { useState, useEffect, useContext } from 'react';
import { DocumentTemplate, Resource, Action } from '../../types';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';
import { usePermissions } from '../../hooks/usePermissions';
import { NotificationContext } from '../../contexts/NotificationContext';
import { CollegeIcon } from '../../components/Icons';

const IDCardPreview: React.FC<{ template: DocumentTemplate, student: any }> = ({ template, student }) => {
    return (
        <div className="p-4">
             <h3 className="text-lg font-semibold text-center mb-4">Live Preview</h3>
            <div
                className="w-80 h-48 rounded-lg shadow-lg p-4 flex flex-col justify-between"
                style={{ backgroundColor: template.config.backgroundColor }}
            >
                <div>
                    <div className="flex items-center justify-between">
                        <img src={template.config.logoUrl} alt="Logo" className="w-12 h-12 rounded-full" />
                        <h2 className="text-right text-lg font-bold text-gray-800">{template.config.title}</h2>
                    </div>
                </div>
                <div className="flex items-end space-x-3">
                    <img src={student.avatarUrl} alt="Student" className="w-16 h-20 object-cover rounded-md border-2 border-white" />
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-700">{student.roll_no}</p>
                        <p className="text-xs text-gray-700">{student.program}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const IDCardTemplateView: React.FC = () => {
    const { can } = usePermissions();
    const { addNotification } = useContext(NotificationContext);
    const [template, setTemplate] = useState<DocumentTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    const canUpdate = can(Resource.TEMPLATES, Action.UPDATE);
    const sampleStudent = { name: 'John Doe', roll_no: 'CSE21A01', program: 'B.Tech Computer Science', avatarUrl: 'https://i.pravatar.cc/150?u=student' };

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            try {
                const tmpl = await api.getDocumentTemplate('student_id_card');
                if (tmpl) setTemplate(tmpl);
            } catch (error) {
                addNotification('Failed to load template', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, []);

    const handleSave = async () => {
        if (!template) return;
        try {
            await api.saveDocumentTemplate(template);
            addNotification('Template saved successfully', 'success');
        } catch (error) {
            addNotification('Failed to save template', 'error');
        }
    };
    
    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!template) return;
        const { name, value } = e.target;
        setTemplate({
            ...template,
            config: {
                ...template.config,
                [name]: value
            }
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!template) {
        return <p>Template not found.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text mb-6">ID Card Template Designer</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-subtle">
                    <h2 className="text-xl font-bold mb-4">Editor</h2>
                     <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Card Title</label>
                            <input type="text" name="title" id="title" value={template.config.title} onChange={handleConfigChange} disabled={!canUpdate} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
                            <input type="text" name="logoUrl" id="logoUrl" value={template.config.logoUrl} onChange={handleConfigChange} disabled={!canUpdate} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Background Color</label>
                            <input type="color" name="backgroundColor" id="backgroundColor" value={template.config.backgroundColor} onChange={handleConfigChange} disabled={!canUpdate} className="mt-1 h-10 w-10 p-1 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                     {canUpdate && (
                        <div className="mt-8 border-t pt-5 flex justify-end">
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Save Template</button>
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-subtle">
                   <IDCardPreview template={template} student={sampleStudent} />
                </div>
            </div>
        </div>
    );
};

export default IDCardTemplateView;
