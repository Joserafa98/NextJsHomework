import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'List for CXGOAPP',
};

export default function Page() {
    const improvements = [
        'Bug in downloads',
        'Option to delete items in CXGOEditor history',
        'Token count in Brand Identity',
        'Visual bug: download count disappears when clicking the upgrade button (only happens for pro users)',
    ];

    return (
        <main className="p-6">
            <h1 className="text-center text-2xl text-gray-800 mb-8">
                List of Things to Improve in CXGO
            </h1>
            <ul className="max-w-2xl mx-auto space-y-3">
                {improvements.map((item, index) => (
                    <li 
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </main>
    );
}