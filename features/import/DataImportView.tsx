import React, { useState } from 'react';
import { UploadIcon } from '../../components/Icons';

type ImportStep = 'select' | 'upload' | 'map' | 'review' | 'done';

const DataImportView: React.FC = () => {
    const [step, setStep] = useState<ImportStep>('select');
    const [dataType, setDataType] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleDataTypeSelect = (type: string) => {
        setDataType(type);
        setStep('upload');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    
    const renderStepContent = () => {
        switch (step) {
            case 'select':
                return (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-6">What data would you like to import?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {['Students', 'Faculty', 'Fee Receipts', 'Inventory Items', 'Courses'].map(type => (
                                <button key={type} onClick={() => handleDataTypeSelect(type)} className="p-6 bg-gray-50 rounded-lg text-center hover:bg-brand-orange-light hover:text-brand-orange-dark transition-colors">
                                    <span className="font-semibold">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'upload':
                return (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-2">Upload {dataType} Data</h2>
                        <p className="text-center text-gray-500 mb-6">Please upload a CSV or Excel file.</p>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-orange hover:text-brand-orange-dark focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                {file ? <p className="text-sm text-gray-500">{file.name}</p> : <p className="text-xs text-gray-500">CSV, XLSX up to 10MB</p>}
                            </div>
                        </div>
                         <div className="mt-6 flex justify-between">
                            <button onClick={() => setStep('select')} className="px-4 py-2 bg-gray-200 rounded">Back</button>
                            <button onClick={() => setStep('map')} disabled={!file} className="px-4 py-2 bg-brand-orange text-white rounded disabled:bg-gray-400">Next: Map Fields</button>
                        </div>
                    </div>
                );
            case 'map':
                 return <div className="text-center"><h2 className="text-xl font-bold">Field Mapping (Placeholder)</h2><p>This is where you would map your file columns to the database fields.</p><button onClick={() => setStep('upload')} className="mt-4 px-4 py-2 bg-gray-200 rounded">Back</button></div>;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text mb-6">Data Import Wizard</h1>
            <div className="bg-white p-8 rounded-2xl shadow-subtle max-w-3xl mx-auto">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default DataImportView;
